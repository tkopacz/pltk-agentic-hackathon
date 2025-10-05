@description('Prefix used to generate resource names (e.g. octocat)')
param namePrefix string
@description('Azure region for all resources; use resource group location when invoking module')
param location string
@description('Environment label such as staging or production')
param environmentName string
@description('Resource ID of the Azure Container Registry that stores the container images')
param acrResourceId string
@description('Login server of the Azure Container Registry (e.g. octocat.azurecr.io)')
param acrLoginServer string
@description('Tag for container images (usually the Git commit SHA)')
param imageTag string
@description('Resource ID of the Log Analytics workspace for diagnostics routing')
param logAnalyticsWorkspaceId string
@description('Connection string for Application Insights workspace-based resource')
param appInsightsConnectionString string
@description('Name of the repository inside ACR that stores the API image')
param apiImageRepository string = 'octocat-api'
@description('Name of the repository inside ACR that stores the frontend image')
param frontendImageRepository string = 'octocat-frontend'
@description('Additional origins to append to API CORS allow list (must include schema)')
param additionalCorsOrigins array = []

var normalizedPrefix = toLower(replace(namePrefix, '--', '-'))
var normalizedEnv = toLower(environmentName)
var uniqueSuffix = uniqueString(resourceGroup().id, normalizedPrefix, normalizedEnv)
var planName = take('${normalizedPrefix}-plan-${uniqueSuffix}', 60)
var apiSiteName = take('${normalizedPrefix}-api-${uniqueSuffix}', 60)
var frontendSiteName = take('${normalizedPrefix}-fe-${uniqueSuffix}', 60)
var apiImage = '${toLower(acrLoginServer)}/${apiImageRepository}:${imageTag}'
var frontendImage = '${toLower(acrLoginServer)}/${frontendImageRepository}:${imageTag}'
var frontendHostname = format('{0}.azurewebsites.net', frontendSiteName)
var apiHostname = format('{0}.azurewebsites.net', apiSiteName)
var defaultCorsOrigins = [format('https://{0}', frontendHostname)]
var corsOrigins = concat(defaultCorsOrigins, additionalCorsOrigins)

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    capacity: 1
  }
  properties: {
    reserved: true
  }
  tags: {
    environment: normalizedEnv
    containerRegistry: acrResourceId
  }
}

resource apiSite 'Microsoft.Web/sites@2023-12-01' = {
  name: apiSiteName
  location: location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'DOCKER|${apiImage}'
      acrUseManagedIdentityCreds: true
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'NODE_ENV'
          value: normalizedEnv
        }
        {
          name: 'API_CORS_ORIGINS'
          value: join(corsOrigins, ',')
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
      ]
      cors: {
        allowedOrigins: corsOrigins
        supportCredentials: false
      }
    }
  }
  tags: {
    environment: normalizedEnv
    service: 'api'
    containerRegistry: acrResourceId
  }
}

resource frontendSite 'Microsoft.Web/sites@2023-12-01' = {
  name: frontendSiteName
  location: location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'DOCKER|${frontendImage}'
      acrUseManagedIdentityCreds: true
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'NODE_ENV'
          value: normalizedEnv
        }
        {
          name: 'API_HOST'
          value: apiHostname
        }
        {
          name: 'API_PORT'
          value: '80'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
      ]
    }
  }
  tags: {
    environment: normalizedEnv
    service: 'frontend'
    containerRegistry: acrResourceId
  }
}

resource apiDiag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${apiSite.name}-diagnostics'
  scope: apiSite
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
      {
        category: 'AppServicePlatformLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

resource frontendDiag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${frontendSite.name}-diagnostics'
  scope: frontendSite
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
      {
        category: 'AppServicePlatformLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

output apiAppName string = apiSite.name
output apiHostname string = apiHostname
output apiResourceId string = apiSite.id
output apiPrincipalId string = apiSite.identity.principalId
output frontendAppName string = frontendSite.name
output frontendHostname string = frontendHostname
output frontendResourceId string = frontendSite.id
output frontendPrincipalId string = frontendSite.identity.principalId
output appServicePlanId string = plan.id

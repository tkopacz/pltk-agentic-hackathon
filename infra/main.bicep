targetScope = 'resourceGroup'

@description('Environment label such as staging or production (used for naming and configuration).')
param environmentName string
@description('Base application name used to construct resource names (e.g. octocat).')
param appName string
@description('Name of the existing Azure Container Registry that stores application images.')
param acrName string
@description('Tag to deploy for both API and frontend images (use Git short SHA).')
param imageTag string = 'latest'
@description('Repository name inside ACR for the API image.')
param apiImageRepository string = 'octocat-api'
@description('Repository name inside ACR for the frontend image.')
param frontendImageRepository string = 'octocat-frontend'
@description('Additional origins to append to API CORS allow list (must include schema).')
param additionalCorsOrigins array = []

var location = resourceGroup().location
var normalizedApp = toLower(replace(appName, '--', '-'))

resource acr 'Microsoft.ContainerRegistry/registries@2022-12-01' existing = {
  name: acrName
}

@description('Log Analytics workspace and Application Insights instrumentation')
module observability 'modules/logAnalytics.bicep' = {
  name: 'observability'
  params: {
    namePrefix: normalizedApp
    location: location
    environmentName: environmentName
  }
}

var acrLoginServer = acr.properties.loginServer
var acrResourceId = acr.id

module web 'modules/webapps.bicep' = {
  name: 'webapps'
  params: {
    namePrefix: normalizedApp
    location: location
    environmentName: environmentName
    acrResourceId: acrResourceId
    acrLoginServer: acrLoginServer
    imageTag: imageTag
    logAnalyticsWorkspaceId: observability.outputs.logAnalyticsWorkspaceId
    appInsightsConnectionString: observability.outputs.applicationInsightsConnectionString
    apiImageRepository: apiImageRepository
    frontendImageRepository: frontendImageRepository
    additionalCorsOrigins: additionalCorsOrigins
  }
}

output apiHostname string = format('https://{0}', web.outputs.apiHostname)
output apiAppName string = web.outputs.apiAppName
output frontendHostname string = format('https://{0}', web.outputs.frontendHostname)
output frontendAppName string = web.outputs.frontendAppName
output appServicePlanId string = web.outputs.appServicePlanId
output logAnalyticsWorkspaceId string = observability.outputs.logAnalyticsWorkspaceId
output applicationInsightsId string = observability.outputs.applicationInsightsId

param namePrefix string
param location string
param environmentName string

var baseName = toLower(replace('${namePrefix}-${environmentName}', '--', '-'))
var uniqueSuffix = uniqueString(resourceGroup().id, baseName)
var workspaceName = take('${baseName}-log-${uniqueSuffix}', 63)
var appInsightsName = take('${baseName}-appi-${uniqueSuffix}', 63)

resource logWorkspace 'Microsoft.OperationalInsights/workspaces@2020-08-01' = {
  name: workspaceName
  location: location
  properties: {
    retentionInDays: 30
    features: {
      legacy: 0
      searchVersion: 2
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    Request_Source: 'rest'
    WorkspaceResourceId: logWorkspace.id
  }
}

output logAnalyticsWorkspaceId string = logWorkspace.id
output logAnalyticsWorkspaceCustomerId string = logWorkspace.properties.customerId
output applicationInsightsId string = appInsights.id
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString

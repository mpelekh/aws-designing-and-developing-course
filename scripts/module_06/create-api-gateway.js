// Imports
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const apiG = new AWS.APIGateway();
const apiName = "hamster-api";

let apiData;

createRestApi(apiName)
  .then((data) => {
    apiData = data;
    return getRootResource(apiData);
  })
  .then((rootResourceId) => createResource(rootResourceId, "hbfl", apiData))
  .then((hbflResourceId) =>
    createResourceMethod(hbflResourceId, "GET", apiData)
  )
  .then((hbflResourceId) =>
    createMethodIntegration(hbflResourceId, "GET", apiData)
  )
  .then((hbflResourceId) => createResource(hbflResourceId, "{proxy+}", apiData))
  .then((proxyResourceId) =>
    createResourceMethod(proxyResourceId, "ANY", apiData, "proxy")
  )
  .then((proxyResourceId) =>
    createMethodIntegration(proxyResourceId, "ANY", apiData, "proxy")
  )
  .then((data) => console.log(data));

function createRestApi(apiName) {
  const params = {
    name: apiName,
  };

  return apiG.createRestApi(params).promise();
}

function getRootResource(api) {
  const params = {
    restApiId: api.id,
  };

  return apiG
    .getResources(params)
    .promise()
    .then((data) => data.items.find((r) => r.path === "/").id);
}

function createResource(parentResourceId, resourcePath, api) {
  const params = {
    parentId: parentResourceId,
    pathPart: resourcePath,
    restApiId: api.id,
  };

  return apiG
    .createResource(params)
    .promise()
    .then((data) => data.id);
}

function createResourceMethod(resourceId, method, api, path) {
  const params = {
    authorizationType: "NONE",
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id,
  };

  if (path) {
    params.requestParameters = {
      [`method.request.path.${path}`]: true,
    };
  }

  return apiG
    .putMethod(params)
    .promise()
    .then(() => resourceId);
}

function createMethodIntegration(resourceId, method, api, path) {
  const params = {
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id,
    integrationHttpMethod: method,
    type: "HTTP_PROXY",
    uri: "http://hamsterELB-1068611378.us-east-1.elb.amazonaws.com",
  };

  if (path) {
    params.uri += `/{${path}}`;
    params.requestParameters = {
      [`integration.request.path.${path}`]: `method.request.path.${path}`,
    };
  }

  return apiG
    .putIntegration(params)
    .promise()
    .then(() => resourceId);
}

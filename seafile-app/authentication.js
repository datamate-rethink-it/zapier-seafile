"use strict";

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) => {
  if (!bundle.authData.serverUrl.match(/^https?:\/\/.+[^/]$/)) {
    throw new z.errors.Error(
      "Please correct the Server URL. It must begin with https:// and should not end with a trailing slash (/). For example: https://your-seafile-server.com."
    );
  }
  z.request({ url: bundle.authData.serverUrl + "/api2/auth/ping/" });
};

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      "The API Key you supplied is incorrect",
      "AuthenticationError",
      response.status
    );
  }

  return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiToken = (request, z, bundle) => {
  if (bundle.authData.apiToken) {
    request.headers.Authorization = "Bearer " + bundle.authData.apiToken;
  }

  return request;
};

module.exports = {
  config: {
    // "custom" is the catch-all auth type. The user supplies some info and Zapier can
    // make authenticated requests with it
    type: "custom",

    // Define any input app's auth requires here. The user will be prompted to enter
    // this info when they connect their account.
    fields: [
      {
        key: "serverUrl",
        required: true,
        label: "Server",
        type: "string",
        default: "https://your-seafile-server-url",
        helpText: "The public url of your Seafile Server.",
      },
      {
        key: "apiToken",
        required: true,
        label: "Account-Token (for your user)",
        type: "string",
        helpText:
          "Create an [Account-Token](https://seafile-api.readme.io/reference/post_api2-auth-token) to grant Zapier access to your Seafile Server.",
      },
    ],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenever a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: "{{serverUrl}}",
  },
  befores: [includeApiToken],
  afters: [handleBadResponses],
};

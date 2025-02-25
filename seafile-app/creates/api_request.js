function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const perform = async (z, bundle) => {
  const regex = /^\/api(2|\/v2.1)\/.*/;
  if (!regex.test(bundle.inputData.endpoint)) {
    throw new Error(
      "The URL of your request must start with either /api2/ or /api/v2.1/. Please change the URL and try again."
    );
  }

  // build query params
  let queryString = "";
  if (
    bundle.inputData.querys &&
    typeof bundle.inputData.querys === "object" &&
    bundle.inputData.querys.length > 0
  ) {
    queryString = Object.keys(bundle.inputData.querys)
      .map(function (key) {
        return key + "=" + bundle.inputData.querys[key];
      })
      .join("&");
    queryString = `?${queryString}`;
  }

  // check body input
  let bodyContent = {};
  z.console.log("inputDataRaw.body", bundle.inputData.body);
  if (!isJsonString(bundle.inputData.body)) {
    throw new Error("Your body seems to be no valid JSON.");
  } else {
    bodyContent = JSON.parse(bundle.inputData.body);
  }

  const request = {
    url: `${bundle.authData.serverUrl}${bundle.inputData.endpoint}${queryString}`,
    method: `${bundle.inputData.http_method}`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: bodyContent,
  };
  z.console.log("API Request", request);

  const response = await z.request(request);
  return response.data;
};

module.exports = {
  key: "api_request",
  noun: "API Request",

  display: {
    label: "API Request (Beta)",
    description:
      "This is an advanced action to execute a Seafile API call via Zapier. This is useful if you would like to use an API endpoint that Zapier doesn't implement yet. You can get all possible requests and their parameters from the https://seafile-api.readme.io/reference.",
  },

  operation: {
    perform,

    inputFields: [
      {
        key: "http_method",
        required: true,
        label: "HTTP Method",
        choices: { POST: "POST", GET: "GET", PUT: "PUT", DELETE: "DELETE" },
      },
      {
        key: "endpoint",
        required: true,
        label: "URL",
        helpText:
          "The URL has to start with */api2/* or */api/v2.1/*. All possible requests can be found at the [Seafile API Reference](https://seafile-api.readme.io/reference).",
        type: "string",
      },
      {
        key: "alert",
        type: "copy",
        helpText: "The Authentication header is included automatically.",
      },
      {
        key: "querys",
        label: "Query String Parameters",
        helpText:
          "These params will be URL-encoded and appended to the URL when making the request.",
        dict: true,
      },
      {
        key: "body",
        required: false,
        label: "Body",
        helpText:
          'Only valid JSON is accepted. Zapier will pass anything you enter as raw input. For example, `{"foo", "bar"}` is perfectly valid. Of cause you can use variables from Zapier inside your JSON.',
        type: "text",
        default: "{}",
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      success: true,
      commit_id: "fff6d175a1547719d4c09cc1caf1156bee2e064f",
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      { key: "commit_id", label: "ID" },
      { key: "success", label: "Success", type: "boolean" },
    ],
  },
};

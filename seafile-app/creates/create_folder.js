// create a particular delete_file by name
const perform = async (z, bundle) => {
  if (bundle.inputData.path == "/") {
    throw new z.errors.Error(`/ is not allowed.`);
  } else if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  const response = await z.request({
    method: "POST",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/dir/?p=${bundle.inputData.path}`,
    form: {
      operation: "mkdir",
      create_parents: true,
    },
    json: true,
  });

  // this should return a single object
  if (response.data == "success") {
    return {
      id: `${bundle.inputData.repo}${bundle.inputData.path}`,
      repo_id: bundle.inputData.repo,
      path: bundle.inputData.path,
      status: "success",
    };
  }

  throw new z.errors.Error(
    `An unknown error occurred: ${response.data.error_msg}.`
  );
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: "create_folder",
  noun: "Create Folder",

  display: {
    label: "Create Folder",
    description: "Creates a new folder at the path you specify.",
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {
        key: "repo",
        label: "Library",
        type: "string",
        helpText: "Libary Name or ID.",
        dynamic: "intern_repos.id.name",
        altersDynamicFields: true,
        required: true,
      },
      {
        key: "path",
        label: "Folder Path",
        type: "string",
        placeholder: "/invoices/2024",
        helpText:
          "Missing parent folders will be automatically created if needed when specifying a longer path.",
        required: true,
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: "10d4c707-31a1-47d6-9332-a592991cb139/invoices",
      status: "success",
      repo_id: "10d4c707-31a1-47d6-9332-a592991cb139",
      path: "/invoices",
    },

    outputFields: [
      { key: "id", label: "Library and path", type: "string" },
      { key: "status", label: "Status", type: "string" },
      { key: "repo_id", label: "Library ID" },
      { key: "path", label: "Path" },
    ],
  },
};

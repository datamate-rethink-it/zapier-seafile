// create a particular text_file by name
const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  // generate upload-link
  const response = await z.request({
    method: "DELETE",
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/file/`,
    params: {
      p: bundle.inputData.path,
    },
    json: true,
  });

  console.log(response.data);
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: "delete_file",
  noun: "Delete Text File",

  display: {
    label: "Delete File",
    description: "Creates a new text file from plain text content you specify.",
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
        label: "File Path",
        type: "string",
        placeholder: "/invoices/2024/customer.pdf",
        helpText: "Provide the file name with complete path.",
        required: true,
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
      { key: "success", label: "Success" },
    ],
  },
};

// create a particular text_file by name
const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The source path must start with a /.`);
  }

  // generate upload-link
  const response = await z.request({
    method: "POST",
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/file/`,
    params: {
      p: bundle.inputData.path,
    },
    body: {
      operation: "rename",
      newname: bundle.inputData.new_file_name,
    },
    json: true,
  });

  console.log(response.data);
  return response.data;
};

module.exports = {
  key: "rename_file",
  noun: "Rename File",

  display: {
    label: "Rename File",
    description: "Renames a file.",
  },

  operation: {
    perform,

    inputFields: [
      {
        key: "repo",
        label: "Source Library",
        type: "string",
        helpText: "Libary Name or ID.",
        dynamic: "intern_repos.id.name",
        altersDynamicFields: true,
        required: true,
      },
      {
        key: "path",
        label: "Source File Path",
        type: "string",
        placeholder: "/invoices/2024/customer.pdf",
        helpText: "Provide the file name with complete path.",
        required: true,
      },
      {
        key: "new_file_name",
        label: "New File Name",
        type: "string",
        placeholder: "new-filename.pdf",
        helpText: "Provide the new file name (without any path)",
        required: true,
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      type: "file",
      repo_id: "92ce82d6-7432-4fd3-b75e-303fcaf9d4b4",
      parent_dir: "/",
      obj_name: "new-invoice.md",
      obj_id: "1eecbc923b248fbf53e8523dc6058ee784f11b14",
      size: 416,
      mtime: "2024-12-24T11:16:20+01:00",
      is_locked: false,
      can_preview: true,
      can_edit: true,
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      { key: "repo_id", label: "Target Repo ID", type: "string" },
      { key: "obj_name", label: "New File Name", primary: true },
      { key: "mtime", label: "Modify Time", primary: true },
      { key: "obj_id", label: "Object ID", primary: true },
    ],
  },
};

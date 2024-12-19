// required for file upload
const FormData = require("form-data");

// create a particular text_file by name
const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  // relative path and replace
  const relative_path = bundle.inputData.path.replace(/^\/|\/$/g, "");
  const replace = bundle.inputData.overwrite === 'yes' ? 1 : 0;

  // generate upload-link
  const response = await z.request({
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/upload-link/?p=/`,
    json: true,
  });
  uploadLink = response.data;
  //console.log(uploadLink);

  // prepare the upload of the file
  const binaryData = Buffer.from(bundle.inputData.content, "utf-8");
  const formData = new FormData();
  formData.append("parent_dir", "/");
  formData.append("relative_path", relative_path);
  formData.append("replace", replace);
  formData.append("file", binaryData, {
    filename: bundle.inputData.name,
    contentType: binaryData.mimeType,
  });

  const options = {
    method: "POST",
    url: uploadLink,
    params: {
      "ret-json": 1,
    },
    headers: {
      ...formData.getHeaders(),
    },
    body: formData,
  };

  // Make the request
  const response2 = await z.request(options);
  return response2.data[0];
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: "create_text_file",
  noun: "Text File",

  display: {
    label: "Create Text File",
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
        label: "Folder Path",
        type: "string",
        placeholder: "/invoices/2024",
        helpText:
          "Missing parent folders will be automatically created if needed when specifying a longer path.",
        required: true,
      },
      {
        key: "name",
        label: "File Name",
        type: "string",
        required: true,
      },
      {
        key: "content",
        label: "File Content",
        type: "text",
        required: true,
        helpText: "blubeer die blub...",
      },
      {
        key: "overwrite",
        label: "Overwrite Existing",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "no",
        helpText:
          "Whether force that an existing file is overwritten. Otherwise the filename is extended with an number in brackets like `invoice (1).pdf`.",
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: "03fbe8c928fbedc0e4cd606376103042fb58c5df",
      name: "binary.txt",
      size: 6,
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      { key: "id", label: "ID" },
      { key: "name", label: "File Name" },
      { key: "size", label: "File Size", type: "integer" },
    ],
  },
};

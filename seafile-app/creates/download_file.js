const hydrators = require("../hydrators");

const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  // get download_url
  const response = await z.request({
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/file/`,
    params: {
      p: bundle.inputData.path + bundle.inputData.name,
    },
    json: true,
  });

  if (bundle.inputData.link_only === "yes") {
    return {
      download_link: response.data,
    };
  }

  return {
    id: bundle.inputData.path + bundle.inputData.name,
    download_link: response.data,
    file: z.dehydrateFile(hydrators.downloadFile, { url: response.data }),
  };
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: "download_file",
  noun: "Download File",

  display: {
    label: "Download File",
    description: "Downloads a file from Seafile.",
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
        dynamic: "intern_folders.id.name",
        altersDynamicFields: true,
        helpText: "Provide the path of the file to download.",
        required: true,
      },
      {
        key: "name",
        label: "File Name",
        type: "string",
        required: true,
      },
      {
        key: "link_only",
        label: "Download Link Only",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "no",
        helpText: "Whether to return the file or just the download link",
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: "97d11dd151f14924ed443774b84175ff678e8371",
      name: "mountain.png",
      size: 26111,
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

const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`Path has to start with /`);
  }

  // filters
  const filters = {};
  if (bundle.inputData.output == "f" || bundle.inputData.output == "d") {
    filters.t = bundle.inputData.output;
  }
  filters.recursive = bundle.inputData.recursive === 'yes' ? "1" : "0";

  const response = await z.request({
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/dir/`,
    params: {
      p: bundle.inputData.path,
      ...filters,
    },
    json: true,
  });

  return [
    {
      items: response.data,
    },
  ];
};

module.exports = {
  key: "find_files_folders",
  noun: "Files or Folders",

  display: {
    label: "Find Files and Folders (With Line Item Support)",
    description: "Returns the files and folders in a given folder.",
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
        helpText: "The ...",
        required: true,
      },
      {
        key: "q",
        type: "string",
        label: "Search Term",
        helpText: "Search String.",
        placeholder: "customer",
        required: true,
      },
      {
        key: "output",
        label: "Output Type",
        type: "string",
        choices: [
          { label: "Files & Folders", sample: "all", value: "all" },
          { label: "Files", sample: "f", value: "f" },
          { label: "Folders", sample: "d", value: "d" },
        ],
        required: true,
      },
      {
        key: "recursive",
        label: "Recursive",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "no",
        required: true,
        helpText:
          "Whether the find operation will be applied recursively to all subfolders and the response will contain contents of all subfolders. The default for this field is No.",
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: "10d4c707-31a1-47d6-9332-a592991cb139/v234",
    },

    outputFields: [{ key: "id", label: "Library and path", type: "string" }],
  },
};

const listNewFiles = async (z, bundle) => {
  const params = {};

  if (bundle.inputData.repo) {
    params.repo_id = bundle.inputData.repo;
  }
  if (bundle.inputData.q) {
    params.q = bundle.inputData.q;
  }

  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api/v2.1/search-file/`,
    params: params,
  };

  const response = await z.request(requestOptions);

  // Add an 'id' field to each item in the response
  return response.data.data.map((item) => ({
    ...item,
    id: item.path + "__" + item.mtime, // Use the file path and modify time as a unique identifier
  }));
};

module.exports = {
  key: "new_file",
  noun: "File",
  display: {
    label: "New File",
    description: "Triggers when a new file is found in a library.",
  },
  operation: {
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
        key: "q",
        type: "string",
        helpText: "Search String.",
        required: true,
      },
    ],

    perform: listNewFiles,
    sample: {
      id: "/test.md__2024-12-17T12:58:06+01:00",
      path: "/test.md",
      size: 0,
      type: "file",
      mtime: "2024-12-17T12:58:06+01:00",
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "path", label: "Created At", type: "string" },
      { key: "size", label: "Size", type: "integer" },
      { key: "type", label: "Typ", type: "string" },
      { key: "mtime", label: "Modified At", type: "string" },
    ],
  },
};

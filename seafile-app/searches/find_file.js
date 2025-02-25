const perform = async (z, bundle) => {
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
  key: "find_file",
  noun: "File",
  display: {
    label: "Find File",
    description: "Returns the file ...",
  },
  operation: {
    perform,

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
        label: "Search Term",
        helpText: "Search String (with or without path).",
        placeholder: "/invoices/2024/customer.pdf or customer.pdf",
        required: true,
      },
    ],

    sample: {
      id: "/test.md__2024-12-17T12:58:06+01:00",
      path: "/test.md",
      size: 0,
      type: "file",
      mtime: "2024-12-17T12:58:06+01:00",
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "path", label: "Path", type: "string" },
      { key: "size", label: "Size", type: "integer" },
      { key: "type", label: "Typ", type: "string" },
      { key: "mtime", label: "Modified At", type: "string" },
    ],
  },
};

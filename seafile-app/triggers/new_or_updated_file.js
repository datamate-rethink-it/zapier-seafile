const perform = async (z, bundle) => {
  const params = {
    t: "f",
    p: bundle.inputData.path,
    recursive: bundle.inputData.recursive ? "1" : "0",
  };

  /*if (bundle.inputData.recursive) {
    params.recursive = "1";
  }*/

  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/dir/`,
    params: params,
  };

  const response = await z.request(requestOptions);
  console.log(response);

  // Add an 'id' field to each item in the response
  return response.data.map((item) => ({
    ...item,
    file_id: item.id,
    id: item.id + "__" + item.mtime, // Use the ...
  }));
};

module.exports = {
  key: "new_or_updated_file",
  noun: "New or Updated File",
  display: {
    label: "New or Updated File",
    description: "Triggers when a new or updated file is found in a library.",
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
        key: "path",
        label: "Path",
        type: "string",
        helpText: "Path.",
        dynamic: "intern_folders.id.name",
        altersDynamicFields: true,
        required: true,
      },
      {
        key: "recursive",
        label: "Include files in subfolders?",
        type: "boolean",
        required: false,
      },
      {
        key: "download",
        label: "Include file contents?",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "yes",
        required: true,
        altersDynamicFields: false,
        helpText:
          "Choose whether to download the file. Set this to NO to exclude file contents and only get the file information.",
      },
    ],

    sample: {
      id: "71d8bd8b10b99f3b739cfd61b19666f5a722687f__1734505610",
      file_id: "71d8bd8b10b99f3b739cfd61b19666f5a722687f",
      type: "file",
      modifier_email: "37552c94ff1a4783b58f325a75e18df8@auth.local",
      size: 63179,
      is_locked: false,
      lock_owner: null,
      lock_time: 0,
      locked_by_me: false,
      parent_dir: "/",
      name: "comramo.png",
      mtime: 1734505610,
      permission: "rw",
      modifier_contact_email: "hulk@datamate.org",
      modifier_name: "Hulk",
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "parent_dir", label: "Path", type: "string" },
      { key: "size", label: "Size", type: "integer" },
      { key: "type", label: "Typ", type: "string" },
      { key: "mtime", label: "Modified At", type: "string" },
      { key: "modifier_contact_email", label: "Contact E-Mail" },
    ],
  },
};

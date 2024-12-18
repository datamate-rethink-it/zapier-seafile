const perform = async (z, bundle) => {
  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/tagged-files/${bundle.inputData.tag}`,
  };

  const response = await z.request(requestOptions);
  //console.log(response);
  //return response.data;

  // Add an 'id' field to each item in the response
  return response.data.tagged_files.map((item) => ({
    ...item,
    id: item.file_tag_id + "__" + item.parent_path + item.filename, // Use the ...
  }));
};

module.exports = {
  key: "new_tagged_file",
  noun: "New Tagged File",
  display: {
    label: "New Tagged File",
    description: "Triggers when a specific tag is assigned to a file.",
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
        key: "tag",
        label: "Tag",
        type: "string",
        helpText:
          "If there are no tags available, you have to create one first in Seafile",
        dynamic: "intern_tags.id.name",
        altersDynamicFields: true,
        required: true,
      },
    ],

    sample: {
      id: "adfaf",
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

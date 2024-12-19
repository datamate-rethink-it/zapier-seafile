const hydrators = require("../hydrators");

const SHARE_LINK_EXPIRE_DAYS = 7;

const perform = async (z, bundle) => {
  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/tagged-files/${bundle.inputData.tag}`,
  };

  const response = await z.request(requestOptions);

  // "tagged_files" key is only present if there's at least one result
  if (!response.data.tagged_files) {
    return [];
  }

  const items = [];

  for (const item of response.data.tagged_files) {
    // Remove trailing slash (in case item.parent_dir is '/')
    const parentPath = item.parent_path ? item.parent_path.replace(/\/$/, '') : '';

    // Add an 'id' field to each item
    item.file_id = item.id;
    item.id = item.file_tag_id + "__" + parentPath + '/' + item.filename;

    if (bundle.inputData.download) {
      // Get download_url
      const response = await z.request({
        method: "GET",
        url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/file/`,
        params: {
          p: `${parentPath}/${item.filename}`,
        },
        json: true,
      });

      item.file = z.dehydrateFile(hydrators.downloadFile, { url: response.data })
    }

    if (bundle.inputData.link) {
      // Create share link
      try {
        const response = await z.request({
          method: "POST",
          url: `${bundle.authData.serverUrl}/api/v2.1/share-links/`,
          body: {
            repo_id: bundle.inputData.repo,
            path: `${parentPath}/${item.filename}`,
            expire_days: SHARE_LINK_EXPIRE_DAYS,
            permissions: {
              can_edit: false,
              can_download: true,
              can_upload: false,
            },
          },
          json: true,
        });

        // Attach link to 'item' object
        item.link = response.data.link;
      } catch(e) {
        // TODO: Expose warning to user?
        console.log('Could not create share link: ', e);
      }
    }

    items.push(item);
  }

  return items;
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
      {
        key: "link",
        label: "Include sharing link?",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "yes",
        required: true,
        altersDynamicFields: false,
        helpText: "Choose whether to include a sharing link.",
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
      { key: "mtime", label: "Modified At", type: "integer" },
      { key: "modifier_contact_email", label: "Contact E-Mail" },
    ],
  },
};

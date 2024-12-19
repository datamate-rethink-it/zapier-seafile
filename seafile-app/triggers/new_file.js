const hydrators = require("../hydrators");

const SHARE_LINK_EXPIRE_DAYS = 7;

const perform = async (z, bundle) => {
  const params = {
    t: "f",
    p: bundle.inputData.path,
    recursive: bundle.inputData.recursive === 'yes' ? "1" : "0",
  };

  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/dir/`,
    params: params,
  };

  const response = await z.request(requestOptions);

  const items = [];

  for (const item of response.data) {
    // Remove trailing slash (in case item.parent_dir is '/')
    const parentDir = item.parent_dir ? item.parent_dir.replace(/\/$/, '') : '';

    // Add an 'id' field to each item
    // Use full path (without repo) to uniquely identify the file
    item.file_id = item.id;
    item.id = `${parentDir}/${item.name}`;

    if (bundle.inputData.download) {
      // Get download_url
      const response = await z.request({
        method: "GET",
        url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/file/`,
        params: {
          p: `${parentDir}/${item.name}`,
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
            path: `${parentDir}/${item.name}`,
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
  key: "new_file",
  noun: "New File",
  display: {
    label: "New File",
    description: "Triggers when a new file is found in a library.",
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
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "no",
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
      { key: "mtime", label: "Modified At", type: "integer" },
      { key: "modifier_contact_email", label: "Contact E-Mail" },
    ],
  },
};

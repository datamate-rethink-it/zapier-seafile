const hydrators = require("../hydrators");
const removeTrailingSlash = (str) => str.replace(/\/$/, "");

const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  const params = {
    t: "f",
    p: bundle.inputData.path,
    recursive: bundle.inputData.recursive === "yes" ? "1" : "0",
  };

  const requestOptions = {
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/dir/`,
    params: params,
  };

  const response = await z.request(requestOptions);

  const items = [];

  for (const item of response.data) {
    // ignore entries older than one day in general
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    if (item.mtime > oneDayAgo) {
      // recursive === yes -> parent_dir is set.
      // recursive !== yes -> parent_dir is not set, use bundle.inputData.path instead.
      const fullPath = removeTrailingSlash(
        item.parent_dir ? item.parent_dir : bundle.inputData.path
      );

      // Add an 'id' field to each item (WITHOUT mtime)
      item.file_id = item.id;
      item.id = fullPath + "/" + item.name;

      if (bundle.inputData.download === "yes") {
        // Get download_url
        const response = await z.request({
          method: "GET",
          url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/file/`,
          params: {
            p: `${fullPath}/${item.name}`,
          },
          json: true,
        });

        item.file = z.dehydrateFile(hydrators.downloadFile, {
          url: response.data,
        });
      }

      if (bundle.inputData.link === "yes") {
        // Create share link
        try {
          const response = await z.request({
            method: "POST",
            url: `${bundle.authData.serverUrl}/api/v2.1/share-links/`,
            body: {
              repo_id: bundle.inputData.repo,
              path: `${fullPath}/${item.name}`,
              permissions: {
                can_edit: false,
                can_download: true,
                can_upload: false,
              },
            },
            json: true,
          });

          // Attach link to 'item' object
          item.download_link = response.data.link;
        } catch (e) {
          // No warning to the user, if a link already exists
          console.log("Could not create share link: ", e);
        }
      }

      items.push(item);
    }
  }

  return items;
};

module.exports = {
  key: "new_file",
  noun: "File",
  display: {
    label: "New File",
    description:
      "Triggers when a new file is found in a library. A new file with the same file name (and path) will not trigger.",
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
        default: "no",
        required: true,
        altersDynamicFields: false,
        helpText:
          "Choose whether to download the file. Set this to YES to include file contents next to the file information.",
      },
      {
        key: "link",
        label: "Include public download link?",
        type: "string",
        choices: [
          { label: "Yes", sample: "yes", value: "yes" },
          { label: "No", sample: "no", value: "no" },
        ],
        default: "no",
        required: true,
        altersDynamicFields: false,
        helpText:
          "Choose whether to include a public download link. The download link never expires. If you need the link to expire, use a separate action.",
      },
    ],

    sample: {
      id: "/invoice.pdf",
      file_id: "71d8bd8b10b99f3b739cfd61b19666f5a722687f",
      type: "file",
      modifier_email: "37552c94ff1a4783b58f325a75e18df8@auth.local",
      size: 63179,
      is_locked: false,
      lock_owner: null,
      lock_time: 0,
      locked_by_me: false,
      name: "invoice.pdf",
      mtime: 1734505610,
      permission: "rw",
      modifier_contact_email: "john.doe@example.com",
      modifier_name: "John Doe",
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "size", label: "Size", type: "integer" },
      { key: "type", label: "Typ", type: "string" },
      { key: "mtime", label: "Modified At", type: "integer" },
      { key: "modifier_contact_email", label: "Contact E-Mail" },
    ],
  },
};

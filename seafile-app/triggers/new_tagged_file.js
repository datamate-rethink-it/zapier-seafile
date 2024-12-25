const hydrators = require("../hydrators");
const removeTrailingSlash = (str) => str.replace(/\/$/, "");

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
    // ignore entries older than one day in general
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    if (item.mtime > oneDayAgo) {
      const fullPath = removeTrailingSlash(item.parent_path);

      // Add an 'id' field to each item (WITHOUT mtime)
      item.file_id = item.id;
      item.id = item.file_tag_id + "__" + fullPath + "/" + item.filename;

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
      id: "1__/invoice.pdf",
      modifier_email: "37552c94ff1a4783b58f325a75e18df8@auth.local",
      size: 63179,
      filename: "invoice.pdf",
      mtime: 1734505610,
      file_tag_id: 1,
      modifier_contact_email: "john.doe@example.com",
      modifier_name: "John Doe",
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "size", label: "Size", type: "integer" },
      { key: "mtime", label: "Modified At", type: "integer" },
      { key: "modifier_contact_email", label: "Contact E-Mail" },
    ],
  },
};

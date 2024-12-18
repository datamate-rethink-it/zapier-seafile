// required for file upload
const http = require("https"); // require('http') if your URL is not https
const FormData = require("form-data");

const makeDownloadStream = (url) =>
  new Promise((resolve, reject) => {
    http
      .request(url, (res) => {
        // We can risk missing the first n bytes if we don't pause!
        res.pause();
        resolve(res);
      })
      .on("error", reject)
      .end();
  });

// create a particular text_file by name
const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  // bundle.inputData.file will in fact be an URL where the file data can be
  // downloaded from which we do via a stream
  const stream = await makeDownloadStream(bundle.inputData.file, z);

  const formData = new FormData();
  //formData.append("filename", bundle.inputData.name);
  formData.append("file", stream, {
    filename: bundle.inputData.name,
    contentType: "application/octet-stream",
  });

  // All set! Resume the stream
  stream.resume();

  // relative path and replace
  const relative_path = bundle.inputData.path.replace(/^\/|\/$/g, "");
  const replace = bundle.inputData.overwrite ? 1 : 0;

  // generate upload-link
  const response = await z.request({
    method: "GET",
    url: `${bundle.authData.serverUrl}/api2/repos/${bundle.inputData.repo}/upload-link/?p=/`,
    json: true,
  });
  uploadLink = response.data;
  console.log(uploadLink);

  // prepare the upload of the file to seafile
  formData.append("parent_dir", "/");
  formData.append("relative_path", relative_path);
  formData.append("replace", replace);

  const options = {
    method: "POST",
    url: uploadLink,
    params: {
      "ret-json": 1,
    },
    headers: {
      ...formData.getHeaders(),
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  // Make the request
  const response2 = await z.request(options);
  return response2.data[0];
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: "upload_file",
  noun: "Upload File",

  display: {
    label: "Upload File",
    description: "Upload a file to Seafile.",
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
        helpText:
          "Missing parent folders will be automatically created if needed when specifying a longer path.",
        required: true,
      },
      {
        key: "file",
        type: "file",
        label: "File",
        required: true,
        helpText:
          "Must be a file object from another service (or some text or URL).",
      },
      {
        key: "name",
        label: "File Name",
        type: "string",
        required: true,
      },
      {
        key: "overwrite",
        label: "Overwrite Existing",
        type: "boolean",
        helpText:
          "Whether force that an existing file is overwritten. Otherwise the filename is extended with an number in brackets like `invoice (1).pdf`.",
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

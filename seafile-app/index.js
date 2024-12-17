const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

const new_file = require("./triggers/new_file");
const intern_repos = require("./triggers/intern_repos");

const create_folder = require("./creates/create_folder");
const delete_folder = require("./creates/delete_folder");

const find_files_folder = require("./searches/find_files_folder");

const create_text_file = require("./creates/create_text_file");
const delete_file = require("./creates/delete_file");

/*
// Add this helper function above `module.exports`:
const addApiKeyToHeader = (request, z, bundle) => {
  request.headers["My-Auth-Header"] = bundle.authData.apiKey;
  return request;
};
*/

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require("./package.json").version,
  platformVersion: require("zapier-platform-core").version,

  authentication,

  beforeRequest: [...befores],
  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [new_file.key]: new_file,
    [intern_repos.key]: intern_repos,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [find_files_folder.key]: find_files_folder,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [create_folder.key]: create_folder,
    [delete_folder.key]: delete_folder,
    [create_text_file.key]: create_text_file,
    [delete_file.key]: delete_file,
  },

  resources: {},
};

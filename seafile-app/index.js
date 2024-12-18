const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

// triggers
const new_file = require("./triggers/new_file");
const new_or_updated_file = require("./triggers/new_or_updated_file");
const new_tagged_file = require("./triggers/new_tagged_file");

// internal
const intern_repos = require("./triggers/intern_repos");
const intern_folders = require("./triggers/intern_folders");
const intern_tags = require("./triggers/intern_tags");

// create actions
const create_folder = require("./creates/create_folder");
const delete_folder = require("./creates/delete_folder");
const create_text_file = require("./creates/create_text_file");
const delete_file = require("./creates/delete_file");
const upload_file = require("./creates/upload_file");

// search
const find_file = require("./searches/find_file");
const find_files_folder = require("./searches/find_files_folder");

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
    [intern_repos.key]: intern_repos,
    [intern_folders.key]: intern_folders,
    [intern_tags.key]: intern_tags,
    [new_file.key]: new_file,
    [new_or_updated_file.key]: new_or_updated_file,
    [new_tagged_file.key]: new_tagged_file,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [find_file.key]: find_file,
    [find_files_folder.key]: find_files_folder,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [create_folder.key]: create_folder,
    [delete_folder.key]: delete_folder,
    [create_text_file.key]: create_text_file,
    [delete_file.key]: delete_file,
    [upload_file.key]: upload_file,
  },

  resources: {},
};

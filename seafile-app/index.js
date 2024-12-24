const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

const hydrators = require("./hydrators");

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
const download_file = require("./creates/download_file");
const create_share_link = require("./creates/create_share_link");
const move_file = require("./creates/move_file");
const rename_file = require("./creates/rename_file");
const api_request = require("./creates/api_request");

// search
const find_file = require("./searches/find_file");
const find_files_folder = require("./searches/find_files_folder");

module.exports = {
  version: require("./package.json").version,
  platformVersion: require("zapier-platform-core").version,

  authentication,

  hydrators,

  beforeRequest: [...befores],
  afterResponse: [...afters],

  triggers: {
    [intern_repos.key]: intern_repos,
    [intern_folders.key]: intern_folders,
    [intern_tags.key]: intern_tags,
    [new_file.key]: new_file,
    [new_or_updated_file.key]: new_or_updated_file,
    [new_tagged_file.key]: new_tagged_file,
  },

  searches: {
    [find_file.key]: find_file,
    [find_files_folder.key]: find_files_folder,
  },

  creates: {
    [create_folder.key]: create_folder,
    [delete_folder.key]: delete_folder,
    [create_text_file.key]: create_text_file,
    [delete_file.key]: delete_file,
    [upload_file.key]: upload_file,
    [download_file.key]: download_file,
    [create_share_link.key]: create_share_link,
    [move_file.key]: move_file,
    [rename_file.key]: rename_file,
    [api_request.key]: api_request,
  },

  resources: {},
};

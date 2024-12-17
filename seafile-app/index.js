const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

const new_file = require("./triggers/new_file");
const intern_repos = require("./triggers/intern_repos");

const create_folder = require("./creates/create_folder");

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
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [create_folder.key]: create_folder,
  },

  resources: {},
};

const authentication = require('./authentication');
const newFileTrigger = require('./triggers/new_file.js');
const internLibrariesTrigger = require('./triggers/intern_libraries.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  triggers: {
    [newFileTrigger.key]: newFileTrigger,
    [internLibrariesTrigger.key]: internLibrariesTrigger,
  },
  authentication: authentication,
};

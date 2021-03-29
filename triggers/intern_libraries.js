module.exports = {
  operation: {
    perform: {
      url: '{{bundle.authData.server_url}}/api2/repos/',
      method: 'GET',
      params: {},
      headers: {
        Accept: 'application/json; indent=4',
        Authorization: 'Token {{bundle.authData.Token}}',
      },
      body: {},
      removeMissingValuesFrom: {},
    },
  },
  key: 'intern_libraries',
  noun: 'libraries',
  display: {
    label: 'all libraries',
    description: 'gets all libraries from a user',
    hidden: true,
    important: false,
  },
};

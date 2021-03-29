module.exports = {
  type: 'session',
  test: {
    url: '{{bundle.authData.server_url}}/api2/auth/ping/',
    method: 'GET',
    params: {},
    headers: { Authorization: 'Token {{bundle.authData.token}}' },
    body: {},
    removeMissingValuesFrom: {},
  },
  fields: [
    {
      computed: false,
      key: 'server_url',
      required: true,
      label: 'Server URL',
      type: 'string',
      default: 'https://seafile-demo.de',
    },
    {
      computed: false,
      key: 'user',
      required: true,
      label: 'email or username',
      type: 'string',
      helpText: 'please add your email or username',
    },
    {
      computed: false,
      key: 'password',
      required: true,
      label: 'Password',
      type: 'password',
      helpText: '...',
    },
  ],
  sessionConfig: {
    perform: {
      url: '{{bundle.authData.server_url}}/api2/auth-token/',
      method: 'POST',
      params: {},
      headers: { accept: 'application/json' },
      body: {
        username: '{{bundle.authData.user}}',
        password: '{{bundle.authData.password}}',
      },
      removeMissingValuesFrom: {},
    },
  },
};

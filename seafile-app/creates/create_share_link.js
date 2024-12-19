const perform = async (z, bundle) => {
  if (!bundle.inputData.path.startsWith("/")) {
    throw new z.errors.Error(`The path must start with a /.`);
  }

  const body = {
    repo_id: bundle.inputData.repo,
    path: bundle.inputData.path + '/' + bundle.inputData.name,
    expire_days: bundle.inputData.expire_days,
    permissions: {
      can_edit: false,
      can_download: true,
      can_upload: false,
    },
  };

  if (bundle.inputData.password) {
    body.password = bundle.inputData.password;
  }

  const response = await z.request({
    method: 'POST',
    url: `${bundle.authData.serverUrl}/api/v2.1/share-links/`,
    body,
  });

  return response.data;
};

module.exports = {
  key: 'create_share_link',
  noun: 'Share Link',
  display: {
    label: 'Create Share Link',
    description: 'Creates a new share link.'
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
        key: "name",
        label: "File Name",
        type: "string",
        required: true,
      },
      {
        key: 'password',
        label: 'Password',
        type: 'string',
        required: false,
      },
      {
        key: 'expire_days',
        label: 'Expiration Time in Days',
        type: 'string',
        default: '7',
        required: true,
      },
    ],
    sample: {
      username: "2782d61600c7489da286e7cf76ef2422@auth.local",
      repo_id: "ddfd314c-4c11-49cc-85c0-2b21c0bc6746",
      repo_name: "Files",
      path: "/api.md",
      obj_name: "api.md",
      obj_id: "ae21e4e16c2a2432b8d563b11dceb17a9148bc3b",
      is_dir: false,
      token: "f98b90b2f2194acb9c9b",
      link: "https://your-seafile-server/f/f98b90b2f2194acb9c9b/",
      view_cnt: 0,
      ctime: "2024-12-19T16:36:09+01:00",
      expire_date: "2024-12-26T16:36:09+01:00",
      is_expired: false,
      permissions: {
        can_edit: false,
        can_download: true,
        can_upload: false
      },
      password: "",
      can_edit: true
    },
    outputFields: [
      { key: 'repo_id', label: 'Library ID' },
      { key: 'repo_name', label: 'Library Name' },
      { key: 'is_dir', label: 'Is Directory', type: 'boolean' },
      { key: 'view_cnt', label: 'View Count', type: 'integer' },
      { key: 'ctime', label: 'Created At' },
    ],
  }
};

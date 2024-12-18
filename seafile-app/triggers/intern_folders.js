// Fetches a list of records from the endpoint
const perform = async (z, bundle) => {
  // set default return.
  const returnData = [
    {
      id: "/",
      name: "/",
    },
  ];

  if (!bundle.inputData.repo) {
    console.log("inputData repo is not set or empty...");
    return returnData;
  }

  const request = {
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/dir/`,
    params: {
      t: "d",
      recursive: "1",
    },
  };

  // TODO: add pagination support...
  // This API returns things in "pages" of results
  //if (bundle.meta.page) {
  //  request.params.page = 1 + bundle.meta.page;
  //}

  const response = await z.request(request);

  if (response.data.dirent_list) {
    for (const entries of response.data.dirent_list) {
      const folderPath =
        entries.parent_dir === "/"
          ? `${entries.parent_dir}${entries.name}/`
          : `${entries.parent_dir}/${entries.name}/`;

      returnData.push({
        id: folderPath,
        name: folderPath,
      });
    }
  }
  return returnData;
};

module.exports = {
  key: "intern_folders",
  noun: "Folders",
  display: {
    label: "List of Folders",
    description:
      "This is a hidden trigger, and is used in a Dynamic Dropdown of another trigger.",
    hidden: true,
  },

  operation: {
    // Since this is a "hidden" trigger, there aren't any inputFields needed
    perform,
    // The folowing is a "hint" to the Zap Editor that this trigger returns data
    // "in pages", and that the UI should display an option to "load more" to
    // the human.
    canPaginate: true,
  },
};

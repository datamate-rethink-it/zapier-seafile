// Fetches a list of records from the endpoint
const perform = async (z, bundle) => {
  const request = {
    url: `${bundle.authData.serverUrl}/api2/repos/`,
    params: {},
  };

  // TODO: add pagination support...
  // This API returns things in "pages" of results
  //if (bundle.meta.page) {
  //  request.params.page = 1 + bundle.meta.page;
  //}

  const response = await z.request(request);
  return response.data.map((repo) => ({
    id: repo.id,
    name: repo.name,
  }));
};

module.exports = {
  key: "intern_repos",
  noun: "Libraries",
  display: {
    label: "List of Libraries",
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

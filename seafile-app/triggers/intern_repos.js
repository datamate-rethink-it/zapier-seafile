// Fetches a list of records from the endpoint
const perform = async (z, bundle) => {
  const request = {
    url: `${bundle.authData.serverUrl}/api2/repos/`,
    params: {},
  };

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
    canPaginate: false,
  },
};

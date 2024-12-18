// Fetches a list of records from the endpoint
const perform = async (z, bundle) => {
  // set default return.
  const returnData = [];

  // DEV: hard-code repo
  // bundle.inputData.repo = "c0aa1d28-39a4-4130-b791-50bb9a8ed9b3";

  if (!bundle.inputData.repo) {
    console.log("inputData repo is not set or empty...");
    return returnData;
  }

  const request = {
    url: `${bundle.authData.serverUrl}/api/v2.1/repos/${bundle.inputData.repo}/repo-tags/`,
  };

  // TODO: add pagination support...
  // This API returns things in "pages" of results
  //if (bundle.meta.page) {
  //  request.params.page = 1 + bundle.meta.page;
  //}

  const repoTags = await z.request(request);

  if (repoTags.data.repo_tags) {
    for (const tag of repoTags.data.repo_tags) {
      returnData.push({
        name: tag.tag_name,
        id: tag.repo_tag_id,
      });
    }
  }
  return returnData;
};

module.exports = {
  key: "intern_tags",
  noun: "Tags",
  display: {
    label: "List of Tags",
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

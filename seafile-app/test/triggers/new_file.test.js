const zapier = require("zapier-platform-core");
const App = require("../../index");

const appTester = zapier.createAppTester(App);

// read the `.env` file into the environment, if available
zapier.tools.env.inject();

/*
describe("triggers", () => {
  describe("new recipe trigger", () => {
    it("should load recipes", async () => {
      const bundle = {
        inputData: {
          q: "test2",

        },
      };

      const results = await appTester(
        App.triggers.recipe.operation.perform,
        bundle
      );

      expect(results.length).toBeGreaterThan(1);

      const firstRecipe = results[0];
      expect(firstRecipe.name).toEqual("name 2");
      expect(firstRecipe.directions).toEqual("directions 2");
    });

    it("should load recipes without filters", async () => {
      const bundle = {};

      const results = await appTester(
        App.triggers.recipe.operation.perform,
        bundle
      );

      expect(results.length).toBeGreaterThan(1);

      const firstRecipe = results[0];
      expect(firstRecipe.name).toEqual("name 1");
      expect(firstRecipe.directions).toEqual("directions 1");
    });
  });
});
*/

describe("triggers.new_file", () => {
  it("should run", async () => {
    const bundle = {
      inputData: {
        repo: "10d4c707-31a1-47d6-9332-a592991cb139",
        q: "test",
      },
      authData: {
        apiToken: process.env.authData_apiToken,
        serverUrl: process.env.authData_serverUrl,
      },
    };

    const results = await appTester(
      App.triggers.new_file.operation.perform,
      bundle
    );
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});

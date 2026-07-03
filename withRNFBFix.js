const { withXcodeProject } = require("@expo/config-plugins");

module.exports = (config) =>
  withXcodeProject(config, (c) => {
    const configurations = c.modResults.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      // Skip comment entries, which show up as string values, not objects
      if (typeof configurations[key].buildSettings !== "undefined") {
        configurations[
          key
        ].buildSettings.CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES =
          "YES";
      }
    }
    return c;
  });

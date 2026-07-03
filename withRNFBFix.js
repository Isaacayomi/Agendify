const { withXcodeProject } = require("@expo/config-plugins");
module.exports = (config) =>
  withXcodeProject(config, (c) => {
    c.modResults.buildConfigurationList().forEach((cfg) => {
      cfg.buildSettings.CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES =
        "YES";
    });
    return c;
  });

// Extends app.json. When the app is exported for the web demo (GitHub Pages),
// EXPO_BASE_URL sets the sub-path it is served from, e.g. /my-design-template/mobile
module.exports = ({ config }) => ({
  ...config,
  web: { ...config.web, output: "single" },
  experiments: { ...config.experiments, baseUrl: process.env.EXPO_BASE_URL || "" },
});

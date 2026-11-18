// Lets Metro see the workspace packages (packages/*)
const { getDefaultConfig } = require("expo/metro-config");
module.exports = getDefaultConfig(__dirname);

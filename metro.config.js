const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for the @ alias
config.resolver.alias = {
  '@': './',
};

module.exports = config; 
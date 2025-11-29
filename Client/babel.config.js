module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Explicitly include react-native-reanimated plugin
      'react-native-reanimated/plugin',
    ],
  };
};
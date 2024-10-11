module.exports = {
  rspack: (config) => {
    config.module.rules.push({
      type: 'asset/inline',
    });

    return config;
  },
};
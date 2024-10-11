module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      use: {
        loader: 'url-loader',
      },
    });

    return config;
  },
};
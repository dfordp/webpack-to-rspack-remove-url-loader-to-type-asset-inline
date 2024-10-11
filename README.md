Rspack implements Webpack 5's Asset Modules, using asset modules to replace url-loader to 'asset/inline' for better performance.


### Before

```ts
module.exports = {
  module: {
    rules: [{
      use: ['url-loader'],
    }, ],
  },
};
```

### After

```ts
module.exports = {
  module: {
    rules: [{
      type: 'asset/inline',
    }, ],
  },
};
```
,This codemod turns X into Y. It also does Z.
Note: this is a contrived example. Please modify it.

### Before

```ts
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
```

### After

```ts
module.exports = {
  rspack: (config) => {
    config.module.rules.push({
      type: 'asset/inline',
    });

    return config;
  },
};
```


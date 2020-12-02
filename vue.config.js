module.exports = {
  lintOnSave: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.xml$/i,
          use: 'raw-loader',
        },
      ],
    },
  }
};

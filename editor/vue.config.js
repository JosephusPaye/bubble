const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['css'],
        features: [
          '!gotoSymbol',
          '!codelens',
          '!colorDetector',
          'format',
          '!parameterHints',
          '!quickOutline',
          '!snippets',
        ],
      }),
    ],
  },
};

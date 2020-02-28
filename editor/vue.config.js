const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: [],
        features: [
          '!gotoSymbol',
          '!codelens',
          '!codeAction',
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

const { string } = require('rollup-plugin-string');

module.exports = {
  rollup(config) {
    config.plugins.push(
      string({
        include: '**/*.pegjs',
      })
    );
    config.external = () => false;
    return config;
  },
};

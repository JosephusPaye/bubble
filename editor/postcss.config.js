const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.vue'],
  defaultExtractor: content => content.match(/[\w-/:]*[\w-/:]/g) || [],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
    // TODO: Fix purgecss for monaco-editor styles and enable
  ],
};

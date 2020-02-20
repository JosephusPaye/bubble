const fs = require('fs');
const path = require('path');

const grammarFile = path.join(__dirname, './generated-parser.js');

try {
  const code = fs.readFileSync(grammarFile, 'utf-8');

  const exportsFrom = `
module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};`.trim();

  const exportsTo = `
export const SyntaxError = peg$SyntaxError;
export const parse = peg$parse;
`.trim();

  fs.writeFileSync(grammarFile, code.replace(exportsFrom, exportsTo));

  console.log('Parser exports transformed to use ES modules');
} catch (err) {
  console.error(err);
}

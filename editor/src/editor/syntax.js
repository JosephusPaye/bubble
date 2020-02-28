export const syntaxDefinition = {
  // For development: set `defaultToken` to invalid to see what is not tokenize yet
  // defaultToken: 'invalid',

  keywords: [
    'node',
    'branch',
    'when',
    'appearance',
    'shape',
    'style',
    'ellipse',
    'rectangle',
    'fill',
    'border',
    'shadow',
    'rounded',
  ],

  operators: [':', '{', '}', '[', ']', '@', '+', '-'],

  brackets: [['{', '}', 'delimiter.curly']],

  // Symbol characters, used in tokenizer
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // Escape sequences, used in strings
  escapes: /\\(?:[abfnrtv\\"'\]]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer
  tokenizer: {
    root: [
      // Identifiers
      [/[@\:][a-z_$][\w$]*/, 'type.identifier'],

      // Keywords
      [
        /[a-z_$][\w$]*/,
        { cases: { '@keywords': 'keyword', '@default': 'invalid' } },
      ],

      // Whitespace and comments
      { include: '@whitespace' },

      // Brackets and operators
      [/[{}]/, '@brackets'],
      [
        /@symbols/,
        { cases: { '@operators': 'operator', '@default': 'invalid' } },
      ],

      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // Delimiters
      [/[;,]/, 'delimiter'],

      // Strings
      [/"([^"])*$/, 'string.invalid'], // non-teminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

      // Multiline strings
      [
        /\[/,
        { token: 'string.quote', bracket: '@open', next: '@multilineString' },
      ],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    multilineString: [
      [/[^\\\]]+/, ''],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/\]/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/#.*$/, 'comment'],
    ],
  },
};

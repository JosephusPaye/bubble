export const completionsProvider = {
  provideCompletionItems() {
    return {
      suggestions: [
        {
          label: 'node',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'node "${1:My node}"',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a node.',
        },
        {
          label: 'node with body',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'node "${1:My node}" [${2:My node body}]',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a node with body text.',
        },
        {
          label: 'branch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['branch "${1:Condition}" {', '\t$0', '}'].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a branch.',
        },
        {
          label: 'branch with content',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'branch "${1:Condition}" {',
            '\twhen "${2:Yes}" {',
            '\t\tnode "${3:Do something}"',
            '\t}',
            '\twhen "${4:No}" {',
            '\t\tnode "${5:Do something else}"',
            '\t}',
            '}',
          ].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a branch with content.',
        },
        {
          label: 'when',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['when "${1:Label}" {', '\t$0', '}'].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a branch case.',
        },
        {
          label: 'when with content',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'when "${1:Label}" {',
            '\tnode "${2:My node}"',
            '}',
          ].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add a branch case with content.',
        },
        {
          label: 'appearance',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['appearance {', '\t$0', '}'].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add graph appearance.',
        },
        {
          label: 'shape',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'shape: ${1:rectangle};',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add shape modifier.',
        },
        {
          label: 'style',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'style: ${1:1};',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add style modifier.',
        },
        {
          label: 'style with options',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'style: ${1:1}, $0;',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add style modifier with options.',
        },
        {
          label: 'add fill',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '+fill',
        },
        {
          label: 'remove fill',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '-fill',
        },
        {
          label: 'add border',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '+border',
        },
        {
          label: 'remove border',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '-border',
        },
        {
          label: 'add shadow',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '+shadow',
        },
        {
          label: 'remove shadow',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '-shadow',
        },
        {
          label: 'add rounded',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '+rounded',
        },
        {
          label: 'remove rounded',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '-rounded',
        },
      ],
    };
  },
};

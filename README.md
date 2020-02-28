# Bubble

💭 Bubble is an experimental text to flowchart language. <https://bubblelang.netlify.com/>

![Promotional image of Bubble](./promo-image.png)

This project is part of [#CreateWeekly](https://dev.to/josephuspaye/createweekly-create-something-new-publicly-every-week-in-2020-1nh9), my attempt to create something new publicly every week in 2020.

## Delivered in parts

- The first part, delivered in Week 6, is the [language grammar](lib/src/peg/bubble.pegjs) and [corresponding parser](lib/src/peg/generated-parser.js).
- The second part, delivered in Week 7, is the [semantic analyser](lib/src/analyser.ts) and [basic editor](https://github.com/JosephusPaye/bubble/blob/v0.1.0/editor/src/components/Editor.vue).
- The third part, delivered in Week 8, is the [style resolver](lib/src/style-resolver.ts) and [Monaco editor with syntax highlighting and inline error reporting](https://bubblelang.netlify.com/).

## Contributing

See [contribution guide](CONTRIBUTING.md).

## What's next

- [x] Add a basic editor for testing the parser
- [x] Part 2: Semantic Analysis of AST
- [x] Add Monaco editor with syntax highlighting and inline errors/warnings
- [x] Part 3: Style resolution
- [ ] Part 4: Initial code generation

## Licence

[MIT](LICENCE)

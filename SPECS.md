# Bubble specification

## Semantic rules

### Errors

- [x] ❌ Graph has at least one node
- [x] ❌ Branches have at least two cases
- [x] ❌ Branch cases have at least one node

### Warnings

- [x] ❕ Each node or branch with an id has at least one reference in `appearance {}`
- [x] ❕ Each id selector in `appearance {}` has a corresponding node or branch in the graph
- [ ] ~~❕ Node and branch ids are unique in the graph~~ (instead, allow for using the same id to target multiple elements, like CSS classes)
- [x] ❕ Node, branches, and case labels are non-empty (e.g. not just white space or the empty string)
- [x] ❕ Node and branch bodies are non-empty (e.g. not just white space or the empty string)
- [x] ❕ If specified, `appearance {}` is non-empty (e.g. has at least one node appearance)
- [x] ❕ No duplicate selector in node appearance selector list, e.g. `@myLoad, branch, @myLoad { ... }`
- [ ] ❕ No duplicate node appearance (by selector) e.g. `@myLoad { ... }` and `@myLoad { ... }`

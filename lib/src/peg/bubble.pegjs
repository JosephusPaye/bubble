{
  const symbols = {
    identifiers: new Set(),
    selectorLists: [],
    selectors: new Set(),
  };
}

Start
	= nodes:Node* appearance:Appearance? {
    return { nodes, appearance, symbols };
  }

// node "My node" ...
// branch "My branch" ...
Node
	= node:NormalNode SpaceOrComment* { return node; }
  / branch:BranchNode SpaceOrComment* { return branch; }

// node:myNode "My node label" [My node body]
NormalNode
	= keywordLocation:NodeKeyword id:NodeId? Space* label:String Space* body:MultilineString? {
    return { location: keywordLocation, type: 'normal', id, label, body };
  }

NodeKeyword
  = 'node' { return location(); }

// :myNodeId
NodeId
	= ':' id:Identifier {
    symbols.identifiers.add(id.value);
    return id;
  }

// branch "My branch label" [My branch body] { when "Yes" { ... } when "No" { ... } ... }
BranchNode
	= keywordLocation:BranchKeyword id:NodeId? Space* label:String Space* body:MultilineString? Space* cases:BranchCases {
    return { location: keywordLocation, type: 'branch', id, label, body, cases };
  }

BranchKeyword
  = 'branch' { return location(); }

// { when "Yes" { ... } when "No" { ... } ... }
BranchCases
  = '{' SpaceOrComment* cases:BranchCase* '}' { return cases; }

// when "Yes" { node "My node label" ... }
BranchCase
	= keywordLocation:BranchCaseKeyword Space* label:String Space* '{' SpaceOrComment* nodes:Node* '}' SpaceOrComment* {
    return { location: keywordLocation, label, nodes };
  }

BranchCaseKeyword
  = 'when' { return location(); }

// appearance { ... }
Appearance
	= keywordLocation:AppearanceKeyword Space* '{' SpaceOrComment* appearances:NodeAppearance* '}' SpaceOrComment* {
    return { location: keywordLocation, appearances };
  }

AppearanceKeyword
  = 'appearance' { return location(); }

// myNodeId { shape: rectangle; style: 1, +fill, -shadow, ...; }
NodeAppearance
	= selectors:NodeSelector+ '{' SpaceOrComment* modifiers:NodeModifiers* '}' SpaceOrComment* {
    const selectorStrings = selectors.map(s => {
      const selector = s.type === 'id' ? `@${s.value}` : s.value;
      symbols.selectors.add(selector);
      return selector;
    });
    symbols.selectorLists.push(selectorStrings);
    return { selectors, modifiers };
  }

NodeSelector
  = '@' id:Identifier Space* ','? Space* {
    return { type: 'id', ...id };
  }
  / keywordLocation:NodeKeyword Space* ','? Space* {
    return { type: 'element', value: 'node', location: keywordLocation };
  }
  / keywordLocation:BranchKeyword Space* ','? Space* {
    return { type: 'element', value: 'branch', location: keywordLocation };
  }

// shape: ...;
// style: ...;
NodeModifiers
	= shape:ShapeModifier SpaceOrComment* { return shape; }
  / style:StyleModifier SpaceOrComment* { return style; }

// shape: ellipse;
ShapeModifier
	= keywordLocation:ShapeKeyword Space* ':' Space* shape:ShapeType Space* ';' {
    return { location: keywordLocation, type: 'shape', shape };
  }

ShapeKeyword
  = 'shape' { return location(); }

ShapeType
	= 'rectangle'
  / 'ellipse'

// style: 1, +fill, -border, ...;
StyleModifier
	= keywordLocation:StyleKeyword Space* ':' Space* id:StyleId Space* options:StyleParameters? ';' {
      return { location: keywordLocation, type: 'style', style: { id, options } };
    }

StyleKeyword
  = 'style' { return location(); }

StyleId
	= '1'
  / '2'
  / '3'

// , +fill, -border, ...
StyleParameters
	= parameters:StyleParameter+ { return parameters; }

// , -fill
// , +border
StyleParameter
	= ',' Space* option:StyleOption Space* { return option; }

// +fill
// -border
StyleOption
	= '+' option:StyleOptionId { return { type: 'enable', option }; }
	/ '-' option:StyleOptionId { return { type: 'disable', option }; }

StyleOptionId
	= 'fill'
  / 'border'
  / 'shadow'
  / 'rounded'

// =================================================
// Low-level rules
// =================================================

// Any sequence of alphanum + underscore characters, starting with alpha or underscore
Identifier
 	= start:[A-z_]rest:[A-z_0-9]* {
    return { location: location(), value: start + rest.join('') };
  }

// "..." (where ... is any sequence of characters except newlines and closing quote)
String
  = '"' characters:StringCharacter* '"' { return characters.join(''); }

// Any character except newline and closing quote
StringCharacter
  = !('"' / '\\' / '\n' / '\r') character:. { return character; }
  / '\\' sequence:StringEscapeSequence { return sequence; }

// Combines with \ to escape a sequence in a string: \", \\, \n, etc
StringEscapeSequence
  = '"'
  / StandardEscapeCodes

// [...]  (where ... is any sequence of characters (including newlines) except closing right bracket)
MultilineString
	= '[' characters:MultilineStringCharacter* ']' { return characters.join(''); }

// Any character (including newlines) except closing right bracket
MultilineStringCharacter
	= !(']' / '\\') character:. { return character; }
  / '\\' sequence:MultilineStringEscapeSequence { return sequence; }

// Combines with \ to escape a sequence in a multiline string: \], \\, \n, etc
MultilineStringEscapeSequence
  = ']'
  / StandardEscapeCodes

// Combines with \ to make an escape code: \\, \n, \t, etc
StandardEscapeCodes
  = '\\'
  / 'b'  { return '\b';   }
  / 'f'  { return '\f';   }
  / 'n'  { return '\n';   }
  / 'r'  { return '\r';   }
  / 't'  { return '\t';   }
  / 'v'  { return '\x0B'; }

// #...  (where ... is any sequence of characters except newlines)
Comment
	= '#' CommentCharacter*

// Any character except newlines
CommentCharacter
	= !('\n' / '\r') character:. { return character; }

// A comment or single whitespace character
SpaceOrComment
	= Space
  / Comment

// A whitespace character
Space
	= ' '
  / '\n'
  / '\r'
  / '\t'

Start
	= nodes:Node* appearance:Appearance? {
    return { nodes, appearance };
  }

// node "My node" ...
// branch "My branch" ...
Node
	= node:NormalNode SpaceOrComment* { return node; }
  / branch:BranchNode SpaceOrComment* { return branch; }

// node:myNode "My node label" [My node body]
NormalNode
	= 'node' id:NodeId? Space* label:String Space* body:MultilineString? {
    return { type: 'normal', id, label, body };
  }

// :myNodeId
NodeId
	= ':' id:Identifier { return id; }

// branch "My branch label" [My branch body] { when "Yes" { ... } when "No" { ... } ... }
BranchNode
	= 'branch' id:NodeId? Space* label:String Space* body:MultilineString? Space* cases:BranchCases {
    return { type: 'branch', id, label, body, cases };
  }

// { when "Yes" { ... } when "No" { ... } ... }
BranchCases
  = '{' SpaceOrComment* cases:BranchCase+ '}' { return cases; }

// when "Yes" { node "My node label" ... }
BranchCase
	= 'when' Space* label:String Space* '{' SpaceOrComment* nodes:Node* '}' SpaceOrComment* {
    return { label, nodes };
  }

// appearance { ... }
Appearance
	= 'appearance' Space* '{' SpaceOrComment* appearances:NodeAppearance* '}' SpaceOrComment* {
    return appearances;
  }

// myNodeId { shape: rectangle; style: 1, +fill, -shadow, ...; }
NodeAppearance
	= nodeId:Identifier Space* '{' SpaceOrComment* modifiers:NodeModifiers* '}' SpaceOrComment* {
    return { nodeId, modifiers };
  }

// shape: ...;
// style: ...;
NodeModifiers
	= shape:ShapeModifier SpaceOrComment* { return { shape }; }
  / style:StyleModifier SpaceOrComment* { return { style }; }

// shape: ellipse;
ShapeModifier
	= 'shape' Space* ':' Space* type:ShapeType Space* ';'? { return type; }

ShapeType
	= 'rectangle'
  / 'ellipse'

// style: 1, +fill, -border, ...;
StyleModifier
	= 'style' Space* ':' Space* id:StyleId Space* options:StyleParameters? ';'? {
      return { id, options };
    }

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
 	= start:[A-z_]rest:[A-z_0-9]* { return start + rest.join(''); }

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

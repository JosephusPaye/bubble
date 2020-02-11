import { parser } from '../src';

function parse(input: string) {
  try {
    return parser.parse(input);
  } catch (error) {
    console.log(error, error.location);
    throw error;
  }
}

describe('parser', () => {
  it('parser has the expected API', () => {
    expect(typeof parser.parse).toBe('function');
    expect(typeof parser.SyntaxError).toBe('function');
  });

  it('parses a simple string', () => {
    const input = `
node "Yes it's good" [Yep]
node:myNode "Yes \\"sure\\" it is"
node:myOtherNode "Great" [
  You can write entire poems in here:
  ---
  Once upon a midnight dreary, while I pondered, weak and weary...
]
branch "Do the thing?" {
  when "Yes" {
     node "It's a yes"
  }
  when  "No" {
     node "It's a no"
  }
}
appearance { # Defines styles for how the graph should appear

  myNode { shape: rectangle; style: 1, +fill, -border; }

}`.trim();

    const output = `{"nodes":[{"type":"normal","id":null,"label":"Yes it's good","body":"Yep"},{"type":"normal","id":"myNode","label":"Yes \\"sure\\" it is","body":null},{"type":"normal","id":"myOtherNode","label":"Great","body":"\\n  You can write entire poems in here:\\n  ---\\n  Once upon a midnight dreary, while I pondered, weak and weary...\\n"},{"type":"branch","id":null,"label":"Do the thing?","body":null,"cases":[{"label":"Yes","nodes":[{"type":"normal","id":null,"label":"It's a yes","body":null}]},{"label":"No","nodes":[{"type":"normal","id":null,"label":"It's a no","body":null}]}]}],"appearance":[{"nodeId":"myNode","modifiers":[{"shape":"rectangle"},{"style":{"id":"1","options":[{"type":"enable","option":"fill"},{"type":"disable","option":"border"}]}}]}]}`;

    expect(JSON.stringify(parse(input))).toBe(output);
  });
});

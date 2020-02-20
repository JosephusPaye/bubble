import * as parser from '../src';

function parse(input: string) {
  try {
    return parser.parse(input);
  } catch (error) {
    // console.log(error, error.location);
    throw error;
  }
}

describe('parser', () => {
  it('has the expected API', () => {
    expect(typeof parser.parse).toBe('function');
    expect(typeof parser.analyse).toBe('function');
    expect(typeof parser.SyntaxError).toBe('function');
  });

  it('parses a simple string', () => {
    const input = `
node:myLoad "Load"
node:myProcess "Process" [Runs the database queries]
branch "Question?" {
  when "Yes" {
    node "Yes 1"
    branch:mySecondBranch "Another question?" [Yep, you can nest branches] {
      when "Yes" { node "Do something" }
      when "No" { node "Do somethin else" }
    }
  }
  when "No" {
    node "No 1"
    node "No 2"
  }
}

appearance {
  @myLoad,
  @myProcess {
    shape: ellipse;
    style: 1, +fill, -border, -shadow;
  }
  node { shape: rectangle; }
  branch { style: 3; }
}   `.trim();

    const nodes = JSON.parse(
      `[{"location":{"start":{"offset":0,"line":1,"column":1},"end":{"offset":4,"line":1,"column":5}},"type":"normal","id":{"location":{"start":{"offset":5,"line":1,"column":6},"end":{"offset":11,"line":1,"column":12}},"value":"myLoad"},"label":"Load","body":null},{"location":{"start":{"offset":19,"line":2,"column":1},"end":{"offset":23,"line":2,"column":5}},"type":"normal","id":{"location":{"start":{"offset":24,"line":2,"column":6},"end":{"offset":33,"line":2,"column":15}},"value":"myProcess"},"label":"Process","body":"Runs the database queries"},{"location":{"start":{"offset":72,"line":3,"column":1},"end":{"offset":78,"line":3,"column":7}},"type":"branch","id":null,"label":"Question?","body":null,"cases":[{"location":{"start":{"offset":95,"line":4,"column":3},"end":{"offset":99,"line":4,"column":7}},"label":"Yes","nodes":[{"location":{"start":{"offset":112,"line":5,"column":5},"end":{"offset":116,"line":5,"column":9}},"type":"normal","id":null,"label":"Yes 1","body":null},{"location":{"start":{"offset":129,"line":6,"column":5},"end":{"offset":135,"line":6,"column":11}},"type":"branch","id":{"location":{"start":{"offset":136,"line":6,"column":12},"end":{"offset":150,"line":6,"column":26}},"value":"mySecondBranch"},"label":"Another question?","body":"Yep, you can nest branches","cases":[{"location":{"start":{"offset":208,"line":7,"column":7},"end":{"offset":212,"line":7,"column":11}},"label":"Yes","nodes":[{"location":{"start":{"offset":221,"line":7,"column":20},"end":{"offset":225,"line":7,"column":24}},"type":"normal","id":null,"label":"Do something","body":null}]},{"location":{"start":{"offset":249,"line":8,"column":7},"end":{"offset":253,"line":8,"column":11}},"label":"No","nodes":[{"location":{"start":{"offset":261,"line":8,"column":19},"end":{"offset":265,"line":8,"column":23}},"type":"normal","id":null,"label":"Do somethin else","body":null}]}]}]},{"location":{"start":{"offset":299,"line":11,"column":3},"end":{"offset":303,"line":11,"column":7}},"label":"No","nodes":[{"location":{"start":{"offset":315,"line":12,"column":5},"end":{"offset":319,"line":12,"column":9}},"type":"normal","id":null,"label":"No 1","body":null},{"location":{"start":{"offset":331,"line":13,"column":5},"end":{"offset":335,"line":13,"column":9}},"type":"normal","id":null,"label":"No 2","body":null}]}]}]`
    );

    const appearance = JSON.parse(
      `{"location":{"start":{"offset":350,"line":17,"column":1},"end":{"offset":360,"line":17,"column":11}},"appearances":[{"selectors":[{"type":"id","location":{"start":{"offset":366,"line":18,"column":4},"end":{"offset":372,"line":18,"column":10}},"value":"myLoad"},{"type":"id","location":{"start":{"offset":377,"line":19,"column":4},"end":{"offset":386,"line":19,"column":13}},"value":"myProcess"}],"modifiers":[{"location":{"start":{"offset":393,"line":20,"column":5},"end":{"offset":398,"line":20,"column":10}},"type":"shape","shape":"ellipse"},{"location":{"start":{"offset":413,"line":21,"column":5},"end":{"offset":418,"line":21,"column":10}},"type":"style","style":{"id":"1","options":[{"type":"enable","option":"fill"},{"type":"disable","option":"border"},{"type":"disable","option":"shadow"}]}}]},{"selectors":[{"type":"element","value":"node","location":{"start":{"offset":454,"line":23,"column":3},"end":{"offset":458,"line":23,"column":7}}}],"modifiers":[{"location":{"start":{"offset":461,"line":23,"column":10},"end":{"offset":466,"line":23,"column":15}},"type":"shape","shape":"rectangle"}]},{"selectors":[{"type":"element","value":"branch","location":{"start":{"offset":483,"line":24,"column":3},"end":{"offset":489,"line":24,"column":9}}}],"modifiers":[{"location":{"start":{"offset":492,"line":24,"column":12},"end":{"offset":497,"line":24,"column":17}},"type":"style","style":{"id":"3","options":null}}]}]}`
    );

    const identifiers = new Set<string>();
    identifiers.add('myLoad');
    identifiers.add('myProcess');
    identifiers.add('mySecondBranch');

    const selectors = new Set<string>();
    selectors.add('@myLoad');
    selectors.add('@myProcess');
    selectors.add('node');
    selectors.add('branch');

    const symbols = {
      identifiers,
      selectorLists: [['@myLoad', '@myProcess'], ['node'], ['branch']],
      selectors,
    };

    const ast = parse(input);

    expect(ast.nodes).toStrictEqual(nodes);
    expect(ast.appearance).toStrictEqual(appearance);
    expect(JSON.stringify(ast.symbols)).toBe(JSON.stringify(symbols));
  });

  it('throws on syntax errors', () => {
    expect(() => {
      parse(`node `);
    }).toThrow(Error);
  });
});

import Bubble, {
  NodeShapeModifier,
  NodeStyle,
  NodeStyleOption,
} from './peg/generated-parser';
import { LocationRange } from 'pegjs';

interface ResolvedStyle {
  shape?: Bubble.NodeShapeModifier['shape'];
  styleId?: Bubble.NodeStyleModifier['style']['id'];
  styleOptions?: Map<String, Bubble.NodeStyleOption>;
}

interface StyleNodeCommon {
  location: LocationRange;
  id?: string;
  uid: string;
  label: string;
  body?: string | null;
  style: {
    shape: NodeShapeModifier['shape'];
    styleId: NodeStyle['id'];
    styleOptions: NodeStyleOption[];
  };
}

export type StyleNodeNormal = StyleNodeCommon & {
  type: 'normal';
};

export type StyleNodeBranch = StyleNodeCommon & {
  type: 'branch';
  cases: {
    location: LocationRange;
    uid: string;
    label: String;
    nodes: StyleNode[];
  }[];
};

export type StyleNode = StyleNodeNormal | StyleNodeBranch;

export interface DefaultStyles {
  shape: {
    normal: NodeShapeModifier['shape'];
    branch: NodeShapeModifier['shape'];
  };
  styleId: { normal: NodeStyle['id']; branch: NodeStyle['id'] };
  styleOptions: { normal: NodeStyleOption[]; branch: NodeStyleOption[] };
}

const defaults: DefaultStyles = {
  shape: {
    branch: 'rectangle',
    normal: 'rectangle',
  },
  styleId: {
    branch: '1',
    normal: '1',
  },
  styleOptions: {
    branch: [],
    normal: [],
  },
};

let nextId = 0;
function uid(prefix = '') {
  return prefix + nextId++;
}

export function resolveStyles(ast: Bubble.AST) {
  if (ast.nodes.length === 0) {
    return [];
  }

  const allStyles: Map<string, ResolvedStyle> = new Map();

  if (ast.appearance) {
    ast.appearance.appearances.forEach(appearance => {
      appearance.selectors.forEach(selector => {
        const selectorName =
          selector.type === 'id' ? '@' + selector.value : selector.value;

        const style = allStyles.get(selectorName) ?? {
          shape: undefined,
          styleId: undefined,
          styleOptions: new Map(),
        };

        appearance.modifiers.forEach(modifier => {
          if (modifier.type === 'shape') {
            style.shape = modifier.shape;
          } else if (modifier.type === 'style') {
            style.styleId = modifier.style.id;
            if (modifier.style.options) {
              modifier.style.options.forEach(option => {
                style.styleOptions?.set(option.option, option);
              });
            }
          }
        });

        allStyles.set(selectorName, style);
      });
    });
  }

  const nodes = ast.nodes.map(node => {
    return astNodeToStyleNode(node, allStyles);
  });

  return nodes;
}

function astNodeToStyleNode(
  node: Bubble.Node,
  styles: Map<string, ResolvedStyle>
): StyleNode {
  if (node.type === 'normal') {
    return {
      location: node.location,
      type: node.type,
      id: node.id?.value,
      uid: uid('bubble-node-'),
      label: node.label.value,
      body: node.body?.value,
      style: getNodeStyles(node, styles),
    };
  } else {
    return {
      location: node.location,
      type: node.type,
      id: node.id?.value,
      uid: uid('bubble-node-'),
      label: node.label.value,
      body: node.body?.value,
      style: getNodeStyles(node, styles),
      cases: node.cases.map(_case => {
        return {
          location: _case.location,
          uid: uid('bubble-case-'),
          label: _case.label.value,
          nodes: _case.nodes.map(node => astNodeToStyleNode(node, styles)),
        };
      }),
    };
  }
}

function getNodeStyles(node: Bubble.Node, styles: Map<string, ResolvedStyle>) {
  // We start with the default styles
  const style: StyleNode['style'] = {
    shape: defaults.shape[node.type],
    styleId: defaults.styleId[node.type],
    styleOptions: defaults.styleOptions[node.type],
  };

  // Then override with element specific styles (e.g. node or branch)
  const elementStyle = styles.get(node.type === 'branch' ? 'branch' : 'node');
  overrideStyle(style, elementStyle);

  // Then override with id-specific styles (e.g. @myNode)
  if (node.id) {
    let idStyle = styles.get('@' + node.id.value);
    overrideStyle(style, idStyle);
  }

  return style;
}

function overrideStyle(style: StyleNode['style'], newStyle?: ResolvedStyle) {
  if (newStyle) {
    style.shape = newStyle.shape ?? style.shape;
    style.styleId = newStyle.styleId ?? style.styleId;
    style.styleOptions = newStyle.styleOptions
      ? Array.from(newStyle.styleOptions.values())
      : style.styleOptions;
  }
}

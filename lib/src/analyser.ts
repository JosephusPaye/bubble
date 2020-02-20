import { LocationRange } from 'pegjs';

import Bubble from './peg/generated-parser';

interface AnalysisMessage {
  type: 'error' | 'warning';
  message: string;
  location: LocationRange;
}

interface AnalysisResult {
  errors: AnalysisMessage[];
  warnings: AnalysisMessage[];
}

export function analyse(ast: Bubble.AST): AnalysisResult {
  const results: AnalysisResult = {
    errors: [],
    warnings: [],
  };

  runAnalysis(graphHasAtLeastOneNode(ast.nodes), results);
  runAnalysis(appearanceBlockIsNotEmpty(ast.appearance), results);

  analyseNodes(ast.nodes, ast, results);
  analyseAppearance(ast, results);

  return results;
}

function analyseNodes(
  nodes: Bubble.Node[],
  ast: Bubble.AST,
  results: AnalysisResult
) {
  for (const node of nodes) {
    runAnalysis(nodeIdIsReferencedInAppearance(node, ast), results);
    runAnalysis(labelIsNotEmpty(node, node.type), results);
    runAnalysis(nodeBodyIsNotEmpty(node), results);

    if (node.type === 'branch') {
      runAnalysis(branchHasAtLeastOneCase(node), results);
      runAnalysis(branchHasAtLeastTwoCases(node), results);
      analyseBranchCases(node, ast, results);
    }
  }
}

function analyseBranchCases(
  node: Bubble.BranchNode,
  ast: Bubble.AST,
  results: AnalysisResult
) {
  for (const _case of node.cases) {
    runAnalysis(labelIsNotEmpty(_case, 'case'), results);
    runAnalysis(branchCaseHasAtLeastOneNode(_case), results);
    analyseNodes(_case.nodes, ast, results);
  }
}

function analyseAppearance(ast: Bubble.AST, results: AnalysisResult) {
  if (!ast.appearance) {
    return;
  }

  for (const appearance of ast.appearance.appearances) {
    const existingSelectors = new Set<string>();

    for (const selector of appearance.selectors) {
      runAnalysis(idSelectorRefersToAnExistingElement(selector, ast), results);

      const selectorName =
        selector.type === 'id' ? '@' + selector.value : selector.value;

      if (existingSelectors.has(selectorName)) {
        results.warnings.push({
          type: 'warning',
          message: `The selector "${selectorName}" is a duplicate and can be removed.`,
          location: selector.location,
        });
      } else {
        existingSelectors.add(selectorName);
      }
    }
  }
}

function runAnalysis(
  result: AnalysisMessage | undefined,
  results: AnalysisResult
) {
  if (result) {
    if (result.type === 'warning') {
      results.warnings.push(result);
    } else if (result.type === 'error') {
      results.errors.push(result);
    }
  }
}

function graphHasAtLeastOneNode(
  nodes: Bubble.Node[]
): AnalysisMessage | undefined {
  if (nodes.length === 0) {
    return {
      type: 'error',
      message: 'The graph must have at least one node.',
      location: {
        start: { offset: 0, line: 1, column: 1 },
        end: { offset: 1, line: 1, column: 2 },
      },
    };
  }
  return undefined;
}

function appearanceBlockIsNotEmpty(
  appearance: Bubble.Appearance | undefined
): AnalysisMessage | undefined {
  if (appearance && appearance.appearances.length === 0) {
    return {
      type: 'warning',
      message: 'The appearance block is empty and can be removed.',
      location: appearance.location,
    };
  }
  return undefined;
}

function nodeIdIsReferencedInAppearance(
  node: Bubble.Node,
  ast: Bubble.AST
): AnalysisMessage | undefined {
  if (node.id && ast.symbols.selectors.has('@' + node.id.value) === false) {
    return {
      type: 'warning',
      message:
        `The identifier "${node.id.value}" is not referenced in appearance and can be removed.`,
      location: node.id.location,
    };
  }
  return undefined;
}

function labelIsNotEmpty(
  element: { label: string; location: LocationRange },
  type: string
): AnalysisMessage | undefined {
  if (element.label.trim().length === 0) {
    const names: { [key: string]: string } = {
      normal: 'node',
      branch: 'branch',
    };

    return {
      type: 'warning',
      message: `The ${names[type] || type} label should not be empty.`,
      location: element.location,
    };
  }
  return undefined;
}

function nodeBodyIsNotEmpty(node: Bubble.Node): AnalysisMessage | undefined {
  if (node.body && node.body.trim().length === 0) {
    const names = {
      normal: 'node',
      branch: 'branch',
    };

    return {
      type: 'warning',
      message: `The ${names[node.type]} body is empty and can be removed.`,
      location: node.location,
    };
  }
  return undefined;
}

function branchHasAtLeastOneCase(
  branch: Bubble.BranchNode
): AnalysisMessage | undefined {
  if (branch.cases.length === 0) {
    return {
      type: 'error',
      message: 'A branch must have at least one case.',
      location: branch.location,
    };
  }
  return undefined;
}

function branchHasAtLeastTwoCases(
  branch: Bubble.BranchNode
): AnalysisMessage | undefined {
  if (branch.cases.length < 2) {
    return {
      type: 'warning',
      message: 'A branch should have at least two cases.',
      location: branch.location,
    };
  }
  return undefined;
}

function branchCaseHasAtLeastOneNode(
  _case: Bubble.Case
): AnalysisMessage | undefined {
  if (_case.nodes.length === 0) {
    return {
      type: 'error',
      message: 'Branch cases must have at least one node.',
      location: _case.location,
    };
  }
  return undefined;
}

function idSelectorRefersToAnExistingElement(
  selector: Bubble.NodeAppearanceSelector,
  ast: Bubble.AST
): AnalysisMessage | undefined {
  if (
    selector.type === 'id' &&
    ast.symbols.identifiers.has(selector.value) === false
  ) {
    return {
      type: 'warning',
      message:
        `The identifier "${selector.value}" does not exist in the graph and can be removed.`,
      location: selector.location,
    };
  }
  return undefined;
}

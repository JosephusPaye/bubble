import { ParserOptions, PegjsError, LocationRange, ExpectedItem } from 'pegjs';

declare namespace Bubble {
  export interface NodeId {
    location: LocationRange;
    value: string;
  }

  export interface NormalNode {
    location: LocationRange;
    type: 'normal';
    id: NodeId | null;
    label: string;
    body: string | null;
  }

  export interface BranchNode {
    location: LocationRange;
    type: 'branch';
    id: NodeId | null;
    label: string;
    body: string | null;
    cases: Case[];
  }

  export interface Case {
    location: LocationRange;
    label: string;
    nodes: Node[];
  }

  export type Node = NormalNode | BranchNode;

  export interface NodeAppearanceSelector {
    location: LocationRange;
    type: 'element' | 'id';
    value: string;
  }

  export interface NodeAppearance {
    selectors: NodeAppearanceSelector[];
    modifiers: NodeModifier[];
  }

  export interface NodeShapeModifier {
    location: LocationRange;
    type: 'shape';
    shape: 'rectangle' | 'ellipse';
  }

  export interface NodeStyleModifier {
    location: LocationRange;
    type: 'style';
    style: NodeStyle;
  }

  export interface NodeStyle {
    id: '1' | '2' | '3';
    options: NodeStyleOption[];
  }

  export interface NodeStyleOption {
    type: 'enable' | 'disable';
    option: 'fill' | 'border' | 'shadow' | 'rounded';
  }

  export type NodeModifier = NodeShapeModifier | NodeStyleModifier;

  export interface Appearance {
    location: LocationRange;
    appearances: NodeAppearance[];
  }

  export interface Symbols {
    identifiers: Set<string>;
    selectorLists: Array<string[]>;
    selectors: Set<string>;
  }
  export interface AST {
    nodes: Node[];
    appearance?: Appearance;
    symbols: Symbols;
  }

  export function parse(input: string, options?: ParserOptions): AST;

  export class SyntaxError implements PegjsError {
    name: string;
    message: string;
    location: LocationRange;
    found?: any;
    expected?: ExpectedItem[];
    stack?: any;
    constructor(
      message: string,
      expected?: string,
      found?: string,
      location?: LocationRange
    );
    static buildMessage(expected: string, found: string): string;
  }
}

export = Bubble;

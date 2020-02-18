import { ParserOptions, PegjsError, LocationRange, ExpectedItem } from 'pegjs';

declare namespace BubbleParser {
  export interface NormalNode {
    type: 'normal';
    id: string | null;
    label: string;
    body: string | null;
  }

  export interface BranchNode {
    type: 'normal';
    id: string | null;
    label: string;
    body: string | null;
    cases: Case;
  }

  export interface Case {
    label: string;
    nodes: Node[];
  }

  export type Node = BranchNode | NormalNode;

  export interface NodeAppearance {
    nodeId: string;
    modifiers: NodeModifier[];
  }

  export interface ShapeModifier {
    shape: 'rectangle' | 'ellipse';
  }

  export interface StyleModifier {
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

  export type NodeModifier = ShapeModifier | StyleModifier;

  export interface AST {
    nodes: Node[];
    appearance?: NodeAppearance[];
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

export = BubbleParser;

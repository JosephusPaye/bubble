import { parse, SyntaxError } from './peg/generated-parser';
import { analyse } from './analyser';
import { resolveStyles } from './style-resolver';

export { parse, SyntaxError, analyse, resolveStyles };

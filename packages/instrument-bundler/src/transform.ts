import { parseImports } from './parse.js';

import type { ImportClause } from './parse.js';

function transformImportClause(importClause: ImportClause) {
  if (importClause.namespace) {
    return importClause.namespace;
  }
  const names = importClause.named.map(({ binding, specifier }) => {
    if (binding === specifier) {
      return specifier;
    }
    return `${specifier}: ${binding}`;
  });
  if (importClause.default) {
    names.push(`default: ${importClause.default}`);
  }
  return `{ ${names.join(', ')} }`;
}

export function transformStaticImports(code: string) {
  let indexDiff = 0;
  for (const {
    endIndex: _endIndex,
    importClause,
    isDynamicImport,
    moduleSpecifier,
    startIndex: _startIndex
  } of parseImports(code)) {
    if (isDynamicImport) {
      continue;
    }
    const endIndex = _endIndex + indexDiff;
    const startIndex = _startIndex + indexDiff;
    const source = code.slice(startIndex, endIndex);
    const replacement = `const ${transformImportClause(importClause!)} = await import(${moduleSpecifier.code})`;
    indexDiff += replacement.length - source.length;
    code = code.slice(0, startIndex) + replacement + code.slice(endIndex, code.length);
  }
  return code;
}

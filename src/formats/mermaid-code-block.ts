import type TypeBlock from 'quill/blots/block';
import Quill from 'quill';

const Delta = Quill.import('delta');
const CodeBlock = Quill.import('formats/code-block') as typeof TypeBlock;

export class MermaidCodeBlock extends CodeBlock {
  static blotName: string = 'mermaid-code-block';

  cacheDelta = new Delta();
  delta() {
    return this.cacheDelta;
  }
}

import type TypeContainer from 'quill/blots/container';
import type TypeScroll from 'quill/blots/scroll';
import { events } from '@/utils';
import Quill from 'quill';
import { MermaidCodeBlock } from './mermaid-code-block';

const Container = Quill.import('blots/container') as typeof TypeContainer;

export class MermaidEditorFormat extends Container {
  static tagName: string = 'div';
  static blotName: string = 'mermaid-editor';
  static className: string = 'ql-mermaid-editor';

  static register() {
    Quill.register({
      [`formats/${MermaidCodeBlock.blotName}`]: MermaidCodeBlock,
    }, true);
  }

  static create(value: string) {
    const node = super.create();
    const lines = value.split('\n');
    const codeContainer = document.createElement('div');
    codeContainer.classList.add('code-block-container');
    for (const line of lines) {
      const code = document.createElement('p');
      code.textContent = line;
      codeContainer.appendChild(code);
    }
    node.appendChild(codeContainer);
    return node;
  }

  constructor(scroll: TypeScroll, domNode: HTMLElement) {
    super(scroll, domNode);
    const ob = new MutationObserver(() => {
      try {
        // clear delta change
        scroll.emitter.emit(Quill.events.SCROLL_UPDATE);
      }
      catch {}
      scroll.emitter.emit(events.mermaidTextChange);
    });
    ob.observe(domNode, {
      attributes: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true,
    });
  }
}

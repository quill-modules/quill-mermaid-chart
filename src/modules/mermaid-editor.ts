import type { MermaidChartFormat } from '@/formats';
import type Quill from 'quill';
import { createDialog, renderMermaidInNode } from '@/utils';

export interface MerMaidOptions {
  onClose: () => void;
}
export class MermaidEditor {
  closeEditor: () => void;
  options: MerMaidOptions;
  editor!: HTMLElement;
  preview!: HTMLElement;
  chart!: HTMLElement;
  textInput!: HTMLElement;
  constructor(public quill: Quill, public mermaidBlot: MermaidChartFormat, options?: Partial<MerMaidOptions>) {
    this.options = this.resolveOptions(options);

    const { dialog, close } = createDialog({
      content: this.createEditor(),
      onClose: this.options.onClose,
      onShow: () => {
        renderMermaidInNode(this.preview, 'preview', this.mermaidBlot.text, this.chart);
      },
      onConfirm: () => {
        const texts: string[] = [];
        for (const line of Array.from(this.textInput.children)) {
          texts.push(line.textContent || '');
        }
        const text = texts.join('\n');
        this.mermaidBlot.text = text;
      },
      cancel: false,
    });
    this.closeEditor = close;
    dialog.style.maxWidth = '1024px';
  }

  resolveOptions(options?: Partial<MerMaidOptions>): MerMaidOptions {
    return Object.assign({
      onClose: () => {},
    }, options);
  }

  createEditor() {
    this.editor = document.createElement('div');
    this.editor.classList.add('qmc-mermaid-editor');
    const textInputBox = document.createElement('div');
    textInputBox.classList.add('qmc-mermaid-input');
    this.textInput = document.createElement('pre');
    this.textInput.setAttribute('contenteditable', 'true');
    for (const text of this.mermaidBlot.text.split('\n')) {
      const line = document.createElement('div');
      line.textContent = text;
      this.textInput.appendChild(line);
    }
    this.textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    });
    textInputBox.appendChild(this.textInput);
    this.preview = document.createElement('div');
    this.preview.classList.add('qmc-mermaid-preview');
    this.chart = document.createElement('div');
    this.chart.classList.add('qmc-mermaid-preview-chart');
    this.preview.appendChild(this.chart);
    this.editor.appendChild(textInputBox);
    this.editor.appendChild(this.preview);
    return this.editor;
  }
}

import type { MermaidChartFormat } from '@/formats';
import type Quill from 'quill';
import type { EditorInputElement, HistroyInputOptions } from './history-input';
import { createDialog, debounce, renderMermaidInNode, SHORTKEY } from '@/utils';
import { HistroyInput } from './history-input';

export interface MerMaidEditorOptions {
  dialogMaskClickClose: boolean;
  onClose: () => void;
}
export class MermaidEditor {
  closeEditor: () => void;
  options: MerMaidEditorOptions;
  editor!: HTMLElement;
  preview!: HTMLElement;
  chart!: HTMLElement;
  textInput!: HistroyInput;
  histroyStackOptions?: Partial<HistroyInputOptions>;
  constructor(public quill: Quill, public mermaidBlot: MermaidChartFormat, options?: Partial<MerMaidEditorOptions>, histroyStackOptions?: Partial<HistroyInputOptions>) {
    this.options = this.resolveOptions(options);
    this.histroyStackOptions = histroyStackOptions;

    const { dialog, close } = createDialog({
      content: this.createEditor(),
      onClose: this.options.onClose,
      onShow: () => this.updatePreview(),
      clickMaskClose: this.options.dialogMaskClickClose,
      onConfirm: () => {
        this.mermaidBlot.text = this.getInputText();
      },
      cancel: false,
    });
    this.closeEditor = close;
    dialog.style.maxWidth = `${Math.min(1024, window.innerWidth * 0.8)}px`;
  }

  resolveOptions(options?: Partial<MerMaidEditorOptions>): MerMaidEditorOptions {
    return Object.assign({
      dialogMaskClickClose: true,
      onClose: () => {},
    }, options);
  }

  updatePreview() {
    renderMermaidInNode(this.preview, 'preview', this.getInputText(), this.chart);
  }

  getInputText() {
    return this.textInput.el.value;
  }

  bindInputEvent() {
    const renderPreview = debounce(() => {
      this.updatePreview();
    }, 500);
    this.textInput.el.addEventListener('keydown', (e) => {
      let isNeedUpdate = false;
      if (e.code === 'Tab') {
        e.preventDefault();
        const { selectionStart, selectionEnd } = this.textInput.el;
        const input = e.target! as EditorInputElement;
        input.value = `${input.value.slice(0, selectionStart)}  ${input.value.slice(selectionEnd)}`;
        input.setSelectionRange(selectionStart + 2, selectionStart + 2);
        isNeedUpdate = true;
      }
      if (e[SHORTKEY] && e.code === 'KeyZ') {
        if (e.shiftKey) {
          this.textInput.redo();
        }
        else {
          this.textInput.undo();
        }
        e.preventDefault();
        isNeedUpdate = true;
      }

      if (isNeedUpdate) {
        renderPreview();
      }
    });
    this.textInput.el.addEventListener('input', () => {
      renderPreview();
    });
  }

  createEditor() {
    this.editor = document.createElement('div');
    this.editor.classList.add('qmc-mermaid-editor');
    const textInputBox = document.createElement('div');
    textInputBox.classList.add('qmc-mermaid-input');
    this.textInput = new HistroyInput(document.createElement('textarea'), this.histroyStackOptions);
    this.textInput.el.classList.add('qmc-mermaid-input-content');
    this.textInput.el.value = this.mermaidBlot.text;
    this.bindInputEvent();
    textInputBox.appendChild(this.textInput.el);
    this.preview = document.createElement('div');
    this.preview.classList.add('qmc-mermaid-preview');
    this.chart = document.createElement('div');
    this.chart.classList.add('qmc-mermaid-preview-chart');
    this.preview.appendChild(this.chart);
    this.editor.appendChild(textInputBox);
    this.editor.appendChild(this.preview);
    this.editor.style.height = `${Math.min(600, window.innerHeight * 0.5)}px`;
    return this.editor;
  }
}

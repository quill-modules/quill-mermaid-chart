import type { EditorInputElement } from '@/modules/history-input';
import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import { HistroyInput } from '@/modules/history-input';
import { bem, calcTextareaHeight, chartTemplate, debounce, mermaidDataKey, randomId, renderMermaidInNode, SHORTKEY } from '@/utils';
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed;

type MermaidChartNode = HTMLElement & { [mermaidDataKey]: string };
export type MermaidChartMode = 'edit' | 'chart';
export class MermaidChartFormat extends BlockEmbed {
  static tagName = 'mc-chard';
  static blotName = 'mermaid-chart';
  static className = bem.be('chart');
  static create(value: string) {
    if (!value) value = chartTemplate[(Object.keys(chartTemplate) as (keyof typeof chartTemplate)[])[0]];
    const node = super.create() as MermaidChartNode;
    node.setAttribute('contenteditable', 'false');
    node[mermaidDataKey] = value;
    const id = randomId();
    node.dataset.id = id;
    const chart = document.createElement('div');
    chart.classList.add(bem.be('chart-box'));
    const chartInner = document.createElement('div');
    chartInner.classList.add(bem.be('chart-inner'));
    chart.appendChild(chartInner);
    node.appendChild(chart);
    renderMermaidInNode(chart, id, value, chartInner);
    return node;
  }

  static value(domNode: MermaidChartNode) {
    return domNode[mermaidDataKey] || '';
  }

  textInput?: HistroyInput;
  mode: MermaidChartMode = 'chart';
  declare domNode: MermaidChartNode;

  get id() {
    return this.domNode.dataset.id!;
  }

  get text() {
    return this.domNode[mermaidDataKey];
  }

  getChart() {
    return this.domNode.querySelector(`:scope > .${bem.be('chart-box')}`) as HTMLElement;
  }

  getChartInner() {
    return this.domNode.querySelector(`:scope .${bem.be('chart-inner')}`) as HTMLElement;
  }

  getEditor() {
    return this.domNode.querySelector(`:scope > .${bem.be('editor')}`) as HTMLElement;
  }

  private bindInputEvent(textInput: HistroyInput) {
    const renderPreview = debounce(async () => {
      await this.updatePreview(textInput.el.value);
      this.calculateHeight();
      // TODO: quill internal change selection range?
      textInput.el.blur();
      setTimeout(() => textInput.el.focus());
    }, 500);

    textInput.el.addEventListener('keydown', async (e) => {
      e.stopPropagation();
      let isNeedUpdate = false;
      if (e.code === 'Tab') {
        e.preventDefault();
        const { selectionStart, selectionEnd } = textInput.el;
        const input = e.target! as EditorInputElement;
        input.value = `${input.value.slice(0, selectionStart)}  ${input.value.slice(selectionEnd)}`;
        input.setSelectionRange(selectionStart + 2, selectionStart + 2);
        isNeedUpdate = true;
      }
      if (e[SHORTKEY] && e.code === 'KeyZ') {
        if (e.shiftKey) {
          textInput.redo();
        }
        else {
          textInput.undo();
        }
        e.preventDefault();
        isNeedUpdate = true;
      }

      if (isNeedUpdate) {
        renderPreview();
      }
    }, { capture: true });
    textInput.el.addEventListener('input', () => {
      renderPreview();
    });
    // stopPropagation to quill
    textInput.el.addEventListener('copy', e => e.stopPropagation());
    textInput.el.addEventListener('cut', e => e.stopPropagation());
    textInput.el.addEventListener('paste', e => e.stopPropagation());
  }

  private createEditor() {
    if (this.getEditor()) return;
    const editor = document.createElement('div');
    editor.classList.add(bem.be('editor'));
    this.textInput = new HistroyInput(document.createElement('textarea'));
    this.textInput.el.classList.add(bem.be('editor-input'));
    this.textInput.el.value = this.domNode[mermaidDataKey];
    this.bindInputEvent(this.textInput);
    editor.appendChild(this.textInput.el);
    editor.addEventListener('click', () => {
      if (this.textInput) {
        this.textInput.el.focus();
      }
    });

    this.domNode.insertBefore(editor, this.domNode.firstChild);
    this.calculateHeight();
    this.mode = 'edit';
  }

  calculateHeight() {
    if (!this.textInput) return;
    const chartInner = this.getChartInner();
    const chartHeight = chartInner.getBoundingClientRect().height;
    const { height } = calcTextareaHeight(this.textInput.el);
    let resHeight = Number.parseFloat(height);
    if (chartHeight < resHeight) {
      if (resHeight > 500) {
        resHeight = 500;
      }
    }
    else {
      resHeight = chartHeight;
    }
    this.textInput.el.style.minHeight = `${resHeight}px`;
  }

  updatePreview(value: string) {
    const chart = this.getChart();
    const chartInner = this.getChartInner();

    if (!chart || !chartInner) return;
    this.domNode[mermaidDataKey] = value;
    return renderMermaidInNode(chart, this.id, value, chartInner);
  }

  removeEditor() {
    const editor = this.getEditor();
    if (editor) {
      editor.remove();
      this.mode = 'chart';
    }
  }

  changeMode(mode: MermaidChartMode) {
    if (mode === 'edit') {
      if (this.mode === 'chart') {
        this.createEditor();
      }
    }
    else if (mode === 'chart' && this.mode === 'edit') {
      this.removeEditor();
    }
  }
}

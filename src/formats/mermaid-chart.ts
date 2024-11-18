import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeScroll from 'quill/blots/scroll';
import { calcTextareaHeight, events, randomId } from '@/utils';
import { createLoading } from '@/utils/components';
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed;

window.mermaid.initialize({ startOnLoad: false });

export type MermaidChartFormatMode = 'edit' | 'chart';
async function renderMermaidChart(id: string, value: string, container: HTMLElement) {
  let result = null;
  try {
    const valid = await window.mermaid.parse(value);
    if (valid) {
      result = await window.mermaid.render(`chart-${id}`, value, container);
    }
    if (result) {
      container.innerHTML = result.svg;
    }
  }
  catch (error: any) {
    console.error(error);
    container.innerHTML = error.message;
  }
  return result;
}

export class MermaidChartFormat extends BlockEmbed {
  static tagName = 'div';
  static blotName = 'mermaid-chart';
  static className = 'ql-mermaid-chart';
  static create(value: string) {
    const node = super.create() as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    node.dataset.chart = value;
    const id = randomId();
    node.dataset.id = id;
    const chart = document.createElement('div');
    chart.classList.add('chart');
    node.appendChild(chart);
    const { close } = createLoading(node);
    new Promise<void>(async (resolve) => {
      await renderMermaidChart(id, value, chart);
      close();
      resolve();
    });

    return node;
  }

  static value(domNode: HTMLElement) {
    return domNode.dataset.chart || '';
  }

  mode: MermaidChartFormatMode = 'chart';
  editor?: HTMLTextAreaElement;

  getChart() {
    return this.domNode.querySelector(`.chart`) as HTMLElement;
  }

  createEditor() {
    if (this.editor) return;
    this.editor = document.createElement('textarea');
    this.editor.classList.add('editor');
    const text = MermaidChartFormat.value(this.domNode);
    this.editor.value = text;
    this.editor.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.code === 'Tab') {
        e.preventDefault();
      }
    });
    this.editor.addEventListener('input', () => {
      if (this.editor) {
        resizeTextarea(this.editor);
        // TODO: in quill. can't type after change height(like type 'enter'), and textarea not blur
        this.editor.blur();
        setTimeout(() => {
          this.editor!.focus();
        }, 0);
      }
    });
    this.domNode.appendChild(this.editor);
    resizeTextarea(this.editor!);
  }

  async removeEditor() {
    if (!this.editor) return;
    const text = this.editor.value!;
    const chart = this.getChart();
    const id = randomId();
    const result = await renderMermaidChart(id, text, chart);
    this.domNode.dataset.chart = text;
    if (result) {
      this.domNode.dataset.id = id;
    }
    this.editor.remove();
    this.editor = undefined;
  }

  async switchMode() {
    if (this.mode === 'chart') {
      this.createEditor();
      const chart = this.getChart();
      chart.style.display = 'none';
      this.mode = 'edit';
    }
    else {
      const chart = this.getChart();
      chart.style.display = 'block';
      await this.removeEditor();
      this.mode = 'chart';
    }
    (this.scroll as TypeScroll).emitter.emit(events.mermaidModeChange, this.mode);
  }
}

function resizeTextarea(textarea: HTMLTextAreaElement) {
  const textareaStyle = calcTextareaHeight(textarea);
  Object.assign(textarea.style, textareaStyle);
}

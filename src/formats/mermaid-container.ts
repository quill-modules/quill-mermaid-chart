/* eslint-disable ts/ban-ts-comment */
import type TypeBlock from 'quill/blots/block';
import type TypeContainer from 'quill/blots/container';
import type TypeScroll from 'quill/blots/scroll';
import type TypeText from 'quill/blots/text';
import type { MermaidChartFormat, MermaidChartFormatMode } from './mermaid-chart';
import { dataKey, events } from '@/utils';
import Quill from 'quill';
import { MermaidCodeBlock } from './mermaid-code-block';
import { MermaidEditorFormat } from './mermaid-editor';

window.mermaid.initialize({ startOnLoad: false });

const Container = Quill.import('blots/container') as typeof TypeContainer;

export class MermaidContainerFormat extends Container {
  static blotName: string = 'mermaid-contianer';
  static tagName: string = 'div';
  static className: string = 'ql-mermaid-container';
  static register() {
    Quill.register({
      [`formats/${MermaidEditorFormat.blotName}`]: MermaidEditorFormat,
    }, true);
  }

  declare scroll: TypeScroll;
  mode: MermaidChartFormatMode = 'chart';

  getChart() {
    return this.children.tail as MermaidChartFormat;
  }

  getEditor() {
    if (this.children.length <= 1) return null;
    return this.children.head as MermaidEditorFormat;
  }

  createEditor() {
    const chart = this.getChart();
    if (!chart) return;

    const editor = this.scroll.create(MermaidEditorFormat.blotName, chart.domNode[dataKey]) as TypeContainer;
    const codeContainer = this.scroll.create('code-block-container') as TypeContainer;
    const lines = chart.domNode[dataKey].split('\n');
    for (const line of lines) {
      const code = this.scroll.create(MermaidCodeBlock.blotName, 'plain') as TypeBlock;
      code.appendChild(this.scroll.create('text', line));
      codeContainer.appendChild(code);
    }
    editor.appendChild(codeContainer);

    // @ts-ignore
    this.scroll.emitter.on(events.mermaidTextChange, this.updateChart);
    this.insertBefore(editor, this.children.head);
  }

  updateChart = () => {
    const chart = this.getChart();
    const editor = this.getEditor();
    if (!editor || !chart) return;
    const text = editor.descendants(MermaidCodeBlock).map(code => (code.children.head as TypeText).value()).join('\n');
    chart.updateChart(text);
  };

  removeEditor() {
    const editor = this.getEditor();
    const chart = this.getChart();
    if (!editor || !chart) return;
    editor.remove();
    // @ts-ignore
    this.scroll.emitter.off(events.mermaidModeChange);
  }

  async switchMode() {
    if (this.mode === 'chart') {
      this.createEditor();
      this.mode = 'edit';
    }
    else {
      this.removeEditor();
      this.mode = 'chart';
    }
    this.scroll.emitter.emit(events.mermaidModeChange, this.mode);
  }
}

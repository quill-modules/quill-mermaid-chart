import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import { dataKey, randomId, svgStringToBase64 } from '@/utils';
import { createLoading } from '@/utils/components';
import Quill from 'quill';
import { MermaidContainerFormat } from './mermaid-container';

window.mermaid.initialize({ startOnLoad: false });

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed;

type MermaidChartNode = HTMLElement & { [dataKey]: string };
export type MermaidChartFormatMode = 'edit' | 'chart';

async function renderMermaidChart(id: string, value: string, chart: HTMLElement) {
  let result = null;
  try {
    const valid = await window.mermaid.parse(value);
    if (valid) {
      result = await window.mermaid.render(`chart-${id}`, value, chart);
    }
    if (result) {
      const base64 = svgStringToBase64(result.svg);
      const img = new Image();
      img.src = `data:image/svg+xml;base64,${window.btoa(base64)}`;
      chart.innerHTML = '';
      chart.appendChild(img);
    }
  }
  catch (error: any) {
    console.error(error);
    chart.innerHTML = error.message;
  }
  return result;
}

export class MermaidChartFormat extends BlockEmbed {
  static tagName = 'div';
  static blotName = 'mermaid-chart';
  static className = 'ql-mermaid-chart';
  static register() {
    Quill.register({
      [`formats/${MermaidContainerFormat.blotName}`]: MermaidContainerFormat,
    }, true);
  }

  static create(value: string) {
    const node = super.create() as MermaidChartNode;
    node.setAttribute('contenteditable', 'false');
    node[dataKey] = value;
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

  static value(domNode: MermaidChartNode) {
    return domNode[dataKey] || '';
  }

  declare domNode: MermaidChartNode;

  get id() {
    return this.domNode.dataset.id!;
  }

  length(): number {
    return this.domNode[dataKey].length;
  }

  getChart() {
    return this.domNode.querySelector(`.chart`) as HTMLElement;
  }

  async updateChart(text: string) {
    this.domNode[dataKey] = text;
    await renderMermaidChart(this.id, text, this.getChart());
  }
}

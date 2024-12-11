import type { MermaidConfig } from 'mermaid';
import { createLoading } from './components';
import { svgStringToBase64 } from './svg';

export function renderMermaidInNode(node: HTMLElement, id: string, value: string, chart: HTMLElement, options?: Parameters<typeof renderMermaidChart>['3']) {
  const { close } = createLoading(node);
  return new Promise<void>(async (resolve) => {
    await renderMermaidChart(id, value, chart, options);
    close();
    if (node.scrollWidth > node.offsetWidth) {
      node.scrollLeft = (node.scrollWidth - node.offsetWidth) / 2;
    }
    resolve();
  });
}
export interface MermaidChartRenderOptions {
  config?: MermaidConfig;
}
export async function renderMermaidChart(id: string, value: string, chart: HTMLElement, {
  config,
}: MermaidChartRenderOptions = {}) {
  let result = null;
  try {
    window.mermaid.initialize(Object.assign({}, {
      startOnLoad: false,
      flowchart: { useMaxWidth: false },
      sequence: { useMaxWidth: false },
      gantt: { useMaxWidth: false },
      journey: { useMaxWidth: false },
      timeline: { useMaxWidth: false },
      class: { useMaxWidth: false },
      state: { useMaxWidth: false },
      er: { useMaxWidth: false },
      pie: { useMaxWidth: false },
      quadrantChart: { useMaxWidth: false },
      xyChart: { useMaxWidth: false },
      requirement: { useMaxWidth: false },
      architecture: { useMaxWidth: false },
      mindmap: { useMaxWidth: false },
      kanban: { useMaxWidth: false },
      gitGraph: { useMaxWidth: false },
      c4: { useMaxWidth: false },
      sankey: { useMaxWidth: false },
      packet: { useMaxWidth: false },
      block: { useMaxWidth: false },
    }, config));
    const valid = await window.mermaid.parse(value);
    if (valid) {
      result = await window.mermaid.render(`chart-${id}`, value, chart);
    }
    if (result) {
      const { url, width, height } = svgStringToBase64(result.svg);
      const img = new Image();
      img.src = url;
      if (width > 800 && height > 800) {
        Object.assign(chart.style, {
          width: `800px`,
          height: `800px`,
        });
      }
      else if (width > height) {
        Object.assign(chart.style, {
          width: `${width}px`,
          height: null,
        });
      }
      else {
        Object.assign(chart.style, {
          height: `${height}px`,
          width: null,
        });
      }
      chart.appendChild(img);
    }
  }
  catch (error: any) {
    console.error(error);
    chart.innerHTML = error.message;
  }
  return result;
}

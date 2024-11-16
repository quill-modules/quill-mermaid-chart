import type TypeToolbar from 'quill/modules/toolbar';
import { MermaidChartFormat } from '@/formats';
import { MermaidEdit } from '@/modules';
import Quill from 'quill';
import mermaidSvg from './svg/mermaid.svg';

const icons = Quill.import('ui/icons') as Record<string, string>;
export class QuillMermaid {
  static register() {
    icons[MermaidChartFormat.blotName] = mermaidSvg;
    Quill.register({
      [`formats/${MermaidChartFormat.blotName}`]: MermaidChartFormat,
    }, true);
  }

  mermaidBlot?: MermaidChartFormat;
  mermaidSelector?: MermaidEdit;
  constructor(public quill: Quill) {
    const toolbar = this.quill.getModule('toolbar') as TypeToolbar;
    if (toolbar) {
      toolbar.addHandler(MermaidChartFormat.blotName, () => {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, MermaidChartFormat.blotName, '');
      });
    }
    this.quill.root.addEventListener(
      'click',
      (evt: MouseEvent) => {
        if (!this.quill.scroll.isEnabled()) return;
        const path = evt.composedPath() as HTMLElement[];
        if (!path || path.length <= 0) return;

        const chartNode = path.find((node) => {
          const blot = Quill.find(node);
          return blot instanceof MermaidChartFormat;
        });
        if (chartNode) {
          const mermaidBlot = Quill.find(chartNode) as MermaidChartFormat;
          if (this.mermaidBlot === mermaidBlot) {
            return;
          }
          this.updateMermaidSelector(mermaidBlot);
        }
        else {
          this.destroyMermaidSelector();
        }
      },
      false,
    );
    this.quill.on(Quill.events.TEXT_CHANGE, () => {
      this.destroyMermaidSelector();
    });
  }

  updateMermaidSelector(mermaidBlot: MermaidChartFormat) {
    if (this.mermaidSelector) {
      this.destroyMermaidSelector();
    }
    if (mermaidBlot) {
      this.mermaidBlot = mermaidBlot;
      this.mermaidSelector = new MermaidEdit(this.quill, this.mermaidBlot, {
        onDestroy: () => this.destroyMermaidSelector(),
      });
    }
  }

  destroyMermaidSelector() {
    if (this.mermaidSelector) {
      this.mermaidSelector.destroy();
      this.mermaidBlot = undefined;
      this.mermaidSelector = undefined;
    }
  }
}

import type { MerMaidEditorOptions } from '@/modules';
import type TypeToolbar from 'quill/modules/toolbar';
import type { HistroyInputOptions } from './modules/history-input';
import { MermaidChartFormat } from '@/formats';
import { MermaidSelector } from '@/modules';
import Quill from 'quill';
import mermaidSvg from './svg/mermaid.svg';

export interface QuillMermaidOptions {
  editor: Partial<MerMaidEditorOptions>;
  histroyStackOptions: Partial<HistroyInputOptions>;
}

export class QuillMermaid {
  static register() {
    const icons = Quill.import('ui/icons') as Record<string, string>;
    icons[MermaidChartFormat.blotName] = mermaidSvg;

    Quill.register({
      [`formats/${MermaidChartFormat.blotName}`]: MermaidChartFormat,
    }, true);
  }

  mermaidBlot?: MermaidChartFormat;
  mermaidSelector?: MermaidSelector;
  options: QuillMermaidOptions;
  constructor(public quill: Quill, options?: Partial<QuillMermaidOptions>) {
    this.options = this.resolveOptions(options);
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
  }

  resolveOptions(options: Partial<QuillMermaidOptions> = {}): QuillMermaidOptions {
    return Object.assign({
      editor: {},
      histroyStackOptions: {},
    }, options);
  }

  updateMermaidSelector(mermaidBlot: MermaidChartFormat) {
    if (this.mermaidSelector) {
      this.destroyMermaidSelector();
    }
    if (mermaidBlot) {
      this.mermaidBlot = mermaidBlot;
      this.mermaidSelector = new MermaidSelector(this.quill, this.mermaidBlot, {
        onDestroy: () => this.destroyMermaidSelector(),
        editorOptions: this.options.editor,
      }, this.options.histroyStackOptions);
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

import type { Range } from 'quill';
import type TypeContainer from 'quill/blots/container';
import type TypeKeyboard from 'quill/modules/keyboard';
import type { Context } from 'quill/modules/keyboard';
import type TypeToolbar from 'quill/modules/toolbar';
import { MermaidChartFormat, MermaidContainerFormat, MermaidEditorFormat } from '@/formats';
import { MermaidSelector } from '@/modules';
import Quill from 'quill';
import mermaidSvg from './svg/mermaid.svg';

const CodeBlockContainer = Quill.import('formats/code-block-container') as typeof TypeContainer;
MermaidChartFormat.requiredContainer = MermaidContainerFormat;
MermaidContainerFormat.allowedChildren = [MermaidChartFormat, MermaidEditorFormat];

MermaidEditorFormat.allowedChildren = [CodeBlockContainer];
MermaidEditorFormat.defaultChild = CodeBlockContainer;

const Delta = Quill.import('delta');
export class QuillMermaid {
  static keyboradHandler = {
    'code not exit': {
      bindInHead: true,
      key: 'Enter',
      collapsed: true,
      format: ['mermaid-code-block'],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(this: { quill: Quill }, range: Range, context: Context) {
        if (context.line.parent.parent instanceof MermaidEditorFormat) {
          const [line, offset] = this.quill.getLine(range.index);
          const delta = new Delta()
            .retain(range.index + line!.length() - offset - 2)
            .insert('\n', { 'mermaid-code-block': 'plain' });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          return false;
        }
        return true;
      },
    },
  };

  static register() {
    const icons = Quill.import('ui/icons') as Record<string, string>;
    icons[MermaidChartFormat.blotName] = mermaidSvg;

    Quill.register({
      [`formats/${MermaidChartFormat.blotName}`]: MermaidChartFormat,
    }, true);
  }

  mermaidBlot?: MermaidContainerFormat;
  mermaidSelector?: MermaidSelector;
  constructor(public quill: Quill) {
    const toolbar = this.quill.getModule('toolbar') as TypeToolbar;
    if (toolbar) {
      toolbar.addHandler(MermaidChartFormat.blotName, () => {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, MermaidChartFormat.blotName, '');
      });
    }

    const keyboard = this.quill.getModule('keyboard') as TypeKeyboard;
    for (const handle of Object.values(QuillMermaid.keyboradHandler)) {
      // insert before default key handler
      if (handle.bindInHead) {
        keyboard.bindings[handle.key].unshift(handle);
      }
      else {
        keyboard.addBinding(handle.key, handle);
      }
    }

    this.quill.root.addEventListener(
      'click',
      (evt: MouseEvent) => {
        if (!this.quill.scroll.isEnabled()) return;
        const path = evt.composedPath() as HTMLElement[];
        if (!path || path.length <= 0) return;

        const chartNode = path.find((node) => {
          const blot = Quill.find(node);
          return blot instanceof MermaidContainerFormat;
        });
        if (chartNode) {
          const mermaidBlot = Quill.find(chartNode) as MermaidContainerFormat;
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
    // this.quill.on(Quill.events.TEXT_CHANGE, () => {
    //   this.destroyMermaidSelector();
    // });
  }

  updateMermaidSelector(mermaidBlot: MermaidContainerFormat) {
    if (this.mermaidSelector) {
      this.destroyMermaidSelector();
    }
    if (mermaidBlot) {
      this.mermaidBlot = mermaidBlot;
      this.mermaidSelector = new MermaidSelector(this.quill, this.mermaidBlot, {
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

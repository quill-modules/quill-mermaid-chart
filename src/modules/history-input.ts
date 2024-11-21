import { historyStackKey } from '@/utils';

export interface HistroyInputOptions {
  maxStack: number;
}
export interface HistroyStackItem {
  value: string;
  range: [number, number];
}
export interface HistroyStack {
  redo: HistroyStackItem[];
  undo: HistroyStackItem[];
}
export type EditorInputElement = HTMLTextAreaElement & { [historyStackKey]: HistroyStack };

export class HistroyInput {
  el: EditorInputElement;
  options: HistroyInputOptions;
  constructor(el: HTMLTextAreaElement & { [historyStackKey]?: HistroyStack }, options?: Partial<HistroyInputOptions>) {
    this.options = this.resolveOptions(options);
    el[historyStackKey] = {
      redo: [],
      undo: [],
    };
    this.el = el as EditorInputElement;
    this.el.addEventListener('beforeinput', (e) => {
      if (e.isComposing) return;
      this.record(this.el.value, [this.el.selectionStart, this.el.selectionEnd]);
    });
    let compositionStartItem: HistroyStackItem = {
      value: '',
      range: [0, 0],
    };
    this.el.addEventListener('compositionstart', () => {
      compositionStartItem = { value: this.el.value, range: [this.el.selectionStart, this.el.selectionEnd] };
    });
    this.el.addEventListener('compositionend', () => {
      this.record(compositionStartItem.value, compositionStartItem.range);
    });
  }

  resolveOptions(options: Partial<HistroyInputOptions> = {}): HistroyInputOptions {
    return Object.assign({
      maxStack: 100,
    }, options);
  }

  record(value: string, range: [number, number]) {
    this.el[historyStackKey].redo = [];
    this.el[historyStackKey].undo.push({ value, range });
    if (this.el[historyStackKey].undo.length > this.options.maxStack) {
      this.el[historyStackKey].undo.shift();
    }
  }

  undo() {
    const item = this.el[historyStackKey].undo.pop();
    if (!item) return;
    this.el[historyStackKey].redo.push({
      value: this.el.value,
      range: [this.el.selectionStart, this.el.selectionEnd],
    });
    this.el.value = item.value;
    this.el.setSelectionRange(...item.range);
  }

  redo() {
    const item = this.el[historyStackKey].redo.pop();
    if (!item) return;
    this.el[historyStackKey].undo.push({
      value: this.el.value,
      range: [this.el.selectionStart, this.el.selectionEnd],
    });
    this.el.value = item.value;
    this.el.setSelectionRange(...item.range);
  }
}

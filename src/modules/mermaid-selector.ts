import type { MermaidChartFormat } from '@/formats';
import type Quill from 'quill';
import type { HistroyInputOptions } from './history-input';
import { addScrollEvent, bem, chartTemplate, clearScrollEvent } from '@/utils';
import closeSvg from '../svg/close.svg';
import editSvg from '../svg/edit.svg';

export interface MermaidSelectorOptions {
  onDestroy: () => void;
  onRemove: (blot: MermaidChartFormat) => Promise<boolean> | boolean;
  onEdit: (blot: MermaidChartFormat, isEnter: boolean) => void;
}
export class MermaidSelector {
  #internalDestroy: boolean = false;
  scrollHandler: [HTMLElement, (e: Event) => void][] = [];
  options: MermaidSelectorOptions;
  root: HTMLElement | null = null;
  selector?: HTMLElement;
  resizeOb?: ResizeObserver;
  histroyStackOptions?: Partial<HistroyInputOptions>;
  constructor(public quill: Quill, public mermaidBlot: MermaidChartFormat, options: Partial<MermaidSelectorOptions>, histroyStackOptions?: Partial<HistroyInputOptions>) {
    this.options = this.resolveOptions(options);
    this.histroyStackOptions = histroyStackOptions;

    this.root = this.quill.addContainer(bem.be('toolbox'));
    this.createSelector();
  }

  resolveOptions(options?: Partial<MermaidSelectorOptions>) {
    return Object.assign({
      onDestroy: () => {},
      onRemove: () => false,
      onEdit: () => {},
    }, options);
  }

  addContainer(classes: string) {
    if (!this.root) return;
    const el = document.createElement('div');
    for (const classname of classes.split(' ')) {
      el.classList.add(classname);
    }
    this.root.appendChild(el);
    return el;
  }

  update() {
    if (!this.selector) return;
    const mermaidNode = this.mermaidBlot.domNode;
    const mermaidRect = mermaidNode.getBoundingClientRect();
    const { x, y } = getRelativeRect(mermaidRect, this.quill.root);
    const { scrollTop, scrollLeft } = this.quill.root;
    Object.assign(this.selector.style, {
      left: `${x + scrollLeft}px`,
      top: `${y + scrollTop}px`,
      width: `${mermaidRect.width}px`,
      height: `${mermaidRect.height}px`,
    });
    clearScrollEvent.call(this);
    addScrollEvent.call(this, this.quill.root, () => {
      if (!this.selector) return;
      Object.assign(this.selector.style, {
        left: `${x + scrollLeft * 2 - this.quill.root.scrollLeft}px`,
        top: `${y + scrollTop * 2 - this.quill.root.scrollTop}px`,
      });
    });

    const header = this.selector.querySelector(`.${bem.be('select-header')}`);
    if (header) {
      header.classList.remove(bem.is('hidden'));
      if (this.mermaidBlot.mode !== 'edit') {
        header.classList.add(bem.is('hidden'));
      }
    }

    const editBtn = this.selector.querySelector(`.${bem.be('select-edit')}`);
    if (editBtn) {
      editBtn.classList.remove(bem.is('edit'));
      if (this.mermaidBlot.mode === 'edit') {
        editBtn.classList.add(bem.is('edit'));
      }
    }
  }

  createSelector() {
    this.selector = this.addContainer(bem.be('select'));
    if (!this.selector) return;

    const header = document.createElement('div');
    header.classList.add(bem.be('select-header'));
    if (this.mermaidBlot.mode !== 'edit') {
      header.classList.add(bem.is('hidden'));
    }
    const template = document.createElement('select');
    template.classList.add(bem.be('select-template'));
    const option = document.createElement('option');
    option.textContent = 'Template';
    option.setAttribute('hidden', 'true');
    option.setAttribute('selected', 'true');
    template.appendChild(option);
    template.setAttribute('placeholder', 'Template');
    for (const [key, value] of Object.entries(chartTemplate)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = key;
      template.appendChild(option);
    }
    template.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const value = target.value;
      if (value) {
        if (!this.mermaidBlot.textInput) return;
        this.mermaidBlot.textInput.record(this.mermaidBlot.textInput.el.value, [this.mermaidBlot.textInput.el.selectionStart, this.mermaidBlot.textInput.el.selectionEnd]);
        this.mermaidBlot.textInput.el.value = value;
        this.mermaidBlot.updatePreview(value);
      }
      target.selectedIndex = 0;
    });
    header.appendChild(template);
    this.selector.appendChild(header);

    const editBtn = createBtnIcon({
      iconStr: editSvg,
      classList: [bem.be('select-edit')],
      click: () => {
        if (this.mermaidBlot.mode === 'chart') {
          this.mermaidBlot.changeMode('edit');
        }
        else {
          this.mermaidBlot.changeMode('chart');
        }
        this.options.onEdit(this.mermaidBlot, this.mermaidBlot.mode === 'edit');
        this.update();
      },
    });
    const removeBtn = createBtnIcon({
      iconStr: closeSvg,
      classList: [bem.be('select-close')],
      click: async () => {
        if (await this.options.onRemove(this.mermaidBlot)) return;
        this.mermaidBlot.remove();
        this.#internalDestroy = true;
        this.destroy();
      },
    });

    this.selector.appendChild(removeBtn);
    this.selector.appendChild(editBtn);

    this.update();
    this.resizeOb = new ResizeObserver(() => {
      this.update();
    });
    this.resizeOb.observe(this.mermaidBlot.domNode);
  }

  destroy() {
    clearScrollEvent.call(this);
    if (this.resizeOb) {
      this.resizeOb.disconnect();
    }
    if (this.root) {
      this.root.remove();
    }
    if (this.#internalDestroy) {
      this.#internalDestroy = false;
    }
  }
}

function getRelativeRect(targetRect: DOMRect, container: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  return {
    x: targetRect.x - containerRect.x - container.scrollLeft,
    y: targetRect.y - containerRect.y - container.scrollTop,
    x1: targetRect.x - containerRect.x - container.scrollLeft + targetRect.width,
    y1: targetRect.y - containerRect.y - container.scrollTop + targetRect.height,
    width: targetRect.width,
    height: targetRect.height,
  };
}

function createBtnIcon(options: {
  iconStr: string;
  classList: string[];
  click: (e: MouseEvent) => void;
}) {
  const { iconStr, classList, click } = options;
  const btn = document.createElement('span');
  btn.classList.add(bem.be('select-btn'), ...classList);
  const icon = document.createElement('i');
  icon.classList.add(bem.be('icon'));
  icon.innerHTML = iconStr;
  btn.appendChild(icon);
  btn.addEventListener('click', click);
  return btn;
}

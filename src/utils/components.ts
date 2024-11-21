import closeSvg from '../svg/close.svg';

export const createLoading = (target: HTMLElement) => {
  const mask = document.createElement('div');
  mask.classList.add('qmc-loading-mask');
  const icon = document.createElement('div');
  icon.classList.add('qmc-loading-icon');
  mask.appendChild(icon);
  const close = () => {
    mask.remove();
  };
  target.appendChild(mask);
  return {
    close,
  };
};

export interface DialogOptions {
  content?: HTMLElement;
  appendTo?: HTMLElement;
  title?: string;
  description?: string;
  confirm?: boolean;
  cancel?: boolean;
  clickMaskClose?: boolean;
  onClose?: () => void;
  onShow?: () => void;
  onConfirm?: () => Promise<void> | void;
}
export const createDialog = (options?: DialogOptions) => {
  const {
    appendTo = document.body,
    title,
    description,
    content,
    confirm = true,
    cancel = true,
    clickMaskClose = true,
    onClose,
    onShow,
    onConfirm,
  } = options || {};
  const mask = document.createElement('div');
  mask.classList.add('qmc-mask');

  const dialog = document.createElement('div');
  dialog.classList.add('qmc-dialog');

  const close = () => {
    for (const item of [mask, dialog]) {
      item.classList.remove('open');
      item.classList.add('close');
      item.addEventListener('transitionend', () => {
        item.remove();
      }, { once: true });
    }
    // eslint-disable-next-line ts/no-use-before-define
    document.removeEventListener('keydown', keyboardClose);
    if (onClose) {
      onClose();
    }
  };
  const show = () => {
    appendTo.appendChild(mask);
    appendTo.appendChild(dialog);
    setTimeout(() => {
      mask.classList.add('open');
      dialog.classList.add('open');
      dialog.addEventListener('transitionend', () => {
        if (onShow) {
          onShow();
        }
      }, { once: true });
    });
  };

  if (title || description) {
    const header = document.createElement('div');
    header.classList.add('qmc-dialog-header');
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.classList.add('qmc-dialog-title');
      titleEl.textContent = title;
      header.appendChild(titleEl);
    }
    if (description) {
      const descriptionEl = document.createElement('p');
      descriptionEl.classList.add('qmc-dialog-description');
      descriptionEl.textContent = description;
      header.appendChild(descriptionEl);
    }
    dialog.appendChild(header);
  }

  if (content) {
    const contentEl = document.createElement('div');
    contentEl.classList.add('qmc-dialog-content');
    contentEl.appendChild(content);
    dialog.appendChild(contentEl);
  }

  if (confirm || cancel) {
    const footer = document.createElement('div');
    footer.classList.add('qmc-dialog-footer');
    if (cancel) {
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('qmc-dialog-btn', 'qmc-dialog-cancel');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => close());
      footer.appendChild(cancelBtn);
    }
    if (confirm) {
      const confirmBtn = document.createElement('button');
      confirmBtn.classList.add('qmc-dialog-btn', 'qmc-dialog-confirm');
      confirmBtn.textContent = 'Confirm';
      confirmBtn.addEventListener('click', async () => {
        if (onConfirm) {
          await onConfirm();
        }
        close();
      });
      footer.appendChild(confirmBtn);
    }
    dialog.appendChild(footer);
  }

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('qmc-dialog-btn', 'qmc-dialog-close');
  closeBtn.innerHTML = closeSvg;
  dialog.appendChild(closeBtn);
  const keyboardClose = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      close();
    }
  };
  const bindClose = () => {
    if (clickMaskClose) {
      mask.addEventListener('click', close);
    }
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', keyboardClose);
    dialog.addEventListener('click', e => e.stopPropagation());
    dialog.addEventListener('keydown', e => e.stopPropagation());
  };

  bindClose();
  show();

  return {
    mask,
    dialog,
    close,
  };
};

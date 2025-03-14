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

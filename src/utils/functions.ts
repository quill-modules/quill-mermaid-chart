export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}

export const handleIfTransitionend = (domNode: HTMLElement, duration: number, handler: () => void, options?: boolean | AddEventListenerOptions) => {
  domNode.addEventListener('transitionend', handler, options);
  // handle remove when transition set none
  setTimeout(() => {
    handler();
  }, duration);
};

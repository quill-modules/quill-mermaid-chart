const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
];
const HIDDEN_STYLE = `
    height:0 !important;
    visibility:hidden !important;
    overflow:hidden !important;
    position:absolute !important;
    z-index:-1000 !important;
    top:0 !important;
    right:0 !important;
`;
export const calcTextareaHeight = (targetElement: HTMLTextAreaElement) => {
  const style = getComputedStyle(targetElement);
  const boxSizing = style.getPropertyValue('box-sizing');
  const paddingSize
        = Number.parseFloat(style.getPropertyValue('padding-bottom'))
        + Number.parseFloat(style.getPropertyValue('padding-top'));
  const borderSize
        = Number.parseFloat(style.getPropertyValue('border-bottom-width'))
        + Number.parseFloat(style.getPropertyValue('border-top-width'));
  const contextStyle = CONTEXT_STYLE.map(name => `${name}:${style.getPropertyValue(name)}`).join(';');

  const hiddenTextarea = document.createElement('textarea');
  document.body.appendChild(hiddenTextarea);
  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

  let height = hiddenTextarea.scrollHeight;
  if (boxSizing === 'border-box') {
    height = height + borderSize;
  }
  else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }
  hiddenTextarea.value = '';
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
  let minHeight = singleRowHeight * 1;
  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);
  hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
  return {
    minHeight: `${minHeight}px`,
    height: `${height}px`,
  };
};

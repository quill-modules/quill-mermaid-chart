/* eslint-disable unicorn/prefer-number-properties */
import { toBase64 } from 'js-base64';

const getBase64SVG = (svg: HTMLElement, width?: number, height?: number): string => {
  if (svg) {
    svg = svg.cloneNode(true) as HTMLElement;
  }
  if (height) {
    svg.setAttribute('height', `${height}px`);
  }
  if (width) {
    svg.setAttribute('width', `${width}px`);
  }
  const svgString = svg.outerHTML
    .replaceAll('<br>', '<br/>')
    .replaceAll(/<img([^>]*)>/g, (m, g: string) => `<img ${g} />`);

  return toBase64(`${svgString}`);
};
export const svgStringToBase64 = (text: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const canvas: HTMLCanvasElement = document.createElement('canvas');

  const svg = doc.querySelector<HTMLElement>('svg');
  if (!svg) {
    throw new Error('svg not found');
  }
  let width = Number(svg.getAttribute('width'));
  let height = Number(svg.getAttribute('height'));
  if (isNaN(width)) {
    width = 0;
  }
  if (isNaN(height)) {
    height = 0;
  }
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('context not found');
  }
  context.fillStyle = `hsl(${window.getComputedStyle(document.body).getPropertyValue('--b1')})`;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return `data:image/svg+xml;base64,${getBase64SVG(svg, canvas.width, canvas.height)}`;
};

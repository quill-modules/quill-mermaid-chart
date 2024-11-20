export const svgStringToBase64 = (string: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/html');
  return `data:image/svg+xml;base64,${window.btoa(new XMLSerializer().serializeToString(doc.querySelector('svg')!))}`;
};

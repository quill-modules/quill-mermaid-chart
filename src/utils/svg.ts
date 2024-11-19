export const svgStringToBase64 = (string: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/html');
  return new XMLSerializer().serializeToString(doc.querySelector('svg')!);
};

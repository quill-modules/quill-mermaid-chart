export const isNumber = (val: any): val is number => typeof val === 'number';
export const isArray = Array.isArray;
export const ensureArray = (val: any) => isArray(val) ? val : [val];

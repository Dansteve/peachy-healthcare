import { stringify } from './json';

export const trace = (value: any): string => Number.isNaN(value) ? 'NaN' : stringify(value).unwrapOr(value);

export const kind = (value: any): string => {
  if (Number.isNaN(value)) {
    return 'NaN';
  }
  if (value === null) {
    return 'null';
  }
  if (value === void 0) {
    return 'undefined';
  }
  if (Array.isArray(value)) {
    return `arrays (${trace(value)})`;
  }
  return `${typeof value}s (${trace(value)})`;
};

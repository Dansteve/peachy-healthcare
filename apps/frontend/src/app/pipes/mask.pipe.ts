import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {
  transform(value: any, length: number = 3): string {
    console.log('length: ', length);
    const str = value.toString();
    if (!str) {
      return `***`;
    }
    return str.slice(0, length) + '***';
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lastString'
})
export class LastStringPipe implements PipeTransform {
    transform(value: any): string {
        const str = value.toString();
        return str.split(' ')[str.split(' ').length - 1];
    }
}

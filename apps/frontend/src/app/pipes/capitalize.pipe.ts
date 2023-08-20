import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalize'
})
export class CapWordPipe implements PipeTransform {
    transform(input: any): string {
        let value = input;
        if (!value) { return ''; }
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
}

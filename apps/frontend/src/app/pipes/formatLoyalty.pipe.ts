import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatLoyalty',
    pure: false
})
export class FormatLoyaltyPipe implements PipeTransform {
    transform(input: any): string {
        const value = input;
        if (!value) { return ''; }
        const valueArr = value.toString().split('');
        const parts = [];
        let part = '';
        const defBlock = 4;
        let block = defBlock;
        for (let i = 0; i < valueArr.length; i++) {
            part += valueArr[i];
            block -= 1;
            if (block === 0) {
                parts.push(part);
                part = '';
                block = defBlock;
            }
            if (part !== '' && i === valueArr.length - 1) {
                parts.push(part);
            }
        }
        return parts.join(' ');
    }
}

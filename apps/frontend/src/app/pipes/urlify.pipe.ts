import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlify'
})
export class UrlifyPipe implements PipeTransform {

  transform(text: any): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url: string) => `<a href="` + url + `">` + url + '</a>');
  }

}

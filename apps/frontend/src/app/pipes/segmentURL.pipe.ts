import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'segmentURL'
})
export class SegmentURLPipe implements PipeTransform {
  transform(text: any): string {
    // const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let word = text.replace(urlRegex, (url: string, b: any, c: string) => {
      const url2 = (c === 'www.') ? 'http://' + url : url;
      console.log(url);
      return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
    });

    word = word.replace(phoneRegex, (url: string, b: any, c: string) => {
      const url2 = 'tel://' + url;
      console.log(url);
      return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
    });

    return word;
  }
}


import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';
import _ from 'lodash';
import moment from 'moment-timezone';
import { environment } from '../../../environments/environment';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

interface TargetData {
  amount: string | number;
  tenor: number;
  roi: number;
  expectedPayout: number;
  expectedDate: string;
  earnings: number;
}

interface RecurrentData {
  amount: string | number;
  tenor: number;
  roi: number;
  expectedPayout: number;
  expectedDate: string;
  earnings: number;
  mthRoi: number;
  full: number;
}

interface ProjectTargetData {
  amount: string | number;
  roi: number;
  expectedPayout: number;
  expectedDate: string;
  earnings: number;
}

@Injectable({
  providedIn: 'root'
})

export class HelperMethodsService {

  readonly ALPHABET_ONLY = /[ a-zA-Z!@#$%^&*()_+{}|:;"<,>.~'`\\\/\?\=-\]\[\- ]/;
  readonly NUMBER_ONLY = /[0-9.,]/;
  readonly CURRENCY_REGEX = /(\d)(?=(\d{3})+(?!\d))/g;


  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  /**
   *
   *
   * @param param
   * @returns
   * @memberof ApiService
   */
  async isJson(param: any): Promise<boolean> {
    if (
      /^[\],:{}\s]*$/.test(
        param
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            ']'
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   *
   * @param param
   * @returns
   * @memberof ApiService
   */
  getUrlEncode(param: any): string {
    return Object.keys(param)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(param[k]))
      .join('&');
  }

  /**
   *
   *
   * @param milliseconds
   * @returns
   * @memberof ApiService
   */
  sleep(milliseconds: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   *
   *
   * @param promise
   * @param [ms=20000]
   * @returns
   * @memberof ApiService
   */
  promiseTimeout(promise: Promise<any>, ms = 40000): Promise<any> {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        const error = {
          code: 1,
          result: 'error',
          error: 'Timeout',
          message: 'We are unable to perform the operation now. Kindly check your internet connection and try again later...'
        };
        reject(error);
      }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
  }

  /**
   *
   *
   * @returns
   * @memberof ApiService
   */
  getGreeting(): string {
    const hrs = new Date().getHours();
    let greet = 'Welcome!';
    if (hrs > 1 && hrs < 6) {
      greet = 'You should be in bed';
    }
    if (hrs >= 6 && hrs < 12) {
      greet = 'Good Morning';
    }
    if (hrs === 12) {
      greet = 'Time for some lunch!';
    }
    if (hrs > 12 && hrs < 17) {
      greet = 'Good Afternoon';
    }
    if (hrs === 17) {
      greet = 'Time for some dinner!';
    }
    if (hrs > 17 && hrs <= 24) {
      greet = 'Good Evening';
    }
    return greet;
  }

  /**
   *
   *
   * @param xs
   * @param key
   * @returns
   * @memberof ApiService
   */
  groupBy(xs: Array<any>, key: string): any {
    return xs.reduce((rv, x, index) => {
      // console.log(index);
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

  }

  /**
   *
   *
   * @param xs
   * @param key
   * @returns
   * @memberof ApiService
   */
  groupByDate(xs: Array<any>, key: string): any {
    return xs.reduce((rv, x) => {
      (rv[moment(x[key]).format('MMM YYYY')] = rv[moment(x[key]).format('MMM YYYY')] || []).push(x);
      return rv;
    }, {});
    // }, []);
  }

  /**
   *
   * @param dataToGroupOn
   * @param fieldNameToGroupOn
   * @param [fieldNameForGroupName='key']
   * @param [fieldNameForChildren='value']
   * @returns
   * @memberof ApiService
   */
  fullGroupBy(
    dataToGroupOn: Array<any>,
    fieldNameToGroupOn: string,
    fieldNameForGroupName = 'key',
    fieldNameForChildren = 'value') {
    const result = _.chain(dataToGroupOn)
      .groupBy(fieldNameToGroupOn)
      .toPairs()
      .map((currentItem: any) => _.zipObject([fieldNameForGroupName, fieldNameForChildren], currentItem))
      .value();
    return result;
  }

  /**
   *
   * @param dataToGroupOn
   * @param fieldNameToGroupOn
   * @param [fieldNameForGroupName='key']
   * @param [fieldNameForChildren='value']
   * @returns
   * @memberof ApiService
   */
  fullGroupByDate(
    dataToGroupOn: Array<any>,
    fieldNameToGroupOn: string,
    keyFormat = 'MMM YYYY',
    fieldNameForGroupName = 'key',
    fieldNameForChildren = 'value') {
    const result = _.chain(dataToGroupOn)
      .map((n: any) => {
        n['_' + fieldNameToGroupOn] = moment(n[fieldNameToGroupOn]).format(keyFormat);
        // console.log(n[fieldNameToGroupOn]);
        // console.log(n);
        return n;
      })
      .groupBy('_' + fieldNameToGroupOn)
      .toPairs()
      .map((currentItem: any) => _.zipObject([fieldNameForGroupName, fieldNameForChildren], currentItem))
      .value();
    return result;
  }



  /**
   *
   *
   * @param data
   * @param [format='YYYY-MM-DD']
   * @returns
   * @memberof HelperMethodsService
   */
  getDateformat(dateString: any = {}, format = 'YYYY-MM-DD'): string {
    return moment(dateString).format(format);
  }

  /**
   *
   *
   * @param data
   * @param [format='YYYY-MM-DD']
   * @returns
   * @memberof HelperMethodsService
   */
  getTodayDate(format = 'YYYY-MM-DD'): string {
    return moment({}).format(format);
  }

  /**
   *
   *
   * @param dateString
   * @param [format='YYYY-MM-DD']
   * @returns
   * @memberof HelperMethodsService
   */
  convertApiDateToMoment(dateString: string, format = 'YYYY-MM-DD'): moment.Moment {
    let returnDate = moment().tz('Africa/Lagos');
    if (moment(dateString, format).isValid()) {
      returnDate = moment(dateString, format);
    } else if (moment(dateString).isValid()) {
      returnDate = moment(dateString);
    } else {
      returnDate = moment(dateString, format);
    }
    return returnDate;
  }

  /**
   *
   *
   * @param fromString
   * @param toString
   * @param [format='days']
   * @returns
   * @memberof HelperMethodsService
   */
  getDateDiff(fromString: string, toString: string, format: moment.unitOfTime.Diff = 'days'): number {
    const a = moment(fromString);
    const b = moment(toString);
    const returnDate = b.diff(a, format, true);
    return returnDate >= 0 ? returnDate : 0;
  }

  /**
   *
   *
   * @param fromString
   * @param amount
   * @param [unit='days']
   * @param [format='YYYY-MM-DD']
   * @returns
   * @memberof HelperMethodsService
   */
  getDateAdd(fromString: string, amount: number, unit: moment.unitOfTime.Diff = 'days', format = 'YYYY-MM-DD'): string {
    return moment(fromString).add(amount, unit).format(format);
  }

  /**
   *
   *
   * @param fromString
   * @param amount
   * @param [unit='days']
   * @param [format='YYYY-MM-DD']
   * @returns
   * @memberof HelperMethodsService
   */
  getDateSubtract(fromString: string, amount: number, unit: moment.unitOfTime.Diff = 'days', format = 'YYYY-MM-DD'): string {
    return moment(fromString).subtract(amount, unit).format(format);
  }

  /**
   *
   *
   * @param of
   * @param from
   * @returns
   * @memberof HelperMethodsService
   */
  getPercent(of: number, from: number): number {
    let per = 100;
    if (of > from) {
      per = 100;
    } else if (from === 0) {
      per = 100;
    } else {
      per = (of / from) * 100;
    }
    per = parseFloat(per.toFixed(1));
    return Math.abs(per);
  }

  /**
   *
   *
   * @param res
   * @returns
   * @memberof HelperMethodsService
   */
  async getCompletionDateRange(res: any) {
    res.data.forEach((element: any) => {
      const SD = this.convertApiDateToMoment(element.startDate || element.startDate, 'Do MMM. YYYY').format('YYYY-MM-DD');
      const ED = this.convertApiDateToMoment(element.endDate || element.endDate, 'Do MMM. YYYY').format('YYYY-MM-DD');
      const TD = this.getTodayDate();
      const fromDiff = this.getDateDiff(SD, ED);
      const toDiff = this.getDateDiff(SD, TD);
      // console.log(toDiff, fromDiff, toDiff / fromDiff);
      element.fromDiff = fromDiff;
      element.toDiff = toDiff;
      if (element.status && element.status !== 'Paid') {
        element.range =
          (element.status.toLocaleLowerCase() === 'active' ||
            element.status.toLocaleLowerCase() === 'locked') ? this.getPercent(toDiff, fromDiff) : 100;
        element.remaining = 100 - element.range;
      } else {
        element.range = this.getPercent(toDiff, fromDiff);
        element.remaining = 100 - element.range;
      }
    });
    return res;
  }

  /**
   *
   *
   * @param of
   * @param from
   * @returns
   * @memberof HelperMethodsService
   */
  getCompletionRange(of: string, from: string, status = ''): number {
    const a = parseFloat(of.split(',').join(''));
    const b = parseFloat(from.split(',').join(''));
    let per = 100;
    if (a > b) {
      per = 100;
    } else if (b === 0) {
      per = 100;
    } else {
      per = (a / b) * 100;
    }
    per = parseFloat(per.toFixed(1));
    console.log(status);
    return (status.toLocaleLowerCase() === 'active' || status.toLocaleLowerCase() === 'locked') ? Math.abs(per) : 0;
  }

  /**
   *
   *
   * @param amount
   * @param tenor
   * @returns
   * @memberof HelperMethodsService
   */
  async targetInfo(amount: string | number, tenor: number, roiData: number): Promise<TargetData> {
    const data = { amount, tenor, roi: 0, expectedPayout: 0, earnings: 0, expectedDate: '', startDate: '' };
    if (roiData) {
      data.roi = roiData;
      data.earnings = (data.roi / 100) * parseFloat(amount.toString().split(',').join(''));
      data.expectedPayout = parseFloat(amount.toString().split(',').join('')) + data.earnings;
      data.startDate = moment().tz('Africa/Lagos').format('Do MMM. YYYY');
      data.expectedDate = this.getDateAdd(moment().tz('Africa/Lagos').format(), tenor, 'days', 'Do MMM. YYYY');
    }
    // console.log(data);
    return data;
  }

  /**
   *
   *
   * @param amount
   * @param tenor
   * @param roi
   * @returns
   * @memberof HelperMethodsService
   */
  async projectSponsorship(amount: string | number, tenor: number, roi: number): Promise<ProjectTargetData> {
    const data = { amount, roi, expectedPayout: 0, earnings: 0, tenor, expectedDate: '', startDate: '' };
    data.earnings = (data.roi / 100) * parseFloat(amount.toString().split(',').join(''));
    data.expectedPayout = parseFloat(amount.toString().split(',').join('')) + data.earnings;
    data.startDate = moment().tz('Africa/Lagos').format('Do MMM. YYYY');
    data.expectedDate = this.getDateAdd(moment().tz('Africa/Lagos').format(), tenor, 'months', 'Do MMM. YYYY');
    return data;
  }

  /**
   *
   *
   * @param amount
   * @param tenor
   * @returns
   * @memberof HelperMethodsService
   */
  async getSavingsRio(amount: string | number, tenor: number, roiData: Array<any>, bandName: string): Promise<RecurrentData> {
    const data = { amount, tenor, roi: 0, mthRoi: 0, expectedPayout: 0, earnings: 0, expectedDate: '', full: 0, dayRoi: 0 };
    roiData.forEach(element => {
      if (bandName.toLowerCase() === element.bandName.toLowerCase()) {
        data.roi = element.roi;
      }
    });

    data.dayRoi = data.roi / 100 / 365;
    data.mthRoi = data.dayRoi * tenor;
    data.full = (parseFloat(amount.toString())) + (data.mthRoi * parseFloat(amount.toString().split(',').join('')));
    data.earnings = (data.mthRoi * parseFloat(amount.toString().split(',').join('')));
    data.expectedPayout = parseFloat(amount.toString().split(',').join('')) + data.earnings;
    // data.startDate = moment().tz('Africa/Lagos').format('Do MMM. YYYY');
    data.expectedDate = this.getDateAdd(moment().tz('Africa/Lagos').format(), tenor, 'months', 'Do MMM. YYYY');
    // console.log(data);
    return data;
  }

  /**
   *
   *
   * @param username
   * @returns
   * @memberof HelperMethodsService
   */
  emailMask(username: string): string {
    console.log(username);
    if (username !== null || username !== undefined) {
      const maskedEmail = username ? username.replace(/([^@\.])/g, '*').split('') : [''];
      // console.log(maskedEmail);
      let previous = '';
      for (let i = 0; i < maskedEmail.length; i++) {
        if (i <= 2 || previous === '.' || previous === '@') {
          maskedEmail[i] = username ? username[i] : '';
        }
        previous = username ? username[i] : '';
      }
      // console.log(maskedEmail.join(''));
      return maskedEmail.join('');
    } else {
      return '';
    }
  }

  /**
   *
   *
   * @param a
   * @returns
   * @memberof HelperMethodsService
   */
  payStackCharge(input: any): number {
    const cap = 2000;
    const rate = 0.015;
    const flat_rate = 100;
    const a = parseFloat(input.toString().split(',').join(''));
    let charge: number;
    if (a < 2500) {
      charge = ((a) / (1 - rate)) - a;
    } else {
      charge = ((a + flat_rate) / (1 - rate)) - a;
    }
    if (charge > 2000) {
      charge = cap;
    }
    return parseFloat(charge.toFixed(2));
  }


  public blobToFile(theBlob: Blob, fileName: string, type = ''): File {
    const file = new File([theBlob], fileName, { lastModified: new Date().getTime(), type });
    return file;
  }

  async compressImage(imageFile: any) {
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      return compressedFile;
    } catch (error: any) {
      console.log(error.message);
      return imageFile;
    }
  }

  b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async resolveBase64(file: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (typeof (file) === 'string') {
        resolve(file);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = error => {
          const err = 'Error: ' + error;
          reject(err);
        };
      }
    });
  }

  formatAmount(amount: string, prefix = '£') {
    const x = parseFloat(amount.split(',').join(''));
    return prefix + new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(x);
  }

  /**
   * Get Modal Dynamic Only Center Style
   */
  getModalCenterOnlyStyle(dynamicHeight: string | number = '50', isFixedHeight = false) {
    return `customModal-center-${dynamicHeight}` + `${isFixedHeight ? '-fixed' : ''}`;
  }

  /**
   * Get Modal Dynamic Center Style
   */
  getModalDynamicCenterStyle(width: number, dynamicHeight: string | number = '50', isFixedHeight = false) {
    if (width <= 568) {
      return `customModal-${dynamicHeight}`;
    } else {
      return `customModal-center-${dynamicHeight}` + `${isFixedHeight ? '-fixed' : ''}`;
    }
  }

  getModalStyle2(width: number) {
    if (width <= 568) {
      return 'customModal4';
    } else if (width >= 568 && width <= 1024) {
      return 'customModal-full';
    } else {
      return 'customModal-web';
    }
  }

  getModalStyle(width: number) {
    if (width <= 768) {
      return 'customModal-full';
    } else {
      return 'customModal-web';
    }
  }

  getModalCenterStyle(width: number, dynamicHeight: string | number = '50') {
    if (width <= 568) {
      return `customModal-${dynamicHeight}`;
    } else if (width >= 568 && width <= 1024) {
      return 'customModal-full';
    } else {
      return 'customModal-web';
    }
  }

  getModalDynamicStyle(width: number, dynamicHeight: string | number = '50') {
    if (width <= 568) {
      return `customModal-${dynamicHeight}`;
    } else if (width >= 568 && width <= 1024) {
      return 'customModal-full';
    } else {
      return 'customModal-web';
    }
  }

  getModalStyleFull(width: number) {
    if (width <= 768) {
      return 'customModal-full';
    } else {
      return 'customModal-web';
    }
  }

  getModalStyle3(width: number) {
    if (width <= 568) {
      return 'customModal-half';
    } else {
      return 'customModal-web';
    }
  }

  getStatData(res: string | number = 0) {
    if (res === '0') {
      res = '0.00';
    }
    res = (res + '').split(',').join('');
    return ({
      value: parseInt(res ? (res + '').split('.')[0] : '0', 10),
      decimal: res && (res + '').split('.')[1] ? (res + '').split('.')[1] : '00',
      raw: res
    });
  }

  cleanObjectData(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj;
  }

  /**
   * It takes an object and returns a string that can be used as a URL parameter
   *
   * @param obj - The object that you want to convert to a URL parameter string.
   * @returns A string of the object's key and value pairs.
   */
  convertJsonToUrlParam(obj: Record<string, any>) {
    const cleanedObj = this.cleanObjectData(obj);
    let str = '';
    for (const key in cleanedObj) {
      if (str !== '') {
        str += '&';
      }
      str += key + '=' + encodeURIComponent(cleanedObj[key]);
    }
    return str;
  }

  getToday() {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  async checkIfImageExist(url: string) {
    let isValid = false;
    try {
      const data = await fetch(`${url}`);
      isValid = data.ok;
      return isValid;
    } catch (err) {
      // console.log(err);
      isValid = false;
      return isValid;
    }
  }

  async getSanitizeImageUrl(url: string) {
    let validURL: any = environment.defaultImageUrl;
    await this.checkIfImageExist(url).then((data) => {
      validURL = data ? this.sanitizer.bypassSecurityTrustUrl(`${url}`) : environment.defaultImageUrl;
    }).catch(() => {
      validURL = environment.defaultImageUrl;
    });
    return validURL;
  }

  async getExternalImage(link: any, defaultImageUrl?: string) {
    let validURL = '';
    if (link !== null) {
      await this.getSanitizeImageUrl(link).then((data) => {
        validURL = data;
      }).catch(() => {
        validURL = defaultImageUrl || environment.defaultImageUrl;
      });
    } else {
      validURL = defaultImageUrl || environment.defaultImageUrl;
    }
    return validURL;
  }

  regexValidator(regexPattern: RegExp, value: string) {
    return regexPattern.test(value);
  }


  convertArrayToString(array: string | Array<string>, separator = ','): string {
    return Array.isArray(array) ? array.join(separator) : array;
  }

}

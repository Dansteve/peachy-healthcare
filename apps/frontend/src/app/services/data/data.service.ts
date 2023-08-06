// tslint:disable: no-redundant-jsdoc
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any = [];

  constructor() { }

  /**
   *
   *
   * @param {(string | number)} id
   * @param {*} data
   * @memberof DataService
   */
  setData(id: string | number, data: any): void {
    this.data[id] = data;
  }

  /**
   *
   *
   * @param {(string | number)} id
   * @returns {*}
   * @memberof DataService
   */
  getData(id: string | number): any {
    return this.data[id];
  }
}

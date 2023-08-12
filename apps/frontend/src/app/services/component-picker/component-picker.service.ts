/* eslint-disable max-len */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentPickerService {

  componentsList: Array<any | never> = [
  ];

  componentsListName: Array<any> = [];
  constructor() {
    this.componentsList.forEach((x: any) => {
      this.componentsListName.push((x?.prototype?.getClassName()));
    });
  }

  getComponent(componentName = '') {
    componentName = componentName.includes('Component') ? componentName : componentName + 'Component';
    let component = null;
    const index = this.componentsListName.findIndex(x => x === componentName);
    if (index !== -1) {
      component = this.componentsList[index];
    }
    return component;
  }

}

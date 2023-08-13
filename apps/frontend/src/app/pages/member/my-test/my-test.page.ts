import { Component } from '@angular/core';

@Component({
  selector: 'peachy-healthcare-my-test',
  templateUrl: './my-test.page.html',
  styleUrls: ['./my-test.page.scss'],
})
export class MyTestPage {
  constructor() { }

  /**
   * Get class name
   */
  getClassName() {
    return 'MyTestPage';
  }
}

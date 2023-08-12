import { Component } from '@angular/core';

@Component({
  selector: 'peachy-healthcare-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  constructor() {}

  /**
   * Get class name
   */
  getClassName() {
    return 'DashboardPage';
  }
}

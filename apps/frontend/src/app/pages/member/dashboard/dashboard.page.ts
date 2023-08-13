import { Component } from '@angular/core';

@Component({
  selector: 'peachy-healthcare-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {


  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };

  today = new Date().toISOString();

  constructor() {}

  /**
   * Get class name
   */
  getClassName() {
    return 'DashboardPage';
  }

}

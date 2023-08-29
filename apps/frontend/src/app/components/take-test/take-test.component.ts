import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'peachy-healthcare-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss'],
})
export class TakeTestComponent {

  constructor(// tslint:disable: align
    public modalController: ModalController
  ) { }

  /**
   * Dismiss Modal
   */
  dismissModal() {
    this.modalController.dismiss({
      dismissed: true
    }).then((data) => {
      // console.log(data);
    }).catch((err) => console.log(err));
  }
}

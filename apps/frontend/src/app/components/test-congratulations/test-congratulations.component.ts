import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'peachy-healthcare-test-congratulations',
  templateUrl: './test-congratulations.component.html',
  styleUrls: ['./test-congratulations.component.scss'],
})
export class TestCongratulationsComponent {

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

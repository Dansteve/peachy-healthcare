import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api/api.service';
import { HelperMethodsService } from '../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss'],
})
export class GenericHeaderComponent {

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  isLoading = false;

  constructor(
    public screenSizeService: ScreenSizeService,
    public navController: NavController,
    public router: Router,
    public apiService: ApiService,
    public helperMethods: HelperMethodsService,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }


  goTo(page = '') {
    const link = `/public/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }


  goToMember(page = '') {
    const link = `/member/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }

  /**
   * Logout
   */
  async logout() {
    const alert = await this.alertController.create({
      message: 'Do you want to logout?',
      mode: 'ios',
      cssClass: 'my-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes, Logout',
          cssClass: 'danger',
          handler: () => {
            this.apiService
              .logout()
              .then(() => {
                this.navController.navigateRoot('login');
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }
}

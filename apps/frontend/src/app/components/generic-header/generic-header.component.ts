import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiErrorResponse, GenericApiResponse, User } from '@peachy-healthcare/app-interface';
import { v4 as NEW_UUID } from 'uuid';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api/api.service';
import { HelperMethodsService } from '../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../services/screen-size/screen-size.service';

@Component({
  selector: 'peachy-healthcare-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss'],
})
export class GenericHeaderComponent implements OnInit {

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  isLoading = false;
  currentUser: User = {} as User;
  copied = false;
  uuid = NEW_UUID();

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

  ngOnInit() {
    this.apiService.getAuthenticatedUser().then((user: User) => {
      this.currentUser = user;
      console.log(this.currentUser);
    }).catch((error: ApiErrorResponse) => {
      console.log(error);
    });
    this.getProfile();
  }

  ionViewDidEnter() {
    this.apiService.getAuthenticatedUser().then((user: User) => {
      this.currentUser = user;
      console.log(this.currentUser);
    }).catch((error: ApiErrorResponse) => {
      console.log(error);
    });
    this.getProfile();
  }

  getProfile() {
    this.helperMethods.promiseTimeout(this.apiService.getProfile())
      .then(async (res: GenericApiResponse<User>) => {
        this.currentUser = res.data;
        this.apiService.setAuthenticatedUser(this.currentUser);
      }).catch((err: ApiErrorResponse) => {
        console.log(err);
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
                this.navController.navigateRoot('public/login');
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

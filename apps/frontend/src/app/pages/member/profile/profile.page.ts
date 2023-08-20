import { Component, OnInit, } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiErrorResponse, GenericApiResponse, User } from '@peachy-healthcare/app-interface';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  isLoading = false;
  currentUser: User = {} as User;
  copied = false;

  constructor(
    public screenSizeService: ScreenSizeService,
    public navController: NavController,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public helperMethods: HelperMethodsService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }


  ngOnInit() {
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

  requestToDeleteMyAccount() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.apiService.successToast('Your request has been sent to the admin. We will get back to you soon.');
      // this.goTo('login');
    }, 2000);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiErrorResponse, AuthenticatedToken, GenericApiResponse, LoginPayload } from '@peachy-healthcare/app-interface';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { FormValidatorService } from '../../../services/form-validator/form-validator.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  userLoginForm!: FormGroup;
  user: LoginPayload = {
    username: environment.production ? '' : 'dansteve.adekanbi@mail.bcu.ac.uk',//'danstevea@gmail.com',
    password: environment.production ? '' : 'password',// 'password',
    rememberMe: false
  };
  showPassword = false;
  isLoading = false;

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;

  constructor(
    public screenSizeService: ScreenSizeService,
    public navController: NavController,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public helperMethods: HelperMethodsService
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  ngOnInit() {
    this.userLoginForm = this.formBuilder.group({
      username: new FormControl<string | null>(environment.production ? '' : 'dansteve.adekanbi@mail.bcu.ac.uk', {
        validators: Validators.compose([Validators.required, Validators.email, FormValidatorService.emailValidator])
      }),
      password: new FormControl<string | null>(environment.production ? '' : 'password', {
        validators: Validators.compose([Validators.required, Validators.minLength(6)])
      }),
    });
  }

  ionViewDidEnter() {
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


    async login() {
    this.isLoading = true;
    // const loading = await this.apiService.getLoader();
    // await loading.present();
    const loginDetails = this.userLoginForm.value;
    this.helperMethods.promiseTimeout(this.apiService.login(loginDetails))
      .then(async (res: GenericApiResponse<AuthenticatedToken>) => {
      this.isLoading = false;
        // await loading.dismiss();
        if (res.data === null) {
          return this.apiService.errorToast(res.message);
        }

        const storeToken = await this.storeAuthenticatedLocalData(res);
        if (storeToken) {
          const dashboardLink = `/member/dashboard`;
          this.navController.navigateRoot(dashboardLink);
        } else {
          const message = 'Something went wrong. Please try again later.';
          this.apiService.errorToast(message);
        }

        return
      })
      .catch(async (err: ApiErrorResponse): Promise<void> => {
        this.apiService.errorAlert(err.message);
        this.isLoading = false;
        // await loading.dismiss();
      });
  }


  async storeAuthenticatedLocalData(res: GenericApiResponse<AuthenticatedToken>) {
    const authenticatedToken: AuthenticatedToken = { ...(res?.data as AuthenticatedToken) };
    console.log(authenticatedToken);
    await this.apiService.setAuthenticatedToken(authenticatedToken);
    await this.apiService.setAuthenticatedPersistentUser(authenticatedToken);
    await this.apiService.setAuthenticatedUser(authenticatedToken.user);
    return authenticatedToken.token;
  }
}

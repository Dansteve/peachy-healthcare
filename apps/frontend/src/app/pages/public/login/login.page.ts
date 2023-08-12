import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoginPayload } from '@peachy-healthcare/app-interface';
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
    username: '',//'danstevea@gmail.com',
    password: '',// 'password',
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
      username: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.email, FormValidatorService.emailValidator])
      }),
      password: new FormControl<string | null>('', {
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


  login() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.goToMember('dashboard');
    }, 2000);
  }

}

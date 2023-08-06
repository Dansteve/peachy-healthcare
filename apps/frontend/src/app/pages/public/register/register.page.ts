import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SignUpPayload } from '@peachy-healthcare/app-interface';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { FormValidatorService } from '../../../services/form-validator/form-validator.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userRegistrationForm!: FormGroup;
  user: SignUpPayload = {
    username: '',//'danstevea@gmail.com',
    password: '',// 'password',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };
  showPassword = false;

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
    this.userRegistrationForm = this.formBuilder.group({
      firstName: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])
      }),
      lastName: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])
      }),
      age: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required])
      }),
      phoneNumber: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
      }),
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

  register() { }
}

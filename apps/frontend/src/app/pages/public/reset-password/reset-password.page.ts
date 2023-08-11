import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ResetPasswordPayload } from '@peachy-healthcare/app-interface';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { FormValidatorService } from '../../../services/form-validator/form-validator.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm!: FormGroup;
  user: ResetPasswordPayload = {
    password: '',// 'password',
    confirmPassword: '',// 'password',
    resetId: '' // 'password',
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
    public helperMethods: HelperMethodsService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(6)])
      }),
      confirmPassword: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(6)])
      }),
    }, { validators: FormValidatorService.passwordMatchValidator('password', 'confirmPassword') });
  }

  ionViewDidEnter() {
    // get resetId from  url params
    this.user.resetId = this.activatedRoute.snapshot.params['resetId'] || '';
    console.log('resetId', this.user.resetId);
  }

  goTo(page = '') {
    const link = `/public/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }

  resetPassword() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.apiService.successToast('Password reset successfully');
      this.goTo('login');
    }, 2000);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiErrorResponse, AuthenticatedToken, GenericApiResponse, SignUpPayload } from '@peachy-healthcare/app-interface';
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
  userAddressForm!: FormGroup;
  user: SignUpPayload = {
    username: '',//'danstevea@gmail.com',
    password: '',// 'password',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: {
      search: '',
      postcode: '',
      county: '',
      line_1: '',
      line_2: '',
      town_or_city: '',
    }
  };
  isLoading = false;
  showPassword = false;
  stage = 1;
  showSuggestions = false;
  suggestions = [
    {
      "address": "40 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/Mjc4YTg4NDkwZGJiNmRiIDI4NDExOTEzIDgzZjNjMWExMDdlZTgxYg==",
      "id": "Mjc4YTg4NDkwZGJiNmRiIDI4NDExOTEzIDgzZjNjMWExMDdlZTgxYg=="
    },
    {
      "address": "42 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/ZjgzOGFkMjYyYWE5ZWQzIDI4NDExOTE0IDgzZjNjMWExMDdlZTgxYg==",
      "id": "ZjgzOGFkMjYyYWE5ZWQzIDI4NDExOTE0IDgzZjNjMWExMDdlZTgxYg=="
    },
    {
      "address": "44 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/ZDU2ZDE2MWYwODk0ZjRhIDI4NDExOTE1IDgzZjNjMWExMDdlZTgxYg==",
      "id": "ZDU2ZDE2MWYwODk0ZjRhIDI4NDExOTE1IDgzZjNjMWExMDdlZTgxYg=="
    },
    {
      "address": "46 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/Yjg5YjEzZTI5ZjNjYmQ2IDI4NDExOTE2IDgzZjNjMWExMDdlZTgxYg==",
      "id": "Yjg5YjEzZTI5ZjNjYmQ2IDI4NDExOTE2IDgzZjNjMWExMDdlZTgxYg=="
    },
    {
      "address": "48 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/OWQyMmVhNDY5OGI3ZmFiIDI4NDExOTE3IDgzZjNjMWExMDdlZTgxYg==",
      "id": "OWQyMmVhNDY5OGI3ZmFiIDI4NDExOTE3IDgzZjNjMWExMDdlZTgxYg=="
    },
    {
      "address": "54 Highfield Road, Saltley, Birmingham, West Midlands",
      "url": "/get/ZjBiMjc1MTVhMGEwNDAwIDI4NDExOTE4IDgzZjNjMWExMDdlZTgxYg==",
      "id": "ZjBiMjc1MTVhMGEwNDAwIDI4NDExOTE4IDgzZjNjMWExMDdlZTgxYg=="
    }
  ];

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
    if (this.stage == 1) {
      this.setUpRegistrationForm();
    }

    if (this.stage == 2) {
      this.setUpAddressForm();
    }

  }

  setUpRegistrationForm() {
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
        validators: Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])
      }),
      username: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.email, FormValidatorService.emailValidator])
      }),
      password: new FormControl<string | null>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(6)])
      }),
    });
  }


  setUpAddressForm() {
    this.userAddressForm = this.formBuilder.group({
      search: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.minLength(2), Validators.maxLength(30)])
      }),
      postcode: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
      }),
      line_1: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
      }),
      line_2: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.minLength(2), Validators.maxLength(30)])
      }),
      town_or_city: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
      }),
      county: new FormControl<string | null | undefined>('', {
        validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
      }),
    });

    // on value change of postcode call a suggestion api to get suggestions
    this.userAddressForm.get('search')?.valueChanges.subscribe(async (value) => {
      if (value.length > 4) {
        // add bounce to the api call
        await this.helperMethods.promiseTimeout(this.apiService.getAddressSuggestions(value)).then((res) => {
          console.log(res);
          this.suggestions = res.suggestions;
          this.showSuggestions = true;
        });
      }
    });
  }

  ionViewDidEnter() {
  }

  changeStage(stage: 1 | 2) {
    this.stage = stage;
    if (stage == 1) {
      this.setUpRegistrationForm();
    }
    if (stage == 2) {
      this.setUpAddressForm();
    }
  }

  goTo(page = '') {
    const link = `/public/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }

  goBack() {
    if (this.stage == 1) {
      this.navController.back({ animated: false});
    }
    if (this.stage == 2) {
      this.changeStage(1);
    }
  }

  async register() {
    // const loading = await this.apiService.getLoader();
    // await loading.present();
    this.isLoading = true;
    const registrationDetails = this.userRegistrationForm.value;
    this.helperMethods.promiseTimeout(this.apiService.register(registrationDetails))
      .then(async (res: GenericApiResponse<AuthenticatedToken>) => {
        // await loading.dismiss(); 
      this.isLoading = false;
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

        return;
        // await loading.dismiss(); 
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


  async selectAddress(suggestion: any) {
    this.showSuggestions = false;
    await this.helperMethods.promiseTimeout(this.apiService.getAddressInfo(suggestion?.id)).then((res) => {
      console.log(res);
      // this.suggestions = res.suggestions
      //       {
      //     "postcode": "B8 3QU",
      //     "latitude": 52.4904132,
      //     "longitude": -1.8510468,
      //     "formatted_address": [
      //         "40 Highfield Road",
      //         "",
      //         "",
      //         "Saltley, Birmingham",
      //         "West Midlands"
      //     ],
      //     "thoroughfare": "Highfield Road",
      //     "building_name": "",
      //     "sub_building_name": "",
      //     "sub_building_number": "",
      //     "building_number": "40",
      //     "line_1": "40 Highfield Road",
      //     "line_2": "",
      //     "line_3": "",
      //     "line_4": "",
      //     "locality": "Saltley",
      //     "town_or_city": "Birmingham",
      //     "county": "West Midlands",
      //     "district": "Birmingham",
      //     "country": "England",
      //     "residential": true
      // }
      this.user.address = res;
      this.user.address.search = '';
    });
  }
}

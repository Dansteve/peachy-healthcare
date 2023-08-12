import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonModal, ModalController, NavController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DynamicComponent } from '../../../interface/main-interface';
import { ApiService } from '../../../services/api/api.service';
import { ComponentPickerService } from '../../../services/component-picker/component-picker.service';
import { CryptoService } from '../../../services/crypto/crypto.service';
import { DataService } from '../../../services/data/data.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';

@Component({
  selector: 'peachy-healthcare-smart-menu',
  templateUrl: './smart-menu.page.html',
  styleUrls: ['./smart-menu.page.scss'],
})
export class SmartMenuPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  isDesktop = false;
  currentUrl = 'home';
  oldCurrentUrl = '';
  currentRootUrl = 'home';

  photo: any = {
    picBase64: null,
  };
  enableShowBalance: boolean;
  isPwa: boolean;
  currentUserData: any;

  iconOnly = false;
  isDarkMode: boolean;
  isAuthenticated = false;

  isPostOpen = false;


  constructor(
    private router: Router,
    public navController: NavController,
    private dataService: DataService,
    public screenSizeService: ScreenSizeService,
    public componentPickerService: ComponentPickerService,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public cryptoService: CryptoService,
    private helperMethods: HelperMethodsService,
    private api: ApiService,
    public alertController: AlertController
  ) {
    this.screenSizeService.isDesktop.subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        // window.location.reload();
      }
      // this.ref.detectChanges();
      this.isDesktop = isDesktop;
    });
    this.screenSizeService.widthSize.subscribe((widthSize) => {
      if (widthSize < 1320) {
        // this.iconOnly = true;
        this.iconOnly = false;
      } else {
        this.iconOnly = false;
      }
    });
    // console.log(this.router.url);
    if (this.router.url) {
      this.currentUrl = this.getActiveTab(this.router.url);
      // console.log(this.currentUrl);
    }
    this.api.enableDarkMode.subscribe((data) => {
      this.isDarkMode = data;
    });
    this.platform.ready().then(() => {
      console.log('Core service init');
    });
    this.checkAuth();
  }

  get fullName() {
    return `${this.currentUserData?.firstname.trim()} ${this.currentUserData?.lastname.trim()}`;
  }

  get isPlatformAndroid() {
    return this.platform.is('android');
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log('Confirm');
    }
    this.isPostOpen = false;
  }

  togglePostModal() {
    this.isPostOpen = !this.isPostOpen;
  }


  /**
   * HostListener
   * On Orientation Change
   */
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.screenSizeService.onResize(
      event.target.innerWidth,
      event.target.innerHeight
    );
  }

  ionViewDidEnter() {
    this.checkDynamicComponent();
  }

  async checkAuth() {
    return this.api.checkToken().then(async (status) => {
      await this.api.isAuthenticated();
      this.isAuthenticated = this.api.authenticationState.value;
    });
  }

  /**
   * collapsesMenu
   */
  collapsesMenu() {
    this.iconOnly = !this.iconOnly;
  }

  /**
   * Profile Setting Get Picture
   */
  async profileSettingGetPicture() {
    await this.helperMethods
      .promiseTimeout(this.api.profileSettingGetPicture())
      .then(async (res) => {
        if (res.code === 0) {
          this.photo = res;
        }
      })
      .catch(async (err) => {
        console.log(err);
      });
  }

  /**
   * Get Sub Active Tab
   *
   * @param c string
   * @returns string
   */
  getSubActiveTab(c: string) {
    if (c.includes('/member')) {
      const d = c.substr(7);
      let e = '';
      let f = 0;
      if (d.includes('/1') || d.includes('/3') || d.includes('/2')) {
        e = d.substr(0, d.length - 2);
        f = e.lastIndexOf('/') !== -1 ? e.lastIndexOf('/') : 0;
      } else {
        e = d;
        f = d.lastIndexOf('/') !== -1 ? d.lastIndexOf('/') : 0;
      }
      return e.substring(f + 1, e.length);
    }

    return c;
  }

  /**
   * Get Active Tab
   *
   * @param c string
   * @returns string
   */
  getActiveTab(c: string) {
    if (c.includes('/member/')) {
      c = c.indexOf('?') !== -1 ? c.substr(0, c.indexOf('?')) : c;
      const d = c.substr(8);
      const e = d.indexOf('/') !== -1 ? d.indexOf('/') : d.length;
      return d.substr(0, e);
    }

    return c;
  }

  /**
   * Go Back To Tab
   *
   * @param page string
   */
  goBackToTab(page: string) {
    this.currentUrl = page;
    this.navController.navigateBack(`/member/${page}`);
    console.log(page);
    this.profileSettingGetPicture();
    this.getUserProfile();
    this.isPostOpen = false;
  }

  addImage(page: string) {
    console.log('add image');
    this.api.successToast('Add Image is coming soon!');
  }

  /**
   * Go To Tab
   *
   * @param page string
   */
  goToTab(page: string) {
    this.currentUrl = page;
    this.navController.navigateRoot(`/member/${page}`);
    console.log(this.currentUrl);
    // this.profileSettingGetPicture();
    // this.getUserProfile();
  }

  /**
   * Open Modal
   *
   * @param page string
   */
  openModal(page: string) {
    this.oldCurrentUrl = this.currentUrl;
    this.currentUrl = page;
    const dynamicComponent: DynamicComponent = {
      type: 'modal',
      component: this.componentPickerService.getComponent(page),
    };
    this.openComponent(dynamicComponent);
  }

  /**
   * Open Component
   *
   * @param component DynamicComponent
   */
  async openComponent(component: DynamicComponent, componentData: any = {}) {
    if (component.component) {
      if (component.type === 'modal') {
        const modal = await this.modalController.create({
          component: component.component,
          backdropDismiss: false,
          // swipeToClose: false,
          animated: false,
          componentProps: { isModal: true, data: componentData },
          cssClass:
            component.component === component['size']
              ? this.helperMethods.getModalDynamicStyle(
                this.screenSizeService.widthSize.value,
                component['size']
              )
              : this.helperMethods.getModalStyleFull(
                this.screenSizeService.widthSize.value
              ),
        });
        this.api.storeModal(modal);
        await modal.present();
        await modal.onDidDismiss().then((data) => {
          this.currentUrl = this.oldCurrentUrl;
          this.currentUrl = this.getSubActiveTab(this.router.url);
          this.currentRootUrl = this.getActiveTab(this.router.url);
        });
      }
      if (component.type === 'page') {
        this.goTo(component.component.toString());
      }
    } else {
      this.api.errorAlert(
        'Feature Update',
        'This feature is not available on this version, kindly update your app.'
      );
    }
  }

  /**
   * Init method/function to be call on  load of component/page
   */
  async ngOnInit() {
    this.api
      .getLocalData('profilePicture')
      .then((data) => {
        const img = this.cryptoService.decryptPayload(data);
        this.photo = img;
      })
      .catch(async (err) => console.log(err));
    this.router.events.subscribe(() => {
      if (this.router.url) {
        this.currentUrl = this.getActiveTab(this.router.url);
        // console.log(this.currentUrl);
      }
    });
    this.api
      .getAuthenticatedUser()
      .then((data) => {
        this.currentUserData = data;
        // console.log(data);
      })
      .catch((err) => console.log(err));
    if (this.isDesktop && this.isPwa) {
      this.checkCookie();
    }
    this.checkAuth();
  }

  ionViewWillEnter() {
    this.getUserProfile();
    this.checkAuth();
  }

  /**
   * getSanitizeUrl
   *
   * @param url string
   * @returns SafeUrl
   */
  public getSanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Logout
   */
  async logout() {
    let html = '';
    html += `<img src="assets/alert/${'info'}.svg">`;
    html += `<h1 class="header ion-margin-y-12">${'Logout Alert'} Alert</h1>`;
    html += `<div class="message">Do you want to logout?</div>`;
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
            this.api
              .logout()
              .then(() => {
                this.dataService.setData('action', 'logout');
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

  /**
   * Go To
   *
   * @param page string
   */
  goTo(page: string) {
    this.navController.navigateForward(page);
  }


  checkCookie() {
    const cookieEnabled =
      navigator.cookieEnabled &&
      document.cookie.indexOf('PeachyCookie=true') !== -1;
    return cookieEnabled || this.enableCookie();
  }

  async enableCookie() {
    const toast = await this.toastController.create({
      // header: 'Toast header',
      message:
        'Cookies help us to ensure our site works securely, continually improves and to personalize your experience.',
      icon: 'information-circle',
      position: 'bottom',
      cssClass: 'cookies',
      buttons: [
        ...[
          this.isDesktop
            ? {
              // side: 'start',
              text: 'Manage Preferences',
              cssClass: 'secondary',
              handler: () => {
                console.log('Favorite clicked');
              },
            }
            : {},
        ],
        {
          text: 'Accept cookies',
          cssClass: 'primary',
          role: 'cancel',
          handler: () => {
            document.cookie = 'PeachyCookie=true';
          },
        },
      ],
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  /**
   * Get User Profile
   */
  async getUserProfile() {
    await this.helperMethods
      .promiseTimeout(this.api.getUserProfile())
      .then(async (res) => {
        if (res.code === 0) {
          this.api.setAuthenticatedUser(res.customerDetails);
          this.api.setAuthenticatedPersistentUser(res.customerDetails);
        } else {
          console.log(res.message);
        }
      })
      .catch(async (err) => {
        console.log(err);
      });
  }

  /**
   * We subscribe to the queryParams observable, and if there's a component, modal, m, or c parameter, we
   * open the component
   */
  checkDynamicComponent() {
    try {
      this.activatedRoute.queryParams
        .subscribe((params) => {
          const component =
            params['component'] ||
            params['modal'] ||
            params['m'] ||
            params['c'];
          if (component) {
            const dynamicComponent: DynamicComponent = {
              type: 'modal',
              component: this.componentPickerService.getComponent(component),
            };
            this.openComponent(dynamicComponent, params);
          }
        })
        .unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }


}



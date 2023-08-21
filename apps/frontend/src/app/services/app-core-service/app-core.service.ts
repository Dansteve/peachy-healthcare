import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Device, DeviceInfo, GetLanguageCodeResult } from '@capacitor/device';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import {
  AnyInfo,
  AuthenticatedToken,
  User
} from '@peachy-healthcare/app-interface';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CryptoService } from '../crypto/crypto.service';
import { HelperMethodsService } from '../helper-methods/helper-methods.service';
import { NetworkService } from '../network/network.service';
import { ScreenSizeService } from '../screen-size/screen-size.service';


const TOKEN_DATA = 'current_user';
const CURRENT_TOKEN = 'current_token';
const PERSISTENT_USER = 'persistent_user';
const ENABLE_FINGERPRINT = 'enable_Fingerprint';
const ENABLE_DARK_MODE = 'dark_mode';
const ENABLE_PANIC_MODE = 'panic_mode';
const ENABLE_ALWAYS_LOGGED_IN_MODE = 'always_logged_in';
const NEW_RELEASE = 'new_release';
const VERSION = 'version';


@Injectable({
  providedIn: 'root'
})

export class AppCoreService {

  public apiBaseUrl = '';
  public accessToken: AuthenticatedToken = null as any;
  public userDataState = new BehaviorSubject<User>(null as any);
  public deviceInfo: DeviceInfo;
  public deviceLanguageCodeResult: GetLanguageCodeResult;
  public authenticationState = new BehaviorSubject(false);
  public enableFingerprint = new BehaviorSubject(false);
  public enableShowBalance = new BehaviorSubject(true);
  public enableDarkMode = new BehaviorSubject(false);
  public enablePanicMode = new BehaviorSubject(false);
  public enableAlwaysLoggedInMode = new BehaviorSubject(false);
  public isNewRelease = new BehaviorSubject(false);
  public version = new BehaviorSubject<string>('');
  public currentVersion = environment.appVerCode;
  public modalsInst: any[] = [];
  public headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  public isDesktop: boolean;
  public currentSubUrl: any = '';
  public currentUrl: any = '';
  private calledAPIs: any[] = [];

  /**
   * Creates an instance of ApiService.
   *
   * @param platform
   * @param http
   * @param alertController
   * @param toastController
   * @memberof ApiService
   */
  constructor(
    public platform: Platform,
    public http: HttpClient,
    public alertController: AlertController,
    public toastController: ToastController,
    public cryptoService: CryptoService,
    public storage: Storage,
    public loadingController: LoadingController,
    public helperMethods: HelperMethodsService,
    public screenSizeService: ScreenSizeService,
    public networkService: NetworkService,
    public router: Router,) {
    this.platform.ready().then(() => {
      this.apiBaseUrl = environment.apiBaseUrl;
      console.log(this.apiBaseUrl);
      this.checkToken().then(async (status) => {
        const currentState = await this.isAuthenticated();
        if (currentState) {
          this.getAuthenticatedUser().then((userDataState) => {
            this.userDataState.next(userDataState);
          });
          this.getAuthenticatedToken().then((accessToken) => {
            this.accessToken = accessToken;
          });
        }
        return false;
      });
    });
    this.getInfo();
    this.getLanguageCode();
    this.dbInit();
    this.screenSizeService.isDesktop.subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  /**
   * dbInit
   */
  dbInit() {
    this.storage.create();
    this.storage.defineDriver(CordovaSQLiteDriver);
  }


  /**
   * It gets the access token from the local storage, and then returns a new HttpHeader object with the
   * access token and other required headers
   *
   *
   * @returns a new HttpHeaders object.
   */
  async getAuthHeader() {
    await this.getAuthenticatedToken().catch((error) => { console.log(error); });
    // console.log(this.authToken);
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken?.token || ''}`);
  }

  async genericRequestWithOutAuthHeader(method: 'post' | 'put' | 'patch' = 'post', url: string, body: any): Promise<any> {
    const headers = this.headers;
    return await new Promise((resolve, reject) => {
      this
        .http[method](url, body, { headers, observe: 'response' })
        .subscribe({
          next: (response) => resolve(response.body),
          error: (error: AnyInfo) => reject(error),
          complete: () => console.log('complete')
        });
    });
  }

  async getActiveSubdomain(c: string, prefix = 'member') {
    if (c.includes(`/${prefix}/`)) {
      const d = c.substring(prefix.length + 2);
      const e = d.indexOf('/') !== -1 ? d.indexOf('/') : d.length;
      return d.substring(0, e);
    }

    return c;
  }

  getActiveTab(c: string, prefix = 'member') {
    if (c.includes(`/${prefix}/`)) {
      const d = c.substring((prefix.length + 2));
      const e = d.indexOf('/') !== -1 ? d.indexOf('/') : d.length;
      return (d.substring(0, e));
    }
    return c;
  }

  async postRequestWithOutAuthHeader(url: string, body: any): Promise<any> {
    return this.genericRequestWithOutAuthHeader('post', url, body);
  }

  async patchRequestWithOutAuthHeader(url: string, body: any): Promise<any> {
    return this.genericRequestWithOutAuthHeader('patch', url, body);
  }

  async putRequestWithOutAuthHeader(url: string, body: any): Promise<any> {
    return this.genericRequestWithOutAuthHeader('put', url, body);
  }

  async genericRequestWithAuthHeader(method: 'post' | 'put' | 'patch' = 'post', url: string, body: any): Promise<any> {
    let headers: HttpHeaders;
    await this.getAuthHeader().then((data) => {
      headers = data;
    });
    return await new Promise((resolve, reject) => {
      this
        .http[method](url, body, { headers, observe: 'response' })
        .subscribe({
          next: (response) => resolve(response.body),
          error: (error: AnyInfo) => reject(error),
          complete: () => console.log('complete')
        });
    });
  }

  async postRequestWithAuthHeader(url: string, param: any): Promise<any> {
    return this.genericRequestWithAuthHeader('post', url, param);
  }

  async patchRequestWithAuthHeader(url: string, body: any): Promise<any> {
    return this.genericRequestWithAuthHeader('patch', url, body);
  }

  async putRequestWithHeader(url: string, body: any): Promise<any> {
    return this.genericRequestWithAuthHeader('put', url, body);
  }

  async deleteRequestWithAuthHeader(url: string): Promise<any> {
    let headers: HttpHeaders;
    await this.getAuthHeader().then((data) => {
      headers = data;
    });
    return await new Promise((resolve, reject) => {
      this
        .http
        .delete(url, { headers, observe: 'response' })
        .subscribe({
          next: (response) => resolve(response.body),
          error: (error: AnyInfo) => reject(error),
          complete: () => console.log('complete')
        });
    });
  }

  async getRequestFromServeWithLocalFallback(url: string, localFallBackName?: string) {
    const checkNetwork = await this.networkService.getCurrentNetworkStatus();
    if (this.calledAPIs.includes(localFallBackName) && !checkNetwork.connected) {
      return await new Promise((resolve, reject) => {
        this.getLocalData(localFallBackName)
          .then((data) => {
            console.log(data);
            data.status === HttpStatusCode.Ok ? resolve(data) : reject(data);
            resolve(data);
            this.getRequestFromServe(url, localFallBackName);
          }).catch((error) => {
            console.log(error);
            return this.getRequestFromServe(url, localFallBackName);
          });
      });
    } else {
      return this.getRequestFromServe(url, localFallBackName);
    }
  }

  pushToArrayIfNotExists(array: any[], item: any) {
    if (!array.includes(item)) {
      array.push(item);
    }
  }

  async getRequestFromServe(url: string, localFallBackName?: string): Promise<any> {
    let headers: HttpHeaders;
    await this.getAuthHeader().then((data) => {
      headers = data;
    });
    return await new Promise((resolve, reject) => {
      this
        .http
        .get(url, { headers, observe: 'response' })
        .subscribe({
          next: (response) => {
            resolve(response.body);
            if (localFallBackName) {
              this.storeApiData(response.body, localFallBackName);
            }
          },
          error: (error: AnyInfo) => {
            if (localFallBackName) {
              this.getLocalData(localFallBackName)
                .then((data) => {
                  data.status === HttpStatusCode.Ok ? resolve(data) : reject(error);
                })
                .catch(() => {
                  reject(error);
                });
            } else {
              reject(error);
            }
          },
          complete: () => console.log('complete')
        });
    });
  }

  /**
   * Store Data to local
   */
  storeApiData(data: any, name: string) {
    if (data.status === HttpStatusCode.Ok) {
      this.pushToArrayIfNotExists(this.calledAPIs, name);
      return this.storeLocalData(name, data);
    }
    return new Promise((resolve) => resolve(true));
  }

  async getLoader() {
    return await this.loadingController.create({
      spinner: null,
      message: '<img id="roller" src="assets/icons/logo-icon-only.svg">',
      translucent: true,
      cssClass: 'custom-loading'
    });
  }

  // Storage & Utility

  /**
   * It returns the device information.
   *
   * @returns DeviceInfo
   */
  async getInfo(): Promise<DeviceInfo> {
    this.deviceInfo = await Device.getInfo();
    return this.deviceInfo;
  }

  /**
   * It returns the language code of the device.
   *
   * @returns The language code of the device.
   */
  async getLanguageCode(): Promise<GetLanguageCodeResult> {
    this.deviceLanguageCodeResult = await Device.getLanguageCode();
    return this.deviceLanguageCodeResult;
  }

  /**
   * It returns a promise that resolves to a boolean value that is either true or false
   *
   * @returns A promise that resolves to a boolean value.
   */
  async getPanicMode(): Promise<boolean> {
    return await this.storage.get(ENABLE_PANIC_MODE).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          this.enablePanicMode.next((res === 'true'));
          resolve(this.enablePanicMode.value);
        });
      } else {
        return new Promise((resolve) => {
          this.setPanicMode(false);
          resolve(false);
        });
      }
    });
  }

  /**
   * It sets the value of the enablePanicMode variable in the storage.
   *
   * @param enablePanicMode - boolean = !this.enablePanicMode.value
   *
   * @returns A promise that resolves to the result of the storage.set() call.
   */
  async setPanicMode(enablePanicMode = !this.enablePanicMode.value): Promise<void> {
    return await this.storage.set(ENABLE_PANIC_MODE, JSON.stringify(enablePanicMode)).then(res => new Promise((resolve) => {
      this.enablePanicMode.next(enablePanicMode);
      resolve(res);
    }));
  }

  /**
   * It returns a promise that resolves to a boolean value
   *
   * @returns A promise that resolves to a boolean value.
   */
  async getDarkMode(): Promise<boolean> {
    return await this.storage.get(ENABLE_DARK_MODE).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          this.enableDarkMode.next((res === 'true'));
          resolve(this.enableDarkMode.value);
        });
      } else {
        return new Promise((resolve) => {
          this.setDarkMode(false);
          resolve(false);
        });
      }
    });
  }

  /**
   * We're setting the value of the `enableDarkMode` key in the storage to the value of the
   * `enableDarkMode` parameter, and then we're setting the value of the `enableDarkMode` BehaviorSubject
   * to the value of the `enableDarkMode` parameter
   *
   * @param enableDarkMode - boolean = !this.enableDarkMode.value
   *
   * @returns A promise that resolves to the result of the storage.set() call.
   */
  async setDarkMode(enableDarkMode = !this.enableDarkMode.value): Promise<void> {
    return await this.storage.set(ENABLE_DARK_MODE, JSON.stringify(enableDarkMode)).then(res => new Promise((resolve) => {
      this.enableDarkMode.next(enableDarkMode);
      resolve(res);
    }));
  }

  /**
   * It returns a promise that resolves to a boolean value
   *
   * @returns A promise that resolves to a boolean value.
   */
  async getEnableFingerprint(): Promise<boolean> {
    return await this.storage.get(ENABLE_FINGERPRINT).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          this.enableFingerprint.next((res === 'true'));
          resolve(this.enableFingerprint.value);
        });
      } else {
        return new Promise((resolve) => {
          this.setEnableFingerprint(true);
          resolve(true);
        });
      }
    });
  }

  /**
   * It sets the value of the enableFingerprint variable in the storage.
   *
   * @param enableFingerprint - boolean = !this.enableFingerprint.value
   *
   * @returns A promise that resolves to the value of the storage key.
   */
  async setEnableFingerprint(enableFingerprint = !this.enableFingerprint.value): Promise<void> {
    return await this.storage.set(ENABLE_FINGERPRINT, JSON.stringify(enableFingerprint)).then(res => new Promise((resolve) => {
      this.enableFingerprint.next(enableFingerprint);
      resolve(res);
    }));
  }

  /**
   * It returns a promise that resolves to a boolean value that is the value of the
   * `enableAlwaysLoggedInMode` BehaviorSubject
   *
   * @returns A promise that resolves to a boolean value.
   */
  async getAlwaysLoggedInMode(): Promise<boolean> {
    return await this.storage.get(ENABLE_ALWAYS_LOGGED_IN_MODE).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          this.enableAlwaysLoggedInMode.next((res === 'true'));
          resolve(this.enableAlwaysLoggedInMode.value);
        });
      } else {
        return new Promise((resolve) => {
          this.setAlwaysLoggedInMode(false);
          resolve(true);
        });
      }
    });
  }

  /**
   * It sets the value of the enableAlwaysLoggedInMode variable in the storage, and then it updates the
   * enableAlwaysLoggedInMode BehaviorSubject with the new value
   *
   * @param enableAlwaysLoggedInMode - boolean = !this.enableAlwaysLoggedInMode.value
   *
   * @returns A promise that resolves to the result of the storage.set() call.
   */
  async setAlwaysLoggedInMode(enableAlwaysLoggedInMode = !this.enableAlwaysLoggedInMode.value): Promise<void> {
    return await this.storage.set(ENABLE_ALWAYS_LOGGED_IN_MODE, JSON.stringify(enableAlwaysLoggedInMode))
      .then(res => new Promise((resolve) => {
        this.enableAlwaysLoggedInMode.next(enableAlwaysLoggedInMode);
        resolve(res);
      }));
  }

  /**
   * It gets the value of the key NEW_RELEASE from the storage, if it exists, it returns the value, if it
   * doesn't exist, it returns false
   *
   * @returns A promise that resolves to a boolean value.
   */
  async getNewRelease(): Promise<any> {
    return await this.storage.get(NEW_RELEASE).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          resolve(JSON.parse(res));
        });
      } else {
        return new Promise((resolve) => {
          resolve(false);
        });
      }
    });
  }

  /**
   * It sets the value of the NEW_RELEASE key in the storage to the value of the newRelease parameter,
   * and then it sets the value of the isNewRelease BehaviorSubject to the value of the newRelease
   * parameter
   *
   * @param newRelease - boolean - This is the new value that you want to set for the new
   * release.
   *
   * @returns A promise that resolves to the result of the storage.set() call.
   */
  async setNewRelease(newRelease: boolean): Promise<void> {
    return await this.storage.set(NEW_RELEASE, JSON.stringify(newRelease)).then(res => new Promise((resolve) => {
      this.isNewRelease.next(newRelease);
      resolve(res);
    }));
  }

  /**
   * It gets the user data from the storage, decrypts it, and returns it as a promise
   *
   * @returns A promise that resolves to a User object.
   */
  async getAuthenticatedUser(): Promise<User> {
    return await this.storage.get(TOKEN_DATA).then(res => {
      return new Promise((resolve, reject) => {
        const data = JSON.parse(
          this.cryptoService.decrypt(res)
        );
        this.userDataState.next(data);
        // console.log(this.userDataState.value);
        if (data?.code === 1) {
          this.storage.remove(TOKEN_DATA);
          this.authenticationState.next(false);
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * It takes an authenticated user object, encrypts it, and stores it in the Ionic Storage
   *
   * @param authenticatedUser - This is the user object that you get from the server after a
   * successful login.
   *
   * @returns A promise that resolves to the result of the storage.set() method.
   */
  async setAuthenticatedUser(authenticatedUser: any): Promise<void> {
    authenticatedUser.a_curDate = new Date();
    const authenticatedUserData = this.cryptoService.encrypt(JSON.stringify(authenticatedUser));
    return await this.storage.set(TOKEN_DATA, authenticatedUserData).then(res => new Promise((resolve) => {
      // this.userDataState = authenticatedUser;
      this.userDataState.next(authenticatedUser);
      resolve(res);
    }));
  }

  /**
   * It gets the token from the storage, decrypts it, and returns it
   *
   * @returns The access token is being returned.
   */
  async getAuthenticatedToken(): Promise<AuthenticatedToken> {
    return await this.storage.get(CURRENT_TOKEN).then(res => {
      return new Promise((resolve, reject) => {
        const data = JSON.parse(
          this.cryptoService.decrypt(res)
        );
        console.log(data);
        this.accessToken = data;
        if (data?.code === 1) {
          this.storage.remove(TOKEN_DATA);
          this.authenticationState.next(false);
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * It takes an object, encrypts it, and stores it in the local storage
   *
   * @param authenticatedToken - The token that you get from the server.
   *
   * @returns A promise that resolves to the result of the storage.set() method.
   */
  async setAuthenticatedToken(authenticatedToken: AuthenticatedToken): Promise<void> {
    authenticatedToken['a_curDate'] = new Date();
    const authenticatedUserData = this.cryptoService.encrypt(JSON.stringify(authenticatedToken));
    return await this.storage.set(CURRENT_TOKEN, authenticatedUserData).then(res => new Promise((resolve) => {
      this.accessToken = authenticatedToken;
      resolve(res);
    }));
  }

  /**
   * It returns a promise that resolves to a boolean value
   *
   * @returns A boolean value.
   */
  async isAuthenticated(): Promise<boolean> {
    return this.authenticationState.value;
  }

  /**
   * It removes the token from the storage and then sets the authentication state to false
   *
   * @returns The promise is being returned.
   */
  async logout(): Promise<void> {
    return await this.storage.remove(TOKEN_DATA).then(res => {
      // this.logoutUser();
      this.enableAlwaysLoggedInMode.next(false);
      this.setAlwaysLoggedInMode(false);
      this.closeAllModals();
      this.authenticationState.next(false);
    });
  }

  /**
   * It takes a name and data, encrypts the data, and then stores it in the local storage
   *
   * @param name - The name of the data you want to store.
   *
   * @param data - any - this is the data that you want to store.
   *
   * @returns A promise.
   */
  async storeLocalData(name: string, data: any) {
    const localData = this.cryptoService.encrypt(JSON.stringify(data));
    return this.storage.set(`local_${name}`, localData);
  }

  /**
   * It gets the data from the local storage, decrypts it, and returns it as a promise
   *
   * @param name - The name of the data you want to get.
   *
   * @returns A promise that resolves to the data stored in the local storage.
   */
  async getLocalData(name: string | undefined): Promise<any> {
    return await this.storage.get(`local_${name}`).then(res => new Promise((resolve, reject) => {
      if (res != null) {
        const data = JSON.parse(
          this.cryptoService.decrypt(res)
        );
        if (data?.code === 1) {
          this.storage.remove(`local_${name}`);
          reject(data);
        } else {
          resolve(data);
        }
      } else {
        reject({ error: 'unable to get data', message: 'data is null' });
      }
    }));
  }

  /**
   * It returns a promise that resolves to a User object if the user is authenticated, or rejects
   * with an error if the user is not authenticated
   *
   * @returns A promise that resolves to a User object.
   */
  async getAuthenticatedPersistentUser(): Promise<User> {
    return await this.storage.get(PERSISTENT_USER).then(res => {
      return new Promise((resolve, reject) => {
        const data = JSON.parse(
          this.cryptoService.decrypt(res)
        );
        if (data?.code === 1) {
          this.storage.remove(PERSISTENT_USER);
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * It takes a persistent user object, encrypts it, and stores it in the device's local storage
   *
   * @param persistentUser - any
   *
   * @returns A promise that resolves to the result of the storage.set() method.
   */
  async setAuthenticatedPersistentUser(persistentUser: any): Promise<void> {
    // // console.log(PersistentUser);
    persistentUser.a_curDate = new Date();
    const persistentUserData = this.cryptoService.encrypt(JSON.stringify(persistentUser));
    return await this.storage.set(PERSISTENT_USER, persistentUserData)
      .then(res => new Promise(resolve => {
        resolve(res);
      }));
  }

  /**
   * If the user is already logged in, then the user's data is stored in the device's memory
   *
   * @returns The authenticationState.next(true) is being returned.
   */
  async fingerprintAIO(): Promise<void> {
    return await this.storage.get(PERSISTENT_USER).then(res => {
      if (res != null) {
        return this.storage.set(TOKEN_DATA, res).then(data => this.authenticationState.next(true));
      } else {
        return this.authenticationState.next(false);
      }
    });
  }

  /**
   * It checks if the user is logged in, and if so, it sets the authentication state to true
   *
   * @returns The authentication state is being returned.
   */
  async silentLogin(): Promise<void> {
    return await this.storage.get(PERSISTENT_USER).then(res => {
      if (res != null) {
        return this.storage.set(TOKEN_DATA, res).then(data => this.authenticationState.next(true));
      } else {
        return this.authenticationState.next(false);
      }
    });
  }

  /**
   * It checks if the token is stored in the local storage and if it is, it sets the authentication state
   * to true
   *
   * @returns A boolean value.
   */
  async checkToken(): Promise<boolean> {
    return await this.storage.get(TOKEN_DATA).then(res => {
      if (res != null) {
        this.authenticationState.next(true);
        return true;
      } else {
        this.authenticationState.next(false);
        return false;
      }
    });
  }

  /**
   * It checks if the current token is valid
   *
   * @returns A boolean value.
   */
  async checkCurrentToken(): Promise<boolean> {
    return await this.storage.get(CURRENT_TOKEN).then(res => {
      if (res != null) {
        this.authenticationState.next(true);
        return true;
      } else {
        this.authenticationState.next(false);
        return false;
      }
    });
  }

  /**
   * It clears the local storage and sets the authentication state to false
   *
   * @returns The authentication state is being returned.
   */
  async clearLocalStorage(): Promise<void> {
    return await this.storage.clear().then(res => {
      this.authenticationState.next(false);
      this.authenticationState.next(false);
    });
  }

  /**
   * It creates an alert with a custom HTML message
   *
   * @param _message - The message to be displayed in the alert.
   *
   * @param [_header=null] - The header of the alert.
   *
   * @param [img=info] - The image to be displayed in the alert.
   *
   * @returns An alert object
   */
  async errorAlert(_message: string, _header = '', img = 'info'): Promise<HTMLIonAlertElement> {
    let html = '';
    html += img ? `<img src="assets/alert/${img}.svg">` : '';
    html += _header ? `<h1 class="header ion-margin-y-12">${_header}</h1>` : '<h1></h1>';
    html += `<div class="message">${_message}</div>`;
    const alert = await this.alertController.create({
      // header: 'Status',
      // subHeader: 'Subtitle',
      cssClass: 'my-alert',
      mode: 'ios',
      message: html,
      buttons: [{
        text: 'Okay',
        role: 'cancel',
        cssClass: 'primary only',
        handler: () => {
          console.log();
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
    return alert;
  }

  /**
   * This function creates an alert with a header and a message, and returns the alert
   *
   * @param _header - The header of the alert
   *
   * @param _message - The message you want to display in the alert.
   *
   * @returns The alert element.
   */
  async errorAlertWithHeader(_header: string, _message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      // header: 'Status',
      header: _header,
      // subHeader: 'Subtitle',
      cssClass: 'my-alert',
      mode: 'ios',
      message: _message,
      buttons: [{
        text: 'Okay',
        role: 'cancel',
        cssClass: 'success only',
        handler: () => {
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
    return alert;
  }

  /**
   * This function creates a toast message with a primary color, an information icon, and a duration of 2
   * seconds
   *
   * @param _message - string - The message to be displayed in the toast
   *
   * @returns The toast element.
   */
  async successPop(_message: string): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message: _message,
      color: 'primary',
      icon: 'information-circle',
      position: 'top',
      duration: 2000
    });
    await toast.present();
    return toast;
  }

  /**
   * It creates an alert with a custom HTML message, and returns the alert object
   *
   * @param _message - string - The message to be displayed in the alert.
   *
   * @param [_header=null] - The header of the alert.
   *
   * @param  [img=info] - 'info' | 'success' | 'error' = 'info'
   * @param [buttonTitle=Okay] - The text that will be displayed on the button.
   *
   * @returns An alert
   */
  async successAlert(_message: string, _header = '', img: 'info' | 'success' | 'error' = 'success', buttonTitle = 'Okay'): Promise<HTMLIonAlertElement> {
    let html = '';
    html += img ? `<img src="assets/alert/${img}.svg">` : '';
    html += _header ? `<h1 class="header ion-margin-y-12">${_header}</h1>` : '<h1></h1>';
    html += `<div class="message">${_message}</div>`;
    const alert = await this.alertController.create({
      cssClass: 'my-alert',
      mode: 'ios',
      message: html,
      buttons: [
        {
          text: buttonTitle,
          role: 'cancel',
          cssClass: 'primary only',
          handler: () => {
            console.log('close alert');
          }
        }
      ],
      // backdropDismiss: false
    });

    await alert.present();
    return alert;
  }

  /**
   * It creates an alert with a header, a message, and a button that says "Okay"
   *
   * @param _header - The title of the alert
   *
   * @param _message - The message you want to display in the alert.
   *
   * @returns The alert element
   */
  async successAlertWithHeader(_header: string, _message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: _header,
      // subHeader: 'Subtitle',
      cssClass: 'my-alert',
      mode: 'ios',
      message: _message,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          cssClass: 'primary only',
          handler: () => {
          }
        }
      ],
      // backdropDismiss: false
    });

    await alert.present();
    return alert;
  }

  /**
   * It creates a toast message with the given message, position, color, duration, icon, cssClass, and
   * buttons.
   *
   * @param _message - The message you want to display in the toast.
   *
   * @param [position=top] - 'top' | 'bottom' | 'middle' = 'top'
   *
   * @param [color=success] - The color of the toast.
   *
   * @param [duration=1000] - The duration of the toast in milliseconds. Default: 2000
   *
   * @returns The toast element
   */
  async successToast(
    _message: string,
    position: 'top' | 'bottom' | 'middle' = 'top',
    color = 'success', duration = 3500): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message: `${_message}`,
      position,
      color,
      duration,
      // icon: 'information-circle',
      cssClass: 'customToast customToast-success',
      buttons: [
        // {
        //   side: 'start',
        //   icon: 'assets/toast/success.svg',
        //   cssClass: 'customToast-icon',
        //   text: '',
        //   handler: () => {
        //     console.log('Cart Button Clicked');
        //   }
        // },
        // {
        //   side: 'end',
        //   icon: 'assets/toast/close.svg',
        //   text: '',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Close clicked');
        //   }
        // }
      ]
    });
    await toast.present();
    return toast;
  }

  /**
   * It creates a toast with a message, position, color, duration, cssClass, and buttons
   *
   * @param _message - The message you want to display in the toast.
   *
   * @param [position=top] - 'top' | 'bottom' | 'middle' = 'top'
   *
   * @param [color=danger] - The color of the toast.
   *
   * @param [duration=2000] - The duration in milliseconds to show the toast. Default: 2000
   *
   * @returns The toast element
   */
  async errorToast(
    _message: string,
    position: 'top' | 'bottom' | 'middle' = 'top',
    color = 'danger', duration = 3700): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message: `${_message}`,
      position,
      color,
      duration,
      cssClass: 'customToast customToast-error',
      buttons: [
        {
          side: 'start',
          icon: 'assets/toast/danger.svg',
          cssClass: 'customToast-icon',
          text: '',
          handler: () => {
            console.log('Cart Button Clicked');
          }
        },
        // {
        //   side: 'end',
        //   icon: 'assets/toast/close.svg',
        //   text: '',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Close clicked');
        //   }
        // }
      ]
    });
    await toast.present();
    return toast;
  }

  /**
   * It creates an alert with the message "Coming Soon" and returns the alert.
   *
   * @param [_message=Coming Soon] - string = 'Coming Soon'
   *
   * @returns The alert element
   */
  async comingSoon(_message = 'Coming Soon'): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: 'Message',
      // subHeader: 'Subtitle',
      cssClass: 'my-alert',
      mode: 'ios',
      message: _message,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          cssClass: 'success only',
          handler: () => {
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
    return alert;
  }

  /**
   * It creates a toast notification that prompts the user to reload the webapp to load the latest update
   *
   * @param version - The version of the app that is currently running.
   *
   * @returns The toast is being returned.
   */
  async updateToast(version: any) {
    const toast = await this.toastController.create({
      header: 'New Update available!',
      message: 'Close all tabs for the webapp to load the latest update',
      position: 'bottom',
      color: 'light',
      icon: 'information-circle',
      cssClass: 'toast web-toast',
      buttons: [{
        cssClass: 'toastReloadCancel',
        text: 'OKAY',
        role: 'Cancel',
        handler: () => {
          this.setVersion(this.currentVersion || version);
          window.location.reload();
          document.location.reload();
        }
      }
      ]
    });
    return toast.present();
  }

  // Storage & Utility

  /**
   * It gets the version from storage, if it's not there, it sets it to the environment variable and
   * returns that
   *
   * @returns A promise that resolves to a string.
   */
  async getVersion(): Promise<string> {
    return await this.storage.get(VERSION).then(res => {
      if (res != null) {
        return new Promise((resolve) => {
          this.version.next(res);
          resolve(res);
        });
      } else {
        return new Promise((resolve) => {
          this.setVersion(environment.appVerCode);
          resolve(environment.appVerCode);
        });
      }
    });
  }

  /**
   * It sets the version of the app.
   *
   * @param version - string = this.currentVersion
   *
   * @returns A promise that resolves to the value of the version.
   */
  async setVersion(version: string = this.currentVersion): Promise<void> {
    return await this.storage.set(VERSION, (version)).then(res => new Promise((resolve) => {
      this.version.next(version);
      resolve(res);
    }));
  }

  /**
   * If the modal instance is not already in the array, add it
   *
   * @param x - any - This is the modal instance that is being passed in.
   */
  storeModal(x: any) {
    this.modalsInst.indexOf(x) === -1 ? this.modalsInst.push(x) : (console.log('This item already exists'));
    console.log(this.modalsInst);
  }

  /**
   * It loops through the array of modals, and calls the dismiss() function on each one
   */
  closeAllModals() {
    this.modalsInst.forEach(element => {
      element.dismiss();
    });
    this.modalsInst = [];
    console.log(this.modalsInst);
  }

  /**
   * It removes the modal from the modalsInst array by finding the index of the modal that was passed in,
   * and then splicing it out of the array
   *
   * @param x - any - this is the modal that you want to close.
   */
  removeModal(x: any) {
    const index = this.modalsInst.indexOf(x);
    if (index > -1) {
      this.modalsInst[index].dismiss();
      this.modalsInst.splice(index, 1);
    }
    console.log(this.modalsInst);
  }

  /**
   * It takes a JSON object and converts it to a URL parameter string
   *
   * @param obj - The object that you want to convert to a URL parameter.
   *
   * @returns The function convertJsonToUrlParam is being returned.
   */
  convertJsonToUrlParam(obj: any) {
    return this.helperMethods.convertJsonToUrlParam({ obj });
  }

  getApiResponseMessage(array: string | Array<string>, separator = '<br>'): string {
    return this.helperMethods.convertArrayToString(array, separator);
  }
}

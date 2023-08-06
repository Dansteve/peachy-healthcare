
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AnyInfo, ApiErrorResponse, GenericApiResponse } from '@peachy-healthcare/app-interface';
import { AppCoreService } from '../app-core-service/app-core.service';
import { CryptoService } from '../crypto/crypto.service';
import { HelperMethodsService } from '../helper-methods/helper-methods.service';
import { NetworkService } from '../network/network.service';
import { ScreenSizeService } from '../screen-size/screen-size.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService extends AppCoreService {

  constructor(
    platform: Platform,
    http: HttpClient,
    alertController: AlertController,
    toastController: ToastController,
    cryptoService: CryptoService,
    loadingController: LoadingController,
    storage: Storage,
    helperMethods: HelperMethodsService,
    screenSizeService: ScreenSizeService,
    networkService: NetworkService,
    router: Router) {
    super(platform, http, alertController, toastController, cryptoService,
      storage, loadingController, helperMethods, screenSizeService, networkService, router);
    this.dbInit();
    this.getInfo();
    this.getLanguageCode();
  }


  // Generic

  async testApi(): Promise<GenericApiResponse<AnyInfo> | ApiErrorResponse> {
    return this.getRequestFromServe(this.apiBaseUrl);
  }

}

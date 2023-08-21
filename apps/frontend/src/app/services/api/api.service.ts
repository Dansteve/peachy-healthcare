
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AnyInfo, ApiErrorResponse, AuthenticatedToken, GenericApiResponse, LoginPayload, SignUpPayload, User } from '@peachy-healthcare/app-interface';
import { AppCoreService } from '../app-core-service/app-core.service';
import { CryptoService } from '../crypto/crypto.service';
import { HelperMethodsService } from '../helper-methods/helper-methods.service';
import { NetworkService } from '../network/network.service';
import { ScreenSizeService } from '../screen-size/screen-size.service';
import { environment } from './../../../environments/environment';

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

  async login(param: LoginPayload): Promise<GenericApiResponse<AuthenticatedToken> | ApiErrorResponse> {
    return this.postRequestWithOutAuthHeader(this.apiBaseUrl + '/login', param);
  }

  async register(param: SignUpPayload): Promise<GenericApiResponse<AuthenticatedToken> | ApiErrorResponse> {
    return this.postRequestWithOutAuthHeader(this.apiBaseUrl + '/register', param);
  }

  async forgetPassword(param: SignUpPayload): Promise<GenericApiResponse<AuthenticatedToken> | ApiErrorResponse> {
    return this.postRequestWithOutAuthHeader(this.apiBaseUrl + '/forget-password', param);
  }

  async resetPassword(param: SignUpPayload): Promise<GenericApiResponse<AuthenticatedToken> | ApiErrorResponse> {
    return this.postRequestWithOutAuthHeader(this.apiBaseUrl + '/reset-password', param);
  }

  async getProfile(): Promise<GenericApiResponse<User> | ApiErrorResponse> {
    return this.getRequestFromServe(this.apiBaseUrl + '/profile');
  }

  async getProfileById(username: string): Promise<GenericApiResponse<User> | ApiErrorResponse> {
    return this.getRequestFromServe(this.apiBaseUrl + `/users/${username}`);
  }

  async getProfileByUsername(username: string): Promise<GenericApiResponse<User> | ApiErrorResponse> {
    return this.getRequestFromServe(this.apiBaseUrl + `/users/username/${username}`);
  }

  async updateProfile(id: string, param: Partial<User>): Promise<GenericApiResponse<AuthenticatedToken> | ApiErrorResponse> {
    return this.putRequestWithHeader(this.apiBaseUrl + `/users/${id || param.username}`, param);
  }

  async getAddressSuggestions(address: string): Promise<GenericApiResponse<AnyInfo> | ApiErrorResponse> {

    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = {
          suggestions: [
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
          ]
        };
        resolve(data);
      });
    }

    return this.getRequestFromServeWithLocalFallback(`${environment.getAddress.url}/autocomplete/${address}?api-key=${environment.getAddress.key}`, `get_address_${address}`);
  }

  async getAddressInfo(id: string): Promise<GenericApiResponse<AnyInfo> | ApiErrorResponse> {

    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = {
          "postcode": "B8 3QU",
          "latitude": 52.4904132,
          "longitude": -1.8510468,
          "formatted_address": [
            "40 Highfield Road",
            "",
            "",
            "Saltley, Birmingham",
            "West Midlands"
          ],
          "thoroughfare": "Highfield Road",
          "building_name": "",
          "sub_building_name": "",
          "sub_building_number": "",
          "building_number": "40",
          "line_1": "40 Highfield Road",
          "line_2": "",
          "line_3": "",
          "line_4": "",
          "locality": "Saltley",
          "town_or_city": "Birmingham",
          "county": "West Midlands",
          "district": "Birmingham",
          "country": "England",
          "residential": true
        };
        resolve(data);
      });
    }

    return this.getRequestFromServeWithLocalFallback(`${environment.getAddress.url}/get/${id}?api-key=${environment.getAddress.key}`, `get_address_info_${id}`);
  }

  async getUserProfile(): Promise<GenericApiResponse<AnyInfo> | ApiErrorResponse> {
    return this.getRequestFromServeWithLocalFallback(`${this.apiBaseUrl}/profile`, `get_user_profile`);
  }

  async profileSettingGetPicture(): Promise<GenericApiResponse<AnyInfo> | ApiErrorResponse> {
    return this.getRequestFromServeWithLocalFallback(`${this.apiBaseUrl}/profile/setting/get-picture`, `profile_setting_get_picture`);
  }


}

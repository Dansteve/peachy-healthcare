
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

  staticUser = {
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbnN0ZXZlLmFkZWthbmJpQG1haWwuYmN1LmFjLnVrIiwiaWQiOiIwNTRmNGFhNS1kZjkzLTRmY2QtYTRkNy1jY2ZjYWFhYjYwYzkiLCJjcmVhdGVkQXQiOiIyMDIzLTA4LTIwVDEyOjA4OjI2LjM2OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA4LTIwVDEyOjA4OjI2LjM2OFoiLCJ1c2VyUmVmIjoiTlVORTkxTlZBWFEiLCJmaXJzdE5hbWUiOiJEYW5zdGV2ZSIsImxhc3ROYW1lIjoiQWRla2FuYmkiLCJ1c2VybmFtZSI6ImRhbnN0ZXZlLmFkZWthbmJpQG1haWwuYmN1LmFjLnVrIiwiZ2VuZGVyIjoiTWFsZSIsInBob25lTnVtYmVyIjoiMDEyMzQ1Njc4OSIsImFnZSI6IjM2Iiwib3RwIjpudWxsLCJhZGRyZXNzIjp7ImlkIjoiMGYyOTUxYjEtZDQzOC00ZTQ4LTgyOTEtMTJkZTU5ZDVmN2Y0IiwiY3JlYXRlZEF0IjoiMjAyMy0wOC0yMFQxMjowODoyNi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wOC0yMFQxMjowODoyNi4wMDBaIiwidXNlcklkIjoiMDU0ZjRhYTUtZGY5My00ZmNkLWE0ZDctY2NmY2FhYWI2MGM5Iiwic2VhcmNoIjpudWxsLCJwb3N0Y29kZSI6IkI4IDNRVSIsImxhdGl0dWRlIjo1MiwibG9uZ2l0dWRlIjotMSwidGhvcm91Z2hmYXJlIjoiSGlnaGZpZWxkIFJvYWQiLCJidWlsZGluZ19uYW1lIjoiIiwic3ViX2J1aWxkaW5nX25hbWUiOiIiLCJzdWJfYnVpbGRpbmdfbnVtYmVyIjoiIiwiYnVpbGRpbmdfbnVtYmVyIjoiNDAiLCJsaW5lXzEiOiI0MCBIaWdoZmllbGQgUm9hZCIsImxpbmVfMiI6IiIsImxpbmVfMyI6IiIsImxpbmVfNCI6IiIsImxvY2FsaXR5IjoiU2FsdGxleSIsInRvd25fb3JfY2l0eSI6IkJpcm1pbmdoYW0iLCJjb3VudHkiOiJXZXN0IE1pZGxhbmRzIiwiZGlzdHJpY3QiOiJCaXJtaW5naGFtIiwiY291bnRyeSI6IkVuZ2xhbmQiLCJyZXNpZGVudGlhbCI6dHJ1ZX0sImlhdCI6MTY5Mjc5NDkxMSwiZXhwIjoxNjkyNzk4NTExfQ.vpup6R_sAM9K5mF6LDzqqtqD_vBZLaiEZVSc8isWXKU",
      "user": {
        "id": "054f4aa5-df93-4fcd-a4d7-ccfcaaab60c9",
        "createdAt": "2023-08-20T12:08:26.368Z",
        "updatedAt": "2023-08-20T12:08:26.368Z",
        "userRef": "NUNE91NVAXQ",
        "firstName": "Dansteve",
        "username": "example@email.com",
        "lastName": "Adekanbi",
        "gender": "Male",
        "phoneNumber": "0123456789",
        "age": "36",
        "otp": null,
        "address": {
          "id": "0f2951b1-d438-4e48-8291-12de59d5f7f4",
          "createdAt": "2023-08-20T12:08:26.000Z",
          "updatedAt": "2023-08-20T12:08:26.000Z",
          "userId": "054f4aa5-df93-4fcd-a4d7-ccfcaaab60c9",
          "search": null,
          "postcode": "B8 3QU",
          "latitude": 52,
          "longitude": -1,
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
        },
      }
    },
    "message": "Login successful",
    "status": 200
  };
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

    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = {
          ...{
            user: {
              ...param,
            }
          },
          ...this.staticUser,
        };
        resolve(data);
      });
    }
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
    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = { data: { ...this.staticUser.data.user } };
        resolve(data);
      });
    }
    return this.getRequestFromServe(this.apiBaseUrl + '/profile');
  }

  async getProfileById(username: string): Promise<GenericApiResponse<User> | ApiErrorResponse> {
    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = { ...this.staticUser.data };
        resolve(data);
      });
    }
    return this.getRequestFromServe(this.apiBaseUrl + `/users/${username}`);
  }

  async getProfileByUsername(username: string): Promise<GenericApiResponse<User> | ApiErrorResponse> {
    if (!environment.production) {
      return await new Promise((resolve, reject) => {
        const data: any = { ...this.staticUser.data};
        resolve(data);
      });
    }
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

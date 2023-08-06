/* eslint-disable guard-for-in */
import {
  HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Device, DeviceInfo } from '@capacitor/device';
import { NavController } from '@ionic/angular';
import { AuthenticatedToken } from "@peachy-healthcare/app-interface";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiService } from '../services/api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  deviceInfo: DeviceInfo | any = {};
  devicePlatform: any;

  constructor(private apiService: ApiService, public navController: NavController, public router: Router) {
    Device.getInfo().then((info: DeviceInfo) => {
      this.deviceInfo = info;
      console.log('deviceInfo: ', this.deviceInfo);
    }).catch((err) => {
      this.deviceInfo = this.apiService.deviceInfo ? this.apiService.deviceInfo : {};
    });
    console.log('deviceInfo: ', this.deviceInfo);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // execute this block if is not log in endpoint
    const excludedUrl: any[] = [
      `${environment.apiBaseUrl}/login`,
      `${environment.apiBaseUrl}/register`,
    ];

    this.devicePlatform = this.deviceInfo.platform
      ? this.deviceInfo.platform
      : 'android';
    const appVerCode =
      this.deviceInfo.appVersion &&
        this.deviceInfo.appVersion !== null &&
        this.deviceInfo.appVersion !== 'null' &&
        this.deviceInfo.appVersion !== ''
        ? this.deviceInfo.appVersion
        : '3.24.3';

    // console.log(req.method);
    const params = new HttpParams();
    if (req.method === 'GET' || req.method === 'POST') {

      //   params = new HttpParams()
      //     .set('appVersion', appVerCode || '')
      //     .set('appName', 'mande')
      //     .set('operatingSystem', this.deviceInfo.operatingSystem || '')
      //     .set('osVersion', this.deviceInfo.osVersion || '')
      //     .set('manufacturer', this.deviceInfo.manufacturer || '')
      //     .set('model', this.deviceInfo.model || '')
      //     .set('platform', this.deviceInfo.platform || '')
      //     .set('uuid', this.deviceInfo.uuid || '');
    }

    if (excludedUrl.indexOf(req.url) === -1) {
      let authToken = '';
      console.log('this.apiService.accessToken: ', this.apiService.accessToken);
      if (!this.apiService.accessToken) {
        this.apiService.getAuthenticatedToken().then((authenticatedToken: AuthenticatedToken) => {
          authToken = authenticatedToken?.token || '';
        });
      } else {
        authToken = this.apiService.accessToken?.token || '';
      }

      console.log('authToken: ', authToken);

      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
        params,
      });


      return next.handle(authReq).pipe(
        catchError(this.httpHandleError)
      );

    } else {
      const paramReq = req.clone({ params });
      return next.handle(paramReq).pipe(
        catchError(this.httpHandleError)
      );
    }
  }

  private httpHandleError(error: HttpErrorResponse) {
    let result = null;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      result = error.error;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, body was: ${JSON.stringify(
          error
        )}`
      );
      let content = null;
      if (error.error.message) {
        if ((!error.error.success && error.error.message === 'Failed validation.')
          || (!error.error.success && error.error.message === 'The given data was invalid.')
        ) {
          content = '';
          // tslint:disable-next-line:forin
          for (const i in error.error.errors) {
            content += `${error.error.errors[i]} <br>`;
          }
          // tslint:disable-next-line:forin
          for (const i in error.error.error) {
            content += `${error.error.error[i]} <br>`;
          }
          // tslint:disable-next-line:forin
          for (const i in error.error.data) {
            content += `${error.error.data[i]} <br>`;
          }
        } else if (!error.error.success) {
          content = error.error.message;
        }
        if (!error.error.success && (error.error.message.includes('resource not found')
          // || error.error.message.includes('not found')
        )) {
          content = 'We are unable to perform the operation now. Kindly try again later...';
        }
      }
      result = {
        status: error.status,
        success: false,
        title: error.error.title ? error.error.title : 'Oops!',
        message: content
          ? content
          : 'Sorry, We are unable to perform the operation now. Please try again later...',
      };
      console.log(result);
    }
    // return an observable with a userDataState-facing error message
    return throwError(result);
  }

}

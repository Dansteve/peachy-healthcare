// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: '/api',
  getAddress: {
    url: 'https://api.getAddress.io',
    key: '4u84h8epNEqKtp5hOIsJbQ40108'
  },
  isPwa: true,
  appVerCode: '1.0',
  defaultImageUrl: '',
  cryptoInfo: {
    keyId: 'test',
    salt: '4321',
    keySize: 256,
    iterations: 23,
    keys: 'UbfKIjpofcgPrFAgk46P+hNM/Hs=',
    iv: '12345678909876541234567890987654',
  },
  firebase: {
    apiKey: "AIzaSyDXCTo5_s9YQUcjbv9eFtBn9lYz5VIDAJo",
    authDomain: "peachy-healthcare-2023.firebaseapp.com",
    projectId: "peachy-healthcare-2023",
    storageBucket: "peachy-healthcare-2023.appspot.com",
    messagingSenderId: "592694427250",
    appId: "1:592694427250:web:adb3c37a2ff54e1d8b4ceb",
    measurementId: "G-6DTX7KMTN3"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

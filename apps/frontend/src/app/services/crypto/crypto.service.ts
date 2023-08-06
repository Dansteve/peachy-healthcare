// tslint:disable: no-redundant-jsdoc
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { v4 as NEW_UUID } from 'uuid';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private keyId = environment.cryptoInfo.keyId;
  private salt = '4321';
  private keySize = 256;
  private iterations = 23;
  private keys = 'UbfKIjpofcgPrFAgk46P+hNM/Hs=';
  private iv = '12345678909876541234567890987654';
  constructor() {
    this.keyId = environment.cryptoInfo.keyId;
    this.salt = environment.cryptoInfo.salt;
    this.keySize = environment.cryptoInfo.keySize;
    this.iterations = environment.cryptoInfo.iterations;
    this.keys = environment.cryptoInfo.keys;
    this.iv = environment.cryptoInfo.iv;
  }

  /**
   *
   *
   * @param value
   * @param [keys=null]
   * @returns encrypted string
   * @memberof CryptoService
   */
  set(value: string, keys?: string): string {
    let key: CryptoJS.lib.WordArray;
    let iv: CryptoJS.lib.WordArray;
    if (keys) {
      key = CryptoJS.enc.Utf16.parse(keys);
      iv = CryptoJS.enc.Utf16.parse(keys);
      CryptoJS.enc.Utf16.parse(keys);
    } else {
      key = CryptoJS.enc.Utf16.parse(this.keys);
      iv = CryptoJS.enc.Utf16.parse(this.iv);
    }
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16.parse(value.toString()), key, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  /**
   *
   *
   * @param value
   * @param [keys=null]
   * @returns decrypted string
   * @memberof CryptoService
   */
  // get decrypted string;
  get(value: string, keys?: string): string {
    let key: CryptoJS.lib.WordArray;
    let iv: CryptoJS.lib.WordArray;
    if (keys) {
      key = CryptoJS.enc.Utf16.parse(keys);
      iv = CryptoJS.enc.Utf16.parse(keys);
      CryptoJS.enc.Utf16.parse(keys);
    } else {
      key = CryptoJS.enc.Utf16.parse(this.keys);
      iv = CryptoJS.enc.Utf16.parse(this.iv);
    }
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf16);
  }

  encrypt(plaintext: string, password: string = this.keyId) {
    // console.log(plaintext, password);
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(this.salt), {
      keySize: this.keySize / 32,
      iterations: this.iterations
    });
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: CryptoJS.enc.Hex.parse(this.iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    // console.log('encrypted: ' + encrypted);
    const c = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    // console.log(c);
    return c;
  }

  decrypt(encryptedText: string, password: string = this.keyId) {
    try {
      const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(this.salt), {
        keySize: this.keySize / 32,
        iterations: this.iterations
      });
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
      });
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: CryptoJS.enc.Hex.parse(this.iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      // console.log(e);
      const c = { code: 1, message: 'unable to convert string to json', author: 'CryptoService -> decrypt ', e };
      return JSON.stringify(c);
    }
  }

  encryptPayload(unencryptedBodyRequest: any, password: string = this.keyId) {
    console.log(unencryptedBodyRequest);
    return this.encrypt(JSON.stringify(unencryptedBodyRequest), password);
  }

  decryptPayload(responseBody: string, password: string = this.keyId): any {
    const decryptString = this.decrypt(responseBody, password);
    return this.isJson(decryptString) ? JSON.parse(decryptString) :
      { code: 1, message: 'unable to convert string to json', author: 'CryptoService -> decryptPayload ' };
  }

  isJson(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   *
   *
   * @param [length=11]
   * @param [caseType=0] possible value = 0, 1, 2, 3, 4
   * @returns
   * @memberof CryptoService
   */
  generateRandomString(length = 16, caseType = 5): string {
    let pass: any = '';
    let characters: string;
    const fullCharacters = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '/!@#$%^&*()-+<>'];
    switch (caseType) {
      case 0: {
        characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
        break;
      }
      case 1: {
        characters = fullCharacters[0];
        break;
      }
      case 2: {
        characters = fullCharacters[0] + fullCharacters[1];
        break;
      }
      case 3: {
        characters = fullCharacters[0] + fullCharacters[2];
        break;
      }
      case 4: {
        characters = fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
        break;
      }
      case 5: {
        characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2];
        break;
      }
      default: {
        characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
        break;
      }
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      pass += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return pass;
  }

  uuidv4() {
    return NEW_UUID();
  }

}

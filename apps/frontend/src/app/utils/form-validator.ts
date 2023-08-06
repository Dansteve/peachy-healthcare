/* eslint-disable max-len */
import { AbstractControl } from '@angular/forms';
import { isNil } from './functional';

export const zipCodeRegex = /^[0-9']{5}$/;

export const nameRegex = /^[a-zA-Z- ']+$/;

export const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-username-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-username-addresses/201378#201378
// https://en.wikipedia.org/wiki/Email_address  The format of an username address is local-part@domain, where the
// local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
export const emailTestValidator = (username: string, customRegex?: RegExp) => {
  if (!username) {
    return false;
  }

  const emailParts = username.split('@');

  if (emailParts.length !== 2) {
    return false;
  }

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) {
    return false;
  } else if (address.length > 255) {
    return false;
  }

  const domainParts = address.split('.');
  if (domainParts.some(part => part.length > 63)) {
    return false;
  }
  if (!(customRegex || emailRegex).test(username)) { return false; }

  return true;
};

export const matchRegExpPattern = (input: string, testCase: RegExp): boolean => testCase.test(input);

export const validateInputWithReqExp = (control: AbstractControl) => (regExp: RegExp): boolean => !isNil(control?.value) && matchRegExpPattern(control.value, regExp);

export const isValidZipCode = (control: AbstractControl): boolean => validateInputWithReqExp(control)(zipCodeRegex);

export const isValidName = (control: AbstractControl): boolean => validateInputWithReqExp(control)(nameRegex);

export const isValidEmail = (control: AbstractControl, customRegex: RegExp = emailRegex): boolean => !isNil(control?.value) && emailTestValidator(control?.value, customRegex);


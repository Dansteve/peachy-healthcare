import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isValidEmail } from '../../utils/form-validator';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  constructor(
  ) {
    //noop
  }

  public static emailValidator(control: AbstractControl) {
    if (control.value && isValidEmail(control)) {
      return null;
    } else {
      return { required: true, invalidEmail: true };
    }
  }


  public getValidatorErrorMessage(validatorName: string, validatorValue?: ValidationErrors): string | boolean {
    const errorMessages: { [key: string]: string | boolean; } = {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid username address',
      minlength: `minlength ${validatorValue?.requiredLength}`,
      maxlength: `maxlength ${validatorValue?.requiredLength}`,
    };

    return errorMessages[validatorName];
  }
}

import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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

  public static passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any; } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}

import { FormGroup } from '@angular/forms';

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // If the matching control already has errors other than 'confirmPasswordValidator', return
    if (matchingControl.errors && !matchingControl.errors['confirmPasswordValidator']) {
      return;
    }

    // If the values don't match, set an error on the matching control
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      // If the values match, clear the error on the matching control
      matchingControl.setErrors(null);
    }
  };
}

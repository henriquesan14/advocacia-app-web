import { FormGroup } from "@angular/forms";

export class ConfirmPasswordValidators{
  static confirmPasswordValidator(control: FormGroup): { [key: string]: any } | null {
    const password = control.get('senha');
    const confirmPassword = control.get('confirmSenha');
    
    if (!password?.value || !confirmPassword?.value) { // if the password or confirmation has not been inserted ignore
      return null;
    }
    if (confirmPassword.value.length > 0 && confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ notMatch: true }); // set the error in the confirmation input/control
    }

    return null;
  }
}
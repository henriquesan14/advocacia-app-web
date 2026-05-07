import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export class ConfirmPasswordValidators {

  static confirmPasswordValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const password = control.get('senha');
      const confirmPassword = control.get('confirmSenha');

      if (!password || !confirmPassword) {
        return null;
      }

      // evita validar antes de preencher confirmação
      if (!confirmPassword.value) {
        return null;
      }

      if (password.value !== confirmPassword.value) {

        confirmPassword.setErrors({
          ...confirmPassword.errors,
          notMatch: true
        });

        return { notMatch: true };
      }

      if (confirmPassword.errors?.['notMatch']) {

        const errors = { ...confirmPassword.errors };

        delete errors['notMatch'];

        confirmPassword.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }

      return null;
    };
  }
}
import { ValidatorFn, AbstractControl } from '@angular/forms';

// Função que retorna um validador de data futura
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    const inputDate = new Date(control.value);

    if (control.value && inputDate > currentDate) {
      return { 'futureDate': true }; // Retorna um erro se a data inserida for no passado ou no presente
    }

    return null; // Retorna null se a data inserida for no futuro
  };
}
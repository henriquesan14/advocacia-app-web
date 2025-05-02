import { AbstractControl } from "@angular/forms";

export class CustomValidators {
    static cpfCnpj(control: AbstractControl): { [key: string]: any } | null {
      if(!control.value) return null;
      const cpfCnpj = control.value.replace(/[^\d]+/g, '');
  
      if (cpfCnpj.length === 11) {
        // CPF
        let sum = 0;
        let remainder: number;
  
        for (let i = 1; i <= 9; i++) {
          sum += parseInt(cpfCnpj.substring(i - 1, i), 10) * (11 - i);
        }
  
        remainder = (sum * 10) % 11;
  
        if ((remainder === 10) || (remainder === 11)) {
          remainder = 0;
        }
  
        if (remainder !== parseInt(cpfCnpj.substring(9, 10), 10)) {
          return { 'cpfCnpj': true };
        }
  
        sum = 0;
        for (let i = 1; i <= 10; i++) {
          sum += parseInt(cpfCnpj.substring(i - 1, i), 10) * (12 - i);
        }
  
        remainder = (sum * 10) % 11;
  
        if ((remainder === 10) || (remainder === 11)) {
          remainder = 0;
        }
  
        if (remainder !== parseInt(cpfCnpj.substring(10, 11), 10)) {
          return { 'cpfCnpj': true };
        }
      } else if (cpfCnpj.length === 14) {
        // CNPJ
        let size = cpfCnpj.length - 2;
        let numbers = cpfCnpj.substring(0, size);
        let digits = cpfCnpj.substring(size);
        let sum = 0;
        let pos = size - 7;
  
        for (let i = size; i >= 1; i--) {
          sum += parseInt(numbers.charAt(size - i), 10) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }
  
        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  
        if (result !== parseInt(digits.charAt(0), 10)) {
          return { 'cpfCnpj': true };
        }
  
        size = size + 1;
        numbers = cpfCnpj.substring(0, size);
        sum = 0;
        pos = size - 7;
  
        for (let i = size; i >= 1; i--) {
          sum += parseInt(numbers.charAt(size - i), 10) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }
  
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  
        if (result !== parseInt(digits.charAt(1), 10)) {
          return { 'cpfCnpj': true };
        }
      } else {
        return { 'cpfCnpj': true };
      }
  
      return null;
    }
  }
import { AbstractControl, ValidatorFn } from "@angular/forms";

export function enderecoValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const { cep, logradouro, numero, cidade, estado, bairro, complemento } = control.value;
      const hasAtLeastOneField = cep || logradouro || numero || cidade || estado || bairro || complemento;
      
      // Se pelo menos um campo estiver preenchido, então todos devem estar presentes
      if (hasAtLeastOneField && (!cep || !logradouro || !numero || !cidade || !estado || !bairro)) {
        return { enderecoIncompleto: true };
      }
      
      return null;
    };
  }

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideCpf',
  standalone: true
})
export class HideCpfPipe implements PipeTransform {

  transform(value: string): unknown {
    if (!value) {
      return value;
    }

    if (value.length === 14) {
      return `***.***.***-${value.slice(-2)}`;
    }

    // Se for CNPJ (14 dígitos formatado como 00.000.000/0000-00)
    if (value.length === 18) {
      return `**.***.***/****-${value.slice(-2)}`;
    }

    // Retorna o valor original se não for CPF nem CNPJ esperado
    return value;
  }

}

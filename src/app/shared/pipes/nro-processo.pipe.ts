import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nroProcesso', standalone: true })
export class NroProcessoPipe implements PipeTransform {
  transform(numero: string): string {
    if (!numero) return '';

    // Remover todos os caracteres não numéricos
    const numeroProcessoLimpo = numero.replace(/\D/g, '');

    // Formatar o número do processo no formato desejado
    const formato = '0000000.00.0000.0.00.0000';
    let resultado = '';
    let indice = 0;

    for (let i = 0; i < formato.length; i++) {
      if (formato[i] === '0') {
        if (indice < numeroProcessoLimpo.length) {
          resultado += numeroProcessoLimpo[indice];
          indice++;
        } else {
          resultado += '0';
        }
      } else {
        resultado += formato[i];
      }
    }

    return resultado;
  }
}
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ResponsePage } from '../../core/models/response-page.interface';
import { Processo } from '../../core/models/processo.interface';
import { ProcessosService } from '../services/processos.service';

export function existingProcessValidator(processoService: ProcessosService) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (control.value && control.value.length === 20) {
            const params = { nroProcesso: control.value };
            return processoService.getProcessos(params).pipe(
                map((response: ResponsePage<Processo>) => {
                    return response.items && response.items.length > 0 ? { existingProcess: true } : null;
                })
            );
        } else {
            return of(null);
        }
    };
}
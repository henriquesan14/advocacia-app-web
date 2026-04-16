import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GanhoService } from '../../../shared/services/ganho.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxMaskDirective } from 'ngx-mask';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Ganho } from '../../../core/models/ganho.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-form-ganho',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NgxMaskDirective, BtnCadastrarComponent, NzDatePickerModule, NzButtonModule],
  templateUrl: './modal-form-ganho.component.html',
  styleUrl: './modal-form-ganho.component.scss',
  providers: [DatePipe]
})
export class ModalFormGanhoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;

  loading = false;
  mask: string = '';

  constructor(private formBuilder: FormBuilder,
    private ganhoService: GanhoService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private modal: NzModalRef, private datePipe: DatePipe, @Inject(NZ_MODAL_DATA) public data: { ganhoId: string }) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fonte: [null, Validators.required],
      valor: [null, [Validators.required]],
      dataRecebimento: [null, [Validators.required]],
      status: [null, Validators.required],
      nroProcesso: [null]
    });
    if (this.data.ganhoId) {
      this.getGanho();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGanho() {
    this.loading = true;
    this.ganhoService.getById(this.data.ganhoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.form.get('fonte')?.setValue(res.fonte);
          this.form.get('valor')?.setValue(res.valor);

          const dataRecebimento = new Date(res.dataRecebimento).toISOString().split('T')[0];
          this.form.get('dataRecebimento')?.setValue(dataRecebimento);

          this.form.get('status')?.setValue(res.status);

          if (res.processo) {
            this.form.get('nroProcesso')?.setValue(res.processo.nroProcesso);
          }
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  submit() {
    if (this.form.valid) {
      const rawValue = this.form.get('valor')?.value;
      let valorSemPrefixo = rawValue.toString();

      // Verifica se o valor contém o prefixo 'R$' ou espaços antes de formatar
      if (/R\$\s?\d/.test(valorSemPrefixo)) {
        valorSemPrefixo = valorSemPrefixo.replace(/[R$\s]/g, '').replace('.', '').replace(',', '.');
      }

      const formValue = {
        ...this.form.value,
        nroProcesso: this.form.value.nroProcesso?.replace(/\D/g, '') || null,
        valor: valorSemPrefixo,
        dataRecebimento: this.datePipe.transform(this.form.value.dataRecebimento, 'yyyy-MM-dd'),
        id: this.data.ganhoId
      }
      if(this.data.ganhoId){
        this.updateGanho(formValue); 
        return;
      }
      this.addGanho(formValue);
    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  addGanho(ganho: Ganho){
    this.ganhoService.addGanho(ganho).subscribe({
      next: () => {
        this.toastr.success('Ganho cadastrado!', 'Sucesso!');
        this.modal.close(true);
      },
      error:() => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
  
  updateGanho(ganho: Ganho){
    this.ganhoService.updateGanho(ganho).subscribe({
      next: () => {
        this.toastr.success('Ganho atualizado!', 'Sucesso!');
        this.modal.close(true);
      },
      error:() => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.form, fieldName);
  }

  getError(field: string, validation: string) {
    return this.form.get(field)?.hasError(validation);
  }
}

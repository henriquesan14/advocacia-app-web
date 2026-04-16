import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { DespesaService } from '../../../shared/services/despesa.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxMaskDirective } from 'ngx-mask';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { FormUtils } from '../../../shared/utils/form.utils';
import { ToastrService } from 'ngx-toastr';
import { Despesa } from '../../../core/models/despesa.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-modal-form-despesa',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NgxMaskDirective, BtnCadastrarComponent, NzDatePickerModule, NzButtonModule],
  templateUrl: './modal-form-despesa.component.html',
  styleUrl: './modal-form-despesa.component.scss',
  providers: [DatePipe]
})
export class ModalFormDespesaComponent implements OnInit {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  
  loading = false;
  mask: string = '';
  
  constructor(private formBuilder: FormBuilder, 
    private despesaService: DespesaService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private modal: NzModalRef, private datePipe: DatePipe, @Inject(NZ_MODAL_DATA) public data: { despesaId: string }){
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipo: [null, Validators.required],
      valor: [null, [Validators.required]],
      dataVencimento: [null,[Validators.required]],
      dataPagamento: [null],
      status:[null, Validators.required],
      observacoes:[null],
      nroProcesso: [null]
    });
    if(this.data.despesaId){
      this.getDespesa();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDespesa(){
    this.loading = true;
    this.despesaService.getById(this.data.despesaId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.form.get('tipo')?.setValue(res.tipo);
        this.form.get('valor')?.setValue(res.valor);

        const dataVencimento = new Date(res.dataVencimento).toISOString().split('T')[0];
        this.form.get('dataVencimento')?.setValue(dataVencimento);

        if(res.dataPagamento){
          const dataPagamento = new Date(res.dataPagamento).toISOString().split('T')[0];
          this.form.get('dataPagamento')?.setValue(dataPagamento);
        }

        this.form.get('status')?.setValue(res.status);
        this.form.get('observacoes')?.setValue(res.observacoes);

        if(res.processo){
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

  submit(){
    if(this.form.valid){
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
        dataVencimento: this.datePipe.transform(this.form.value.dataVencimento, 'yyyy-MM-dd'),
        dataPagamento: this.datePipe.transform(this.form.value.dataPagamento, 'yyyy-MM-dd'),
        id: this.data.despesaId
      }
      if(this.data.despesaId){
        this.updateDespesa(formValue); 
        return;
      }
      this.addDespesa(formValue);
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  addDespesa(despesa: Despesa){
      this.despesaService.addDespesa(despesa).subscribe({
        next: () => {
          this.toastr.success('Despesa cadastrada!', 'Sucesso!');
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

  updateDespesa(despesa: Despesa){
    this.despesaService.updateDespesa(despesa).subscribe({
      next: () => {
        this.toastr.success('Despesa atualizada!', 'Sucesso!');
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

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.form, fieldName);
  }

  getError(field: string, validation: string){
    return this.form.get(field)?.hasError(validation);
  }
}

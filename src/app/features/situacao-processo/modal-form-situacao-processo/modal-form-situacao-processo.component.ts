import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { SituacaoProcesso } from '../../../core/models/situacao-processo.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-form-situacao-processo',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-situacao-processo.component.html',
  styleUrl: './modal-form-situacao-processo.component.css'
})
export class ModalFormSituacaoProcessoComponent {
  form!: FormGroup;
  @Input() situacao!: SituacaoProcesso;

  constructor(private situacaoService: SituacaoProcessoService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
    })
    if(this.situacao){
      this.form.get('descricao')?.setValue(this.situacao.descricao);
    }
  }

  submit() {
    if (this.form.valid) {
      this.spinner.show();
      if (this.situacao) {
        this.updateSituacao();
        return;
      }
      this.addSituacao();
    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  addSituacao() {
    this.situacaoService.addSituacao(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Situação cadastrada!', 'Sucesso!');
        this.modal.close(true);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  updateSituacao() {
    this.situacaoService.updateSituacao({
      id: this.situacao.id,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Situação atualizada!', 'Sucesso!');
        this.modal.close(true);
      },
      error: () => {
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
}

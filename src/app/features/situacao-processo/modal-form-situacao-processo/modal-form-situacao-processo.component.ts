import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-form-situacao-processo',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-situacao-processo.component.html',
  styleUrl: './modal-form-situacao-processo.component.css'
})
export class ModalFormSituacaoProcessoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;

  constructor(private situacaoService: SituacaoProcessoService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { situacaoId: string }
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
    })
    if(this.data.situacaoId){
      this.getSituacao();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.form.valid) {
      this.spinner.show();
      if (this.data.situacaoId) {
        this.updateSituacao();
        return;
      }
      this.addSituacao();
    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  getSituacao() {
      this.spinner.show();
      this.situacaoService.getSituacaoProcessoById(this.data.situacaoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.form.get('descricao')?.setValue(res.descricao);
          },
          error: () => {
            this.spinner.hide();
          },
          complete: () => {
            this.spinner.hide();
          }
        })
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
      id: this.data.situacaoId,
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

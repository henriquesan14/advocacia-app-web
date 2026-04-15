import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompetenciaService } from '../../../shared/services/competencia.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-form-competencia',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-competencia.component.html',
  styleUrl: './modal-form-competencia.component.css'
})
export class ModalFormCompetenciaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;

  constructor(private competenciaService: CompetenciaService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private modal: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { competenciaId: string }) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });

    if (this.data.competenciaId) {
      this.getCompetencia();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if(this.form.valid){
      this.spinner.show();
      if(this.data.competenciaId){
       this.updateCompetencia(); 
       return;
      }
      this.addCompetencia();
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  getCompetencia() {
    this.spinner.show();
    this.competenciaService.getCompetenciaById(this.data.competenciaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.form.get('nome')?.setValue(res.nome);
        },
        error: () => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      })
  }

  addCompetencia() {
    this.competenciaService.addCompetencia(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Competência cadastrada!', 'Sucesso!');
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

  updateCompetencia() {
    this.competenciaService.updateCompetencia({
      id: this.data.competenciaId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Competência atualizada!', 'Sucesso!');
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

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.form, fieldName);
  }
}

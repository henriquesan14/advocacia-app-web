import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompetenciaService } from '../../../shared/services/competencia.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { Competencia } from '../../../core/models/competencia.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-form-competencia',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-competencia.component.html',
  styleUrl: './modal-form-competencia.component.css'
})
export class ModalFormCompetenciaComponent {
  form!: FormGroup;

  @Input() competencia!: Competencia;

  constructor(private competenciaService: CompetenciaService, private formBuilder: FormBuilder, private toastr: ToastrService,
     private spinner: NgxSpinnerService, private modal: NzModalRef) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });

    if(this.competencia){
      this.form.get('nome')?.setValue(this.competencia.nome);
    }
  }

  submit() {
    if (this.form.valid) {
      this.spinner.show();
      if (this.competencia) {
        this.updateCompetencia();
        return;
      }
      this.addCompetencia();
    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
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
      id: this.competencia.id,
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

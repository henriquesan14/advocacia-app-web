import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { SistemaService } from '../../../shared/services/sistema.service';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-form-sistema',
  standalone: true,
  imports: [ NgxSpinnerModule, ReactiveFormsModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-sistema.component.html',
  styleUrl: './modal-form-sistema.component.css'
})
export class ModalFormSistemaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;

  constructor(private sistemaService: SistemaService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { sistemaId: string }
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });
    if(this.data.sistemaId){
      this.getSistema();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(){
    if(this.form.valid){
      this.spinner.show();
      if(this.data.sistemaId){
        this.updateSistema();
        return;
      }
      this.addSistema();
      
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }
  
  getSistema(){
    this.spinner.show();
    this.sistemaService.getSistemaById(this.data.sistemaId)
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

  addSistema(){
    this.sistemaService.addSistema(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Sistema cadastrado!', 'Sucesso!');
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

  updateSistema(){
    this.sistemaService.updateSistema({
      id: this.data.sistemaId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Sistema atualizado!', 'Sucesso!');
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
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { SistemaService } from '../../../shared/services/sistema.service';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { Sistema } from '../../../core/models/sistema.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-form-sistema',
  standalone: true,
  imports: [ NgxSpinnerModule, ReactiveFormsModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './modal-form-sistema.component.html',
  styleUrl: './modal-form-sistema.component.css'
})
export class ModalFormSistemaComponent {
  form!: FormGroup;
  
  @Input() sistema!: Sistema;

  constructor(private sistemaService: SistemaService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });
    if(this.sistema){
      this.form.get('nome')?.setValue(this.sistema.nome);
    }
  }

  submit(){
    if(this.form.valid){
      this.spinner.show();
      if(this.sistema){
        this.updateSistema();
        return;
      }
      this.addSistema();
      
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
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
      id: this.sistema.id,
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

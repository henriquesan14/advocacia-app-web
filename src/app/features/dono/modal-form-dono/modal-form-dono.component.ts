import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DonoService } from '../../../shared/services/dono.service';
import { ToastrService } from 'ngx-toastr';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { Dono } from '../../../core/models/dono.interface';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-modal-form-dono',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule],
  templateUrl: './modal-form-dono.component.html',
  styleUrl: './modal-form-dono.component.css'
})
export class ModalFormDonoComponent {
  form!: FormGroup;

  @Output() submitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dono!: Dono;

  constructor(private donoService: DonoService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });
    if(this.dono){
      this.form.get('nome')?.setValue(this.dono.nome);
    }
  }

  submit(){
    if(this.form.valid){
      this.spinner.show();
      if(this.dono){
        this.updateDono();
        return;
      }
      this.addDono();
      
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  addDono(){
    this.donoService.cadastrarDono(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Dono cadastrado!', 'Sucesso!');
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

  updateDono(){
    this.donoService.atualizarDono({
      id: this.dono.id,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Dono atualizado!', 'Sucesso!');
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

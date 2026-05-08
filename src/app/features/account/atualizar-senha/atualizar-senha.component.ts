import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { BtnVoltarComponent } from '../../../shared/components/btn-voltar/btn-voltar.component';
import { ConfirmPasswordValidators } from '../../../shared/validators/confirm-password.validator';
import { AccountService } from '../../../shared/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-atualizar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, BtnVoltarComponent, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './atualizar-senha.component.html',
  styleUrl: './atualizar-senha.component.css'
})
export class AtualizarSenhaComponent implements OnInit {
  formUpdatePassword!: FormGroup;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private accountService: AccountService, private toastr: ToastrService){

  }

  ngOnInit(): void {
    this.formUpdatePassword = this.formBuilder.nonNullable.group(
      {
        senhaAtual: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmSenha: ['', Validators.required]
      },
      {
        validators: ConfirmPasswordValidators.confirmPasswordValidator()
      }
    );
  }

  submit(){
    if(this.formUpdatePassword.valid){
      this.spinner.show();
      this.accountService.atualizarSenha({
        senhaAtual: this.formUpdatePassword.get('senhaAtual')?.value,
        senhaNova: this.formUpdatePassword.get('senha')?.value
      }).subscribe({
        next: () => {
          this.formUpdatePassword.reset();
          this.toastr.success('Senha atualizada!', 'Sucesso');
        },
        error: () => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      })
    }else{
      FormUtils.markFormGroupTouched(this.formUpdatePassword);
    }
  }

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.formUpdatePassword, fieldName);
  }

  getError(field: string, validation: string){
    return this.formUpdatePassword.get(field)?.hasError(validation);
  }
}

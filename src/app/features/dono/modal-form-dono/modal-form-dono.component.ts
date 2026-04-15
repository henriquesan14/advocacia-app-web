import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DonoService } from '../../../shared/services/dono.service';
import { ToastrService } from 'ngx-toastr';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-form-dono',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule],
  templateUrl: './modal-form-dono.component.html',
  styleUrl: './modal-form-dono.component.css'
})
export class ModalFormDonoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;

  constructor(private donoService: DonoService, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private modal: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { donoId: string }
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
    });
    if(this.data.donoId){
      this.getDono();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(){
    if(this.form.valid){
      this.spinner.show();
      if(this.data.donoId){
        this.updateDono();
        return;
      }
      this.addDono();
      
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  getDono(){
    this.spinner.show();
    this.donoService.getDonoById(this.data.donoId)
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
      id: this.data.donoId,
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

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estado } from '../../../core/models/estado.interface';
import { EstadoService } from '../../../shared/services/estado.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ComarcaService } from '../../../shared/services/comarca.service';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { Subject, takeUntil } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-modal-form-comarca',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, BtnCadastrarComponent, NzFormModule, NzInputModule, NzSelectModule, NzButtonModule],
  templateUrl: './modal-form-comarca.component.html',
  styleUrl: './modal-form-comarca.component.css'
})
export class ModalFormComarcaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  estados: Estado[] = [];

  constructor(private comarcaService: ComarcaService, private formBuilder: FormBuilder, private toastr: ToastrService, 
    private spinner: NgxSpinnerService, private estadoService: EstadoService, private modal: NzModalRef,  @Inject(NZ_MODAL_DATA) public data: { comarcaId: string }){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      estadoId: ['', [Validators.required]]
    });
    this.getEstados();

    if(this.data.comarcaId){
      this.getComarca();
      
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getComarca(){
    this.spinner.show();
    this.comarcaService.getComarcaById(this.data.comarcaId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.form.get('nome')?.setValue(res.nome);
        this.form.get('estadoId')?.setValue(res.estadoId);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  getEstados(){
    this.estadoService.getEstados()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.estados = res;
      },
    });
  }

  submit(){
    if(this.form.valid){
      this.spinner.show();
      if(this.data.comarcaId){
       this.updateComarca(); 
       return;
      }
      this.addComarca();
    }else{
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  addComarca(){
      this.comarcaService.addComarca(this.form.value).subscribe({
        next: () => {
          this.toastr.success('Comarca cadastrada!', 'Sucesso!');
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

  updateComarca(){
    this.comarcaService.updateComarca({
      id: this.data.comarcaId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.toastr.success('Comarca atualizada!', 'Sucesso!');
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

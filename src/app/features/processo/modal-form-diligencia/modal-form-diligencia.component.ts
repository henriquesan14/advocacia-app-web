import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Usuario } from '../../../core/models/usuario.interface';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { DiligenciaService } from '../../../shared/services/diligencia.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Diligencia } from '../../../core/models/diligencia.interface';
import { DatePipe } from '@angular/common';
import { ToggleButtonComponent } from '../../../shared/components/toogle-button/toggle-button.component';
import { Subject, takeUntil } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';

@Component({
  selector: 'app-modal-form-diligencia',
  standalone: true,
  imports: [ReactiveFormsModule, BtnCadastrarComponent, NgxSpinnerModule, ToggleButtonComponent, NzFormModule, NzInputModule, NzButtonModule, NzDatePickerModule,
    NzTimePickerModule, NzGridModule, SelectAutocompleteComponent
  ],
  templateUrl: './modal-form-diligencia.component.html',
  styleUrl: './modal-form-diligencia.component.css',
  providers: [DatePipe]
})
export class ModalFormDiligenciaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  responsaveis: Usuario[] = [];
  filteredResponsaveis: Usuario[] = [];
  form!: FormGroup;
  time = { hour: 12, minute: 0 };

  date!: { year: number; month: number };

  @Output() submitEvent: EventEmitter<Diligencia> = new EventEmitter<Diligencia>();
  
  responsavelNome!: string;
  diaInteiro = false;
  presencial = false;

  constructor(private usuarioService: UsuariosService, private formBuilder: FormBuilder,
    private diligenciaService: DiligenciaService, private toastr: ToastrService, private spinner: NgxSpinnerService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { processoId: string, diligencia: Diligencia }) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
      dataDiligencia: [new Date(), Validators.required],
      horaDiligencia: [new Date(), Validators.required],
      responsavelId: [null, Validators.required],
      responsavelNome: [null],
      local: [null, Validators.required],
    });

    if (this.data.diligencia) {
      this.getDiligencia();
    }
    this.getResponsaveis();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChangeResponsavel(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.filteredResponsaveis = this.responsaveis.filter(u =>
      u.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  responsavelSelected(resonsavel: Usuario) {
    this.form.patchValue({
      responsavelId: resonsavel.id,
      responsavelNome: resonsavel.nome
    });
  }

  responsavelDeselected() {
    this.form.patchValue({
      responsavelId: null,
      responsavelNome: null
    });
  }

  get responsavelControl(): FormControl {
    return this.form.get('responsavelId') as FormControl;
  }

  getDiligencia() {
        this.form.get('descricao')?.setValue(this.data.diligencia.descricao);
        this.form.get('local')?.setValue(this.data.diligencia.local);
        this.form.get('responsavelId')?.setValue(this.data.diligencia.responsavelId);
        this.form.get('responsavelNome')?.setValue(this.data.diligencia.responsavel.nome);

        const data = new Date(this.data.diligencia.dataDiligencia);

        this.form.get('dataDiligencia')?.setValue(data);
        this.form.get('horaDiligencia')?.setValue(data);
        
        this.presencial = this.data.diligencia.presencial;
        this.diaInteiro = this.data.diligencia.diaInteiro;
  }


  getResponsaveis() {
    this.usuarioService.getResponsaveis(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Usuario[]) => {
          this.responsaveis = res;
          this.filteredResponsaveis = res;
        }
      })
  }

  submit() {
    if (this.form.valid) {
      if (!this.data.processoId) {
        const diligencia = {
          ...this.form.value,
          responsavel: {
            nome: this.form.get('responsavelNome')?.value
          },
          dataDiligencia: this.getDateFormatted(),
          diaInteiro: this.diaInteiro,
          presencial: this.presencial,
        }
        this.modalRef.close(diligencia);
        return;
      }

      if (this.data.diligencia) {
        this.updateDiligencia();
        return;
      }

      this.addDiligencia();

    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
  }


  addDiligencia() {
    this.spinner.show();
    const diligencia = {
      ...this.form.value,
      processoId: this.data.processoId,
      diaInteiro: this.diaInteiro,
      presencial: this.presencial,
      dataDiligencia: this.getDateFormatted(),
      responsavel: {
        nome: this.form.get('responsavelNome')?.value
      },
    }

    this.diligenciaService.addDiligencia(diligencia).subscribe({
      next: (res) => {
        this.toastr.success('Diligência adicionada!', 'Sucesso');
        diligencia.id = res.id;
        this.submitEvent.emit(diligencia);
        this.modalRef.close(diligencia);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  getDateFormatted(){
    const data = this.form.value.dataDiligencia;
    const hora = this.form.value.horaDiligencia;

    let dataDiligencia: string;

    if (!this.diaInteiro && hora) {
      const dataObj = new Date(data);
      const horaObj = new Date(hora);

      dataObj.setHours(horaObj.getHours(), horaObj.getMinutes(), 0, 0);
      dataDiligencia = `${dataObj.getFullYear()}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}T${dataObj.getHours().toString().padStart(2, '0')}:${dataObj.getMinutes().toString().padStart(2, '0')}:00`;
    } else {
      const dataObj = new Date(data);
      dataObj.setHours(0, 0, 0, 0);

      dataDiligencia = `${dataObj.getFullYear()}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}T00:00:00`;
    }

    return dataDiligencia;
  }

  updateDiligencia() {
    this.spinner.show();
    const diligencia = {
      ...this.form.value,
      processoId: this.data.processoId,
      id: this.data.diligencia.id,
      dataDiligencia: this.getDateFormatted(),
      diaInteiro: this.diaInteiro,
      presencial: this.presencial,
      responsavel: {
        nome: this.form.get('responsavelNome')?.value
      },
    }

    this.diligenciaService.updateDiligencia(diligencia).subscribe({
      next: () => {
        this.toastr.success('Diligência atualizada!', 'Sucesso');
        this.modalRef.close(diligencia);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  responsavelSelecionado(responsavel: any) {
    this.form.get('responsavelNome')?.setValue(responsavel.nome);
    this.form.get('responsavelId')?.setValue(responsavel.id);
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.form, fieldName);
  }

  toggleDiaInteiro(event: any) {
    this.diaInteiro = event;
  }

  togglePresencial(event: any) {
    this.presencial = event;
  }

  getStatus(controlName: string): 'error' | null {
    const control = this.form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched) ? 'error' : null;
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
import { DateUtils } from '../../../shared/utils/date.utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-form-diligencia',
  standalone: true,
  imports: [ReactiveFormsModule, BtnCadastrarComponent, NgxSpinnerModule, ToggleButtonComponent, NzFormModule, NzInputModule, NzButtonModule, NzDatePickerModule,
    NzTimePickerModule, NzAutocompleteModule, NzGridModule
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
  @Input() processoId!: number;
  @Input() diligenciaId!: number;
  responsavelNome!: string;
  diaInteiro = false;
  presencial = false;

  constructor(private usuarioService: UsuariosService, private formBuilder: FormBuilder,
    private diligenciaService: DiligenciaService, private toastr: ToastrService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private modalRef: NzModalRef) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descricao: [null, Validators.required],
      dataDiligencia: [new Date(), Validators.required],
      horaDiligencia: [new Date(), Validators.required],
      responsavelId: [null, Validators.required],
      responsavelNome: [null],
      local: [null, Validators.required],
    });

    if (this.diligenciaId) {
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


  selecionarResponsavel(event: any): void {
    const nome = event.nzValue;
    const responsavel = this.responsaveis.find(d => d.nome === nome);
    if (responsavel) {
      this.form.patchValue({
        responsavelId: responsavel.id,
        responsavelNome: responsavel.nome
      });
    }
  }

  get responsavelNomeControl(): FormControl {
    return this.form.get('responsavelNome') as FormControl;
  }

  getDiligencia() {
    this.diligenciaService.getById(this.diligenciaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Diligencia) => {
          this.form.get('descricao')?.setValue(res.descricao);
          this.form.get('local')?.setValue(res.local);
          this.form.get('responsavelId')?.setValue(res.responsavelId);
          this.form.get('responsavel')?.setValue(res.responsavel);
          // DateUtils.setDataHora(res.dataDiligencia, this.dp, this.form, 'dataDiligencia', 'horaDiligencia');
          this.responsavelNome = res.responsavel.nome;
          this.presencial = res.presencial;
          this.diaInteiro = res.diaInteiro;
        }
      })
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

  addDiligencia() {
    this.spinner.show();
    // const dateFormatted = DateUtils.getDatetimeFormatted(this.form, 'dataDiligencia', 'horaDiligencia', this.diaInteiro);
    const diligencia = {
      ...this.form.value,
      processoId: this.processoId,
      // dataDiligencia: dateFormatted,
      diaInteiro: this.diaInteiro,
      presencial: this.presencial
    }

    this.diligenciaService.addDiligencia(diligencia).subscribe({
      next: () => {
        this.toastr.success('Diligência adicionada!', 'Sucesso');
        this.submitEvent.emit(this.form.value);
        // this.activeModal.close();
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  updateDiligencia() {
    this.spinner.show();
    // const dateFormatted = DateUtils.getDatetimeFormatted(this.form, 'dataDiligencia', 'horaDiligencia', this.diaInteiro);
    const diligencia = {
      ...this.form.value,
      processoId: this.processoId,
      id: this.diligenciaId,
      // dataDiligencia: dateFormatted,
      diaInteiro: this.diaInteiro,
      presencial: this.presencial
    }

    this.diligenciaService.updateDiligencia(diligencia).subscribe({
      next: () => {
        this.toastr.success('Diligência atualizada!', 'Sucesso');
        this.submitEvent.emit(this.form.value);
        // this.activeModal.close();
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  submit() {
    if (this.form.valid) {
      // const formattedDate = DateUtils.getDatetimeFormatted(this.form, 'dataDiligencia', 'horaDiligencia', this.diaInteiro);
      if (!this.processoId) {
        const diligencia = {
          ...this.form.value,
          responsavel: {
            nome: this.form.get('responsavelNome')?.value
          },
          diaInteiro: this.diaInteiro,
          presencial: this.presencial
        }
        this.modalRef.close(diligencia);
        return;
      }

      if (this.diligenciaId) {
        this.updateDiligencia();
        return;
      }

      this.addDiligencia();

    } else {
      FormUtils.markFormGroupTouched(this.form);
    }
  }

  responsavelSelecionado(responsavel: any) {
    console.log(responsavel)
    this.form.get('responsavelNome')?.setValue(responsavel.nome);
    this.form.get('responsavelId')?.setValue(responsavel.id);
  }

  responsavelDeselected() {
    this.form.get('responsavelId')?.setValue(null);
    this.form.get('responsavelNome')?.setValue(null);
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

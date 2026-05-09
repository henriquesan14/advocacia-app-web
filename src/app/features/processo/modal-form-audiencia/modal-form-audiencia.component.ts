import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { AudienciaService } from '../../../shared/services/audiencia.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Audiencia } from '../../../core/models/audiencia.interface';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../../core/models/usuario.interface';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { ToggleButtonComponent } from '../../../shared/components/toogle-button/toggle-button.component';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';

@Component({
  selector: 'app-modal-form-audiencia',
  standalone: true,
  imports: [ReactiveFormsModule, BtnCadastrarComponent, NgxSpinnerModule,
    ToggleButtonComponent, NzFormModule, NzInputModule, NzGridModule, SelectAutocompleteComponent
  ],
  templateUrl: './modal-form-audiencia.component.html',
  styleUrl: './modal-form-audiencia.component.css',
  providers: []
})
export class ModalFormAudienciaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formAudiencia!: FormGroup;
  time = { hour: 12, minute: 0 };

  date!: { year: number; month: number };

  presencial = false;

  responsavelNome!: string;

  responsaveis: Usuario[] = [];
  filteredResponsaveis: Usuario[] = [];

  @Output() submitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private audienciaService: AudienciaService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private usuarioService: UsuariosService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { processoId: string, audiencia: Audiencia }) { }

  ngOnInit(): void {
    this.formAudiencia = this.formBuilder.group({
      titulo: [null, Validators.required],
      descricao: [null, Validators.required],
      dataAudiencia: [null, Validators.required],
      horaAudiencia: [null, Validators.required],
      linkAudiencia: [null],
      local: [null, Validators.required],
      responsavelId: [null, Validators.required],
      responsavelNome: [null],
    })
    this.getResponsaveis(null);
    if (this.data.audiencia) {
      this.getAudiencia();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAudiencia() {
    const data = this.data.audiencia.dataAudiencia.split('T')[0];
    const hora = this.data.audiencia.dataAudiencia.split('T')[1].substring(0, 5);

    this.formAudiencia.get('dataAudiencia')?.setValue(data);
    this.formAudiencia.get('horaAudiencia')?.setValue(hora);
    this.formAudiencia.get('titulo')?.setValue(this.data.audiencia.titulo);
    this.formAudiencia.get('descricao')?.setValue(this.data.audiencia.descricao);
    this.formAudiencia.get('local')?.setValue(this.data.audiencia.local);
    this.formAudiencia.get('linkAudiencia')?.setValue(this.data.audiencia.linkAudiencia);
    this.formAudiencia.get('responsavelNome')?.setValue(this.data.audiencia.responsavel.nome);
    this.formAudiencia.get('responsavelId')?.setValue(this.data.audiencia.responsavelId);
    this.presencial = this.data.audiencia.presencial;
  }

  onChangeResponsavel(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.filteredResponsaveis = this.responsaveis.filter(u =>
      u.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  responsavelSelected(resonsavel: Usuario) {
    this.formAudiencia.patchValue({
      responsavelId: resonsavel.id,
      responsavelNome: resonsavel.nome
    });
  }

  responsavelDeselected() {
    this.formAudiencia.patchValue({
      responsavelId: null,
      responsavelNome: null
    });
  }

  get responsavelControl(): FormControl {
    return this.formAudiencia.get('responsavelId') as FormControl;
  }

  submit() {
    if (this.formAudiencia.valid) {
      if (!this.data.processoId) {
        const audiencia = {
          ...this.formAudiencia.value,
          responsavel: {
            nome: this.formAudiencia.get('responsavelNome')?.value,
          },
          presencial: this.presencial,
          dataAudiencia: this.getDateFormatted()
        }
        this.submitEvent.emit(audiencia);
        this.modalRef.close(audiencia);
        return;
      }

      if (this.data.audiencia) {
        this.updateAudiencia();
        return;
      }

      this.addAudiencia();

    } else {
      FormUtils.markFormGroupTouched(this.formAudiencia);
    }
  }

  addAudiencia() {
    this.spinner.show();
    const audiencia = {
      ...this.formAudiencia.value,
      processoId: this.data.processoId,
      presencial: this.presencial,
      responsavel: {
        nome: this.formAudiencia.get('responsavelNome')?.value,
      },
      dataAudiencia: this.getDateFormatted()
    }
    this.audienciaService.addAudiencia(audiencia).subscribe({
      next: (res) => {
        this.toastr.success('Audiência adicionado!', 'Sucesso');
        audiencia.id = res.id;
        this.modalRef.close(audiencia);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  updateAudiencia() {
    this.spinner.show();
    const audiencia = {
      ...this.formAudiencia.value,
      processoId: this.data.processoId,
      id: this.data.audiencia.id,
      presencial: this.presencial,
      dataAudiencia: this.getDateFormatted()
    }
    this.audienciaService.updateAudiencia(audiencia).subscribe({
      next: () => {
        this.toastr.success('Audiência atualizada!', 'Sucesso');
        this.modalRef.close(audiencia);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  getDateFormatted() {
    const data = this.formAudiencia.value.dataAudiencia;
    const hora = this.formAudiencia.value.horaAudiencia;

    return `${data}T${hora}`;
  }

  getResponsaveis(params: any) {
    this.usuarioService.getResponsaveis(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Usuario[]) => {
          this.responsaveis = res;
          this.filteredResponsaveis = res;
        }
      });
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.formAudiencia, fieldName);
  }

  responsavelSelecionado(responsavel: Usuario) {
    this.formAudiencia.get('responsavel')?.setValue(responsavel);
    this.formAudiencia.get('responsavelId')?.setValue(responsavel.id);
  }

  togglePresencial(event: any) {
    this.presencial = event;
  }
}

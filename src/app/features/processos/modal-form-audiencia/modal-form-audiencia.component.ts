import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
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
import { DateUtils } from '../../../shared/utils/date.utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-modal-form-audiencia',
  standalone: true,
  imports: [ReactiveFormsModule, BtnCadastrarComponent, NgxSpinnerModule,
    ToggleButtonComponent, NzFormModule, NzInputModule, NzDatePickerModule, NzTimePickerModule, NzAutocompleteModule, NzGridModule
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

  responsavelNome!:  string;

  responsaveis: Usuario[] = [];
  filteredResponsaveis: Usuario[] = [];

  @Output() submitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input({required: true}) processoId!: number;
  @Input() audienciaId!: number;

  constructor(private formBuilder: FormBuilder, private audienciaService: AudienciaService, private toastr: ToastrService,
     private spinner: NgxSpinnerService, private usuarioService: UsuariosService, private modalRef: NzModalRef){}

  ngOnInit(): void {
    this.formAudiencia = this.formBuilder.group({
      descricao: [null, Validators.required],
      dataAudiencia: [new Date(), Validators.required],
      horaAudiencia: [new Date(), Validators.required],
      linkAudiencia: [null],
      local: [null, Validators.required],
      responsavelId: [null, Validators.required],
      responsavelNome: [null],
    })
    this.getResponsaveis(null);
    if(this.audienciaId){
      this.getAudiencia();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAudiencia(){
    this.audienciaService.getById(this.audienciaId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Audiencia) => {
        // DateUtils.setDataHora(res.dataAudiencia, this.dp, this.formAudiencia, 'dataAudiencia', 'horaAudiencia');
        this.formAudiencia.get('descricao')?.setValue(res.descricao);
        this.formAudiencia.get('local')?.setValue(res.local);
        this.formAudiencia.get('linkAudiencia')?.setValue(res.linkAudiencia);
        this.formAudiencia.get('responsavel')?.setValue(res.responsavel);
        this.formAudiencia.get('responsavelId')?.setValue(res.responsavelId);
        this.responsavelNome = res.responsavel.nome,
        this.presencial = res.presencial;
      }
    })
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
        this.formAudiencia.patchValue({
          responsavelId: responsavel.id,
          responsavelNome: responsavel.nome
        });
      }
    }
  
    get responsavelNomeControl(): FormControl {
      return this.formAudiencia.get('responsavelNome') as FormControl;
    }

  addAudiencia(){
    this.spinner.show();
    // const formattedDate = DateUtils.getDatetimeFormatted(this.formAudiencia, 'dataAudiencia', 'horaAudiencia', false);
    const audiencia = {
      ...this.formAudiencia.value,
      // dataAudiencia: formattedDate,
      processoId: this.processoId,
      presencial: this.presencial
    }
    this.audienciaService.addAudiencia(audiencia).subscribe({
      next: () => {
        this.toastr.success('Audiência adicionado!', 'Sucesso');
        this.submitEvent.emit(this.formAudiencia.value);
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

  updateAudiencia(){
    this.spinner.show();
    // const dateFormatted = DateUtils.getDatetimeFormatted(this.formAudiencia, 'dataAudiencia', 'horaAudiencia', false);
    const audiencia = {
      ...this.formAudiencia.value,
      processoId: this.processoId,
      id: this.audienciaId,
      // dataAudiencia: dateFormatted,
      presencial: this.presencial
    }
    this.audienciaService.updateAudiencia(audiencia).subscribe({
      next: () => {
        this.toastr.success('Audiência atualizada!', 'Sucesso');
        this.submitEvent.emit(this.formAudiencia.value);
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


  submit(){
    if(this.formAudiencia.valid){
      // const formattedDate = DateUtils.getDatetimeFormatted(this.formAudiencia, 'dataAudiencia', 'horaAudiencia', false);
      if(!this.processoId){
        const audiencia = {
          ...this.formAudiencia.value,
          responsavel: {
            nome: this.formAudiencia.get('responsavelNome')?.value,
          },
          presencial: this.presencial
        }
        this.submitEvent.emit(audiencia);
        this.modalRef.close(audiencia);
        return;
      }

      if(this.audienciaId){
        this.updateAudiencia();
        return;
      }

      this.addAudiencia();
      
    }else{
      FormUtils.markFormGroupTouched(this.formAudiencia);
    }
  }

  getResponsaveis(params: any){
    this.usuarioService.getResponsaveis(params)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Usuario[]) => {
        this.responsaveis = res;
        this.filteredResponsaveis = res;
      }
    });
  }

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.formAudiencia, fieldName);
  }

  responsavelSelecionado(responsavel: Usuario){
    this.formAudiencia.get('responsavel')?.setValue(responsavel);
    this.formAudiencia.get('responsavelId')?.setValue(responsavel.id);
  }

  responsavelDeselected(){
    this.formAudiencia.get('responsavelId')?.setValue(null);
  }

  togglePresencial(event: any) {
    this.presencial = event;
  }
}

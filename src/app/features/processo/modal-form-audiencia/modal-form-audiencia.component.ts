import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
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
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
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

  constructor(private formBuilder: FormBuilder, private audienciaService: AudienciaService, private toastr: ToastrService,
     private spinner: NgxSpinnerService, private usuarioService: UsuariosService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { processoId: string, audiencia: Audiencia }){}

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
    if(this.data.audiencia){
      this.getAudiencia();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAudiencia(){
      const data = new Date(this.data.audiencia.dataAudiencia);

      this.formAudiencia.get('dataAudiencia')?.setValue(data);
      this.formAudiencia.get('horaAudiencia')?.setValue(data);
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

  submit(){
    if(this.formAudiencia.valid){
      if(!this.data.processoId){
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

      if(this.data.audiencia){
        this.updateAudiencia();
        return;
      }

      this.addAudiencia();
      
    }else{
      FormUtils.markFormGroupTouched(this.formAudiencia);
    }
  }

  addAudiencia(){
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

  updateAudiencia(){
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

  getDateFormatted(){
    const data = this.formAudiencia.value.dataAudiencia;
    const hora = this.formAudiencia.value.horaAudiencia;

    let dataDiligencia: string;
    const dataObj = new Date(data);
    const horaObj = new Date(hora);

    dataObj.setHours(horaObj.getHours(), horaObj.getMinutes(), 0, 0);
    dataDiligencia = `${dataObj.getFullYear()}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}T${dataObj.getHours().toString().padStart(2, '0')}:${dataObj.getMinutes().toString().padStart(2, '0')}:00`;

    return dataDiligencia;
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

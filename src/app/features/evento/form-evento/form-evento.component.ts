import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NewEvento } from '../../../core/models/new-evento.interface';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventosService } from '../../../shared/services/eventos.service';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Usuario } from '../../../core/models/usuario.interface';
import { Evento } from '../../../core/models/evento.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { ToggleButtonComponent } from '../../../shared/components/toogle-button/toggle-button.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ToastrService } from 'ngx-toastr';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnCadastrarComponent, NgxSpinnerModule, ToggleButtonComponent, NzDatePickerModule, NzTimePickerModule,
    IconClienteComponent, SelectAutocompleteComponent
  ],
  templateUrl: './form-evento.component.html',
  styleUrl: './form-evento.component.scss'
})
export class FormEventoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formEvento!: FormGroup;
  @Input() isModal: boolean = false;
  @Output() submitEvent: EventEmitter<NewEvento> = new EventEmitter<NewEvento>();

  evento!: Evento;

  responsaveis: Usuario[] = [];
  filteredResponsaveis: Usuario[] = [];

  faTimes = faTimes;
  
  diaInteiro = false;
  presencial = false;

  constructor(private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { eventoId: string }, private formBuilder: FormBuilder, private usuarioService: UsuariosService, private spinner: NgxSpinnerService,
    private eventoService: EventosService, private toastr: ToastrService, 
  ){

  }

  ngOnInit(): void {
    this.formEvento = this.formBuilder.group({
      titulo: [null, Validators.required],
      tipo: ['', [Validators.required]],
      descricao: [null, [Validators.required]],
      dataEvento: [new Date(), Validators.required],
      horaEvento: [new Date(), Validators.required],
      local: [null, Validators.required],
      nroProcesso:[null],
      linkAudiencia: [null],
      responsavelId: [null, Validators.required],
      responsavelNome: [null, Validators.required],
    });

    this.getResponsaveis(null);
    if(this.data.eventoId){
      this.getEvento();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get responsavelControl(): FormControl {
    return this.formEvento.get('responsavelId') as FormControl;
  }

  onChangeResponsavel(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.filteredResponsaveis = this.responsaveis.filter(u =>
      u.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  responsavelSelected(resonsavel: Usuario) {
    this.formEvento.patchValue({
      responsavelId: resonsavel.id,
      responsavelNome: resonsavel.nome
    });
  }

  responsavelDeselected() {
    this.formEvento.patchValue({
      responsavelId: null,
      responsavelNome: null
    });
  }

  getDateFormatted() {
    const data = this.formEvento.value.dataEvento;
    const hora = this.formEvento.value.horaEvento;
    const diaInteiro = this.diaInteiro;
  
    const dataObj = new Date(data);
  
    if (diaInteiro) {
      dataObj.setHours(23, 59, 59, 0);
    } else {
      const horaObj = new Date(hora);
      dataObj.setHours(horaObj.getHours(), horaObj.getMinutes(), 0, 0);
    }
  
    const dataDiligencia = `${dataObj.getFullYear()}-${(dataObj.getMonth() + 1).toString().padStart(2, '0')}-${dataObj.getDate().toString().padStart(2, '0')}T${dataObj.getHours().toString().padStart(2, '0')}:${dataObj.getMinutes().toString().padStart(2, '0')}:${dataObj.getSeconds().toString().padStart(2, '0')}`;
  
    return dataDiligencia;
  }

  getEvento(){
    this.spinner.show();
    this.eventoService.getById(this.data.eventoId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.evento = res;
        this.formEvento.get('titulo')?.setValue(res.titulo);
        this.formEvento.get('tipo')?.setValue(res.tipo);
        if(res.processo){
          this.formEvento.get('nroProcesso')?.setValue(res.processo.nroProcesso);
        }
        
        this.formEvento.get('responsavelId')?.setValue(res.responsavel.id);
        this.formEvento.get('responsavelNome')?.setValue(res.responsavel.nome);

        this.formEvento.get('local')?.setValue(res.local);
        this.formEvento.get('linkAudiencia')?.setValue(res.linkAudiencia);
        
        this.formEvento.get('dataEvento')?.setValue(res.dataEvento);
        this.formEvento.get('horaEvento')?.setValue(res.dataEvento);
        
        this.diaInteiro = res.diaInteiro;
        this.presencial = res.presencial;
        
        this.formEvento.get('descricao')?.setValue(res.descricao);

        if(res.processo && res.refId){
          this.formEvento.get('tipo')?.disable();
        }

      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  toggleDiaInteiro(event: any) {
    this.diaInteiro = event;
  }

  togglePresencial(event: any) {
    this.presencial = event;
  }

  submit(){
    if(this.formEvento.valid) {
      this.formEvento.get('tipo')?.enable();
      const evento = <NewEvento>{
        ...this.formEvento.value,
        dataEvento: this.getDateFormatted(),
        diaInteiro: this.diaInteiro,
        presencial: this.presencial
      };
      if(this.data.eventoId){
        evento.id = this.data.eventoId;
        this.updateEvento(evento);
        return;
      }
      this.cadastrarEvento(evento);
      
    }else {
      FormUtils.markFormGroupTouched(this.formEvento);
    }
  }

  cadastrarEvento(evento: NewEvento){
    this.eventoService.addEvento(evento).subscribe({
        next: () => {
          this.toastr.success('Evento adicionado!', 'Sucesso');
          this.modalRef.close();
        }
      })
  }

  updateEvento(evento: NewEvento){
    this.eventoService.updateEvento(evento).subscribe({
        next: () => {
          this.toastr.success('Evento atualizado!', 'Sucesso');
          this.modalRef.close();
        }
    });
  }

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.formEvento, fieldName);
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

  get isAudiencia(){
    return this.formEvento.get('tipo')?.value == 'AUDIENCIA';
  }
}

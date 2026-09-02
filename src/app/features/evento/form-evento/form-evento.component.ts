import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
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
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { ToastrService } from 'ngx-toastr';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAutocompleteOptionComponent } from 'ng-zorro-antd/auto-complete';
import { NzAutocompleteTriggerDirective } from 'ng-zorro-antd/auto-complete';
import { ProcessosService } from '../../../shared/services/processos.service';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';
import { ProcessoAutocomplete } from '../../../core/models/processo-autocomplete.interface';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnCadastrarComponent, NgxSpinnerModule, ToggleButtonComponent,
    IconClienteComponent, SelectAutocompleteComponent, HasRoleDirective, NzAutocompleteModule,
    NroProcessoPipe
  ],
  templateUrl: './form-evento.component.html',
  styleUrl: './form-evento.component.scss'
})
export class FormEventoComponent implements OnInit, OnDestroy {
  @ViewChild('processoInput') processoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('processoAutocompleteTrigger') processoAutocompleteTrigger!: NzAutocompleteTriggerDirective;

  private destroy$ = new Subject<void>();
  formEvento!: FormGroup;
  @Input() isModal: boolean = false;
  @Output() submitEvent: EventEmitter<NewEvento> = new EventEmitter<NewEvento>();

  evento!: Evento;

  responsaveis: Usuario[] = [];
  filteredResponsaveis: Usuario[] = [];
  processosSugeridos: ProcessoAutocomplete[] = [];
  private processoSearch$ = new Subject<string>();
  private selectedProcessNumber: string | null = null;

  faTimes = faTimes;
  
  diaInteiro = false;
  presencial = false;

  constructor(private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { eventoId: string }, private formBuilder: FormBuilder, private usuarioService: UsuariosService, private spinner: NgxSpinnerService,
    private eventoService: EventosService, private toastr: ToastrService, 
    private processoService: ProcessosService
  ){

  }

  ngOnInit(): void {
    this.formEvento = this.formBuilder.group({
      titulo: [null, Validators.required],
      tipo: ['', [Validators.required]],
      descricao: [null, [Validators.required]],
      dataEvento: [null, Validators.required],
      horaEvento: [null, [Validators.required, !this.diaInteiro ? Validators.required : null]],
      local: [null, Validators.required],
      nroProcesso: [null, this.processNumberValidator],
      linkAudiencia: [null],
      responsavelId: [null, Validators.required],
      responsavelNome: [null, Validators.required],
    });

    this.getResponsaveis(null);
    this.configureProcessoAutocomplete();
    if(this.data.eventoId){
      this.getEvento();
    }
  }

  onProcessoSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.formatProcessNumber(input.value);
    input.value = value;
    this.formEvento.get('nroProcesso')?.setValue(value, { emitEvent: false });
    const search = value.replace(/\D/g, '');
    if (search !== this.selectedProcessNumber) {
      this.selectedProcessNumber = null;
      this.nroProcessoControl.updateValueAndValidity({ emitEvent: false });
    }

    if (search.length < 3) {
      this.processosSugeridos = [];
      this.processoSearch$.next(search);
      return;
    }

    this.processoSearch$.next(search);
  }

  onProcessoSelected(option: NzAutocompleteOptionComponent): void {
    this.selectedProcessNumber = String(option.nzValue).replace(/\D/g, '');
    this.formEvento.get('nroProcesso')?.setValue(option.nzValue);
    this.nroProcessoControl.updateValueAndValidity({ emitEvent: false });
  }

  formatProcessNumber(value: string): string {
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 20);
    const groupSizes = [7, 2, 4, 1, 2, 4];
    const groups: string[] = [];
    let position = 0;

    for (const size of groupSizes) {
      const group = digits.slice(position, position + size);
      if (!group) break;

      groups.push(group);
      position += group.length;
      if (group.length < size) break;
    }

    return groups.join('.');
  }

  private processNumberValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) return null;

    const number = value.replace(/\D/g, '');
    if (number.length < 3) return { minimumProcessDigits: true };

    return number === this.selectedProcessNumber ? null : { processNotSelected: true };
  };

  private configureProcessoAutocomplete(): void {
    this.processoSearch$.pipe(
      distinctUntilChanged(),
      switchMap(nroProcesso => nroProcesso.length < 3
        ? of([] as ProcessoAutocomplete[])
        : timer(300).pipe(
            switchMap(() => this.processoService.buscarAutocomplete(nroProcesso).pipe(
              catchError(() => of([] as ProcessoAutocomplete[]))
            ))
          )),
      takeUntil(this.destroy$)
    ).subscribe(processos => {
      this.processosSugeridos = processos;

      if (processos.length > 0 && document.activeElement === this.processoInput?.nativeElement) {
        setTimeout(() => this.processoAutocompleteTrigger?.openPanel());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get responsavelControl(): FormControl {
    return this.formEvento.get('responsavelId') as FormControl;
  }

  get nroProcessoControl(): FormControl {
    return this.formEvento.get('nroProcesso') as FormControl;
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
  
    if (this.diaInteiro) {
      return `${data}T23:59:59`;
    } else {
      return `${data}T${hora}`;
    }
  }

  getEvento(){
    this.spinner.show();
    this.eventoService.getById(this.data.eventoId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.evento = res;

        const data = res.dataEvento.split('T')[0];
        const hora = res.dataEvento.split('T')[1].substring(0,5);

        this.formEvento.get('titulo')?.setValue(res.titulo);
        this.formEvento.get('tipo')?.setValue(res.tipo);
        if(res.processo){
          this.selectedProcessNumber = res.processo.nroProcesso.replace(/\D/g, '');
          this.formEvento.get('nroProcesso')?.setValue(res.processo.nroProcesso);
        }
        
        this.formEvento.get('responsavelId')?.setValue(res.responsavel.id);
        this.formEvento.get('responsavelNome')?.setValue(res.responsavel.nome);

        this.formEvento.get('local')?.setValue(res.local);
        this.formEvento.get('linkAudiencia')?.setValue(res.linkAudiencia);
        
        this.formEvento.get('dataEvento')?.setValue(data);
        this.formEvento.get('horaEvento')?.setValue(hora);
        
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

    const horaControl = this.formEvento.get('horaEvento');

    if (this.diaInteiro) {
      horaControl?.clearValidators();
      horaControl?.setValue(null);
    } else {
      horaControl?.setValidators([Validators.required]);
    }

    horaControl?.updateValueAndValidity();
  }

  togglePresencial(event: any) {
    this.presencial = event;
  }

  submit(){
    if(this.formEvento.valid) {
      this.formEvento.get('tipo')?.enable();
      const evento = <NewEvento>{
        ...this.formEvento.value,
        nroProcesso: this.formEvento.value.nroProcesso
          ? this.formEvento.value.nroProcesso.replace(/\D/g, '')
          : null,
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

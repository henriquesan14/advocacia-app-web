import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';
import { PartesService } from '../../../shared/services/partes.service';
import { Parte } from '../../../core/models/parte.interface';
import { Diligencia } from '../../../core/models/diligencia.interface';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowCircleLeft, faCheck, faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Processo } from '../../../core/models/processo.interface';
import { Historico } from '../../../core/models/historico.interface';
import { Audiencia } from '../../../core/models/audiencia.interface';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ProcessosService } from '../../../shared/services/processos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Usuario } from '../../../core/models/usuario.interface';
import { SituacaoProcesso } from '../../../core/models/situacao-processo.interface';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';
import { Comarca } from '../../../core/models/comarca.interface';
import { ComarcaService } from '../../../shared/services/comarca.service';
import { DonoService } from '../../../shared/services/dono.service';
import { Dono } from '../../../core/models/dono.interface';
import { Sistema } from '../../../core/models/sistema.interface';
import { Competencia } from '../../../core/models/competencia.interface';
import { CompetenciaService } from '../../../shared/services/competencia.service';
import { SistemaService } from '../../../shared/services/sistema.service';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { BtnVoltarComponent } from '../../../shared/components/btn-voltar/btn-voltar.component';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { Documento } from '../../../core/models/documento.interface';
import { DataService } from '../../../shared/services/data-service';
import { UploadFileComponent } from '../../../shared/components/upload-file/upload-file.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { existingProcessValidator } from '../../../shared/validators/existing-process.validator';
import { CardHistoricoComponent } from '../card-historico/card-historico.component';
import { FormHistoricoComponent } from '../form-historico/form-historico.component';
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FormPartesComponent } from '../../parte/form-partes/form-partes.component';
import { ModalFormDiligenciaComponent } from '../modal-form-diligencia/modal-form-diligencia.component';
import { ModalFormAudienciaComponent } from '../modal-form-audiencia/modal-form-audiencia.component';
import { ModalProcessoArquivadoComponent } from '../modal-processo-arquivado/modal-processo-arquivado.component';
import { ModalFormDonoComponent } from '../../dono/modal-form-dono/modal-form-dono.component';
import { FormUsuarioComponent } from '../../usuarios/form-usuario/form-usuario.component';
import { ModalFormComarcaComponent } from '../../comarca/modal-form-comarca/modal-form-comarca.component';
import { ModalFormCompetenciaComponent } from '../../competencia/modal-form-competencia/modal-form-competencia.component';
import { ModalFormSistemaComponent } from '../../sistema/modal-form-sistema/modal-form-sistema.component';
import { ModalFormSituacaoProcessoComponent } from '../../situacao-processo/modal-form-situacao-processo/modal-form-situacao-processo.component';

@Component({
  selector: 'app-cadastro-processos',
  standalone: true,
  imports: [NgxMaskDirective, ReactiveFormsModule, FontAwesomeModule, DatePipe, NgxSpinnerModule,
    BtnCadastrarComponent, BtnVoltarComponent, BtnNovoComponent, NzToolTipModule, CommonModule, UploadFileComponent, HasRoleDirective,
    CardHistoricoComponent, FormHistoricoComponent, IconClienteComponent, NzAutocompleteModule, NzInputModule, NzTabsModule, NzFormModule,
    NzInputModule, NzSelectModule, NzTableModule, FormsModule, NzIconModule, NzButtonModule, IconClienteComponent, NzModalModule],
  templateUrl: './cadastro-processos.component.html',
  styleUrl: './cadastro-processos.component.css'
})
export class CadastroProcessosComponent implements OnInit {
  private destroy$ = new Subject<void>();
  formProcesso!: FormGroup;
  faTrash = faTrash;
  tabActive = 1;
  faCheck = faCheck;
  faArrowLeft = faArrowCircleLeft;
  faUpload = faCloudUploadAlt;
  faAddressCard = faAddressCard;

  modal = inject(NzModalService);

  constructor(private formBuilder: FormBuilder, private partesService: PartesService,
    private usuarioService: UsuariosService, private spinner: NgxSpinnerService,
    private processoService: ProcessosService, private toastr: ToastrService, private router: Router,
    private situacaoProcessoService: SituacaoProcessoService, private comarcaService: ComarcaService,
    private donoService: DonoService, private competenciaService: CompetenciaService, private sistemaService: SistemaService,
    private dataService: DataService) {
  }

  autorNomeControl = new FormControl('');
  reuNomeControl = new FormControl('');
  reusSelecionados: Parte[] = [];
  autoresSelecionados: Parte[] = [];
  reus: Parte[] = [];
  autores: Parte[] = [];
  donos: Dono[] = [];
  responsaveis: Usuario[] = [];
  diligencias: Diligencia[] = [];
  historicos: Historico[] = [];
  audiencias: Audiencia[] = [];
  situacoes: SituacaoProcesso[] = [];
  comarcas: Comarca[] = [];
  sistemas: Sistema[] = [];
  competencias: Competencia[] = [];
  documentos: Documento[] = [];

  selecionarDono(event: any): void {
    const dono = event.nzValue;
    if (dono) {
      this.formProcesso.patchValue({
        donoId: dono.id,
        donoNome: dono.nome
      });
    }
  }

  selecionarResponsavel(event: any): void {
    const responsavel = event.nzValue;
    if (responsavel) {
      this.formProcesso.patchValue({
        responsavelId: responsavel.id,
        responsavelNome: responsavel.nome
      });
    }
  }

  selecionarComarca(event: any): void {
    const comarca = event.nzValue;
    if (comarca) {
      this.formProcesso.patchValue({
        comarcaId: comarca.id,
        comarcaNome: comarca.nome
      });
    }
  }

  addAutor(event: any) {
    const nome = event.nzValue;
    const autor = this.autores.find(a => a.nome === nome);
    if (autor && !this.autoresSelecionados.some(a => a.nome === nome)) {
      this.autoresSelecionados.push(autor);
      this.autorNomeControl.setValue('');
    }
  }

  addReu(event: any) {
    const nome = event.nzValue;
    const reu = this.autores.find(a => a.nome === nome);
    if (reu && !this.reusSelecionados.some(a => a.nome === nome)) {
      this.reusSelecionados.push(reu);
      this.reuNomeControl.setValue('');
    }
  }

  get donoNomeControl(): FormControl {
    return this.formProcesso.get('donoNome') as FormControl;
  }

  get responsavelNomeControl(): FormControl {
    return this.formProcesso.get('responsavelNome') as FormControl;
  }

  get comarcaNomeControl(): FormControl {
    return this.formProcesso.get('comarcaNome') as FormControl;
  }

  ngOnInit(): void {
    this.formProcesso = this.formBuilder.group({
      donoId: [null, Validators.required],
      donoNome: ['', Validators.required],
      responsavelId: [null, Validators.required],
      responsavelNome: ['', Validators.required],
      tipoAcao: [null, Validators.required],
      nroProcesso: [null, [Validators.required], [existingProcessValidator(this.processoService)]],
      vara: [null, Validators.required],
      comarcaId: [null, Validators.required],
      comarcaNome: ['', Validators.required],
      situacaoProcessoId: [null, Validators.required],
      competenciaId: [null, Validators.required],
      sistemaId: [null, Validators.required],

      dataDistribuicao: [null],
      observacao: [null]
    });
    var params = { pageSize: 99 };
    this.getReus(params);
    this.getAutores(params);
    this.getResponsaveis(null);
    this.getDonos(null);
    this.getSituacoes();
    this.getComarcas(null);
    this.getCompetencias();
    this.getSistemas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getReus(params: any) {
    params.pageSize = 99;
    this.partesService.getPartes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.reus = res.items;
        }
      })
  }

  getAutores(params: any) {
    params.pageSize = 99;
    this.partesService.getPartes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.autores = res.items;
        }
      })
  }

  getResponsaveis(params: any) {
    this.usuarioService.getResponsaveis(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Usuario[]) => {
          this.responsaveis = res;
        }
      });
  }

  getDonos(params: any) {
    this.donoService.getDonos(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Dono[]) => {
          this.donos = res;
        }
      });
  }

  getComarcas(params: any) {
    this.comarcaService.getComarcas(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Comarca[]) => {
          this.comarcas = res;
        }
      });
  }

  getCompetencias() {
    this.competenciaService.getCompetencias(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Competencia[]) => {
          this.competencias = res;
        }
      });
  }

  getSistemas() {
    this.sistemaService.getSistemas(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Sistema[]) => {
          this.sistemas = res;
        }
      });
  }

  getSituacoes() {
    this.situacaoProcessoService.getSituacoes(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.situacoes = res;
        }
      });
  }

  onChangeDono(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getDonos({ nome });
  }

  onChangeResponsavel(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getResponsaveis({ nome });
  }

  onChangeComarca(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getComarcas({ nome });
  }

  onChangeReu(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getReus({ nome });
  }

  onChangeAutor(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getAutores({ nome });
  }

  async uploadToStorage(): Promise<void> {
    if (this.documentos.length > 0) {
      const uploadPromises = this.documentos.map(documento => {
        return new Promise<void>((resolve, reject) => {
          this.dataService.pushFileToStorage(documento.file, "documentos").subscribe({
            next: (res) => {
              documento.url = res.url;
              documento.path = res.path;
              resolve();
            },
            error: () => {
              this.toastr.error('Erro ao fazer upload do arquivo', 'Error');
              reject();
            }
          });
        });
      });

      await Promise.all(uploadPromises);
    }
  }


  async cadastrarProcesso() {
    this.spinner.show();
    try {
      await this.uploadToStorage();
      let processo = <Processo>{
        ...this.formProcesso.value,
        diligencias: this.diligencias,
        audiencias: this.audiencias,
        historico: this.historicos,
        documentos: this.documentos,
        reus: this.reusSelecionados.map(r => r.id),
        autores: this.autoresSelecionados.map(a => a.id)
      };
      this.processoService.cadastrarProcesso(processo).subscribe({
        next: () => {
          this.toastr.success('Processo cadastrado!', 'Sucesso!');
          this.router.navigateByUrl('/processos');
        },
        error: async () => {
          await this.deleteFiles();
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } catch (e) {
      this.spinner.hide();
      this.toastr.error('Erro ao fazer upload dos documentos', 'Error');
    } finally {
      this.spinner.hide();
    }
  }


  async onSubmit() {
    if(this.formProcesso.valid){
      if(this.formProcesso.get('situacaoProcessoId')?.value == 1){
        const modalRef = this.modal.create({
          nzContent: ModalProcessoArquivadoComponent,
          nzFooter: null,
          nzWidth: 400
        });
    
        modalRef.afterClose.subscribe(result => {
          if (result) {
            this.cadastrarProcesso();
          } 
        });
      }else{
        this.cadastrarProcesso();
      }
    }else{
      FormUtils.markFormGroupTouched(this.formProcesso);
      this.tabActive = 1;
    }
  }

  onFilesDropped(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      const urlLocal = URL.createObjectURL(files[i]);
      const fileUpload: Documento = { nome: files[i].name, urlLocal, tipo: files[i].type.toString(), file: files[i] };
      this.documentos.push(fileUpload);
    }
  }


  deleteDiligencia(index: any) {
    this.diligencias.splice(index, 1);
  }

  deleteReu(index: any) {
    this.reusSelecionados.splice(index, 1);
  }

  deleteAutor(index: any) {
    this.autoresSelecionados.splice(index, 1);
  }

  deleteHistorico(index: any) {
    this.historicos.splice(index, 1);
  }

  deleteAudiencia(index: any) {
    this.audiencias.splice(index, 1);
  }

  getMaskCpfCnpj() {
    return this.formProcesso.get('tipoPessoa')?.value == 'pf' ? '000.000.000-00' : '00.000.000/0000-00';
  }

  addHistorico(historico: any) {
    this.historicos.push(historico);
  }

  openModalFormDiligencia() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de diligência',
      nzContent: ModalFormDiligenciaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.diligencias.push(result);
      }
    });

  }


  openModalFormAudiencia() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de audiência',
      nzContent: ModalFormAudienciaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.audiencias.push(result);
      }
    });
  }

  openModalFormDono() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de dono',
      nzContent: ModalFormDonoComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getDonos(null);
      }
    });
  }

  openModalFormResponsavel() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de responsável',
      nzContent: FormUsuarioComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getResponsaveis(null);
      }
    });
  }

  openModalFormComarca() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de comarca',
      nzContent: ModalFormComarcaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getComarcas(null);
      }
    });
  }

  openModalFormCompetencia() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de competência',
      nzContent: ModalFormCompetenciaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getCompetencias();
      }
    });
  }

  openModalFormSistema() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de sistema',
      nzContent: ModalFormSistemaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getSistemas();
      }
    });
  }

  openModalFormSituacao() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de situação processo',
      nzContent: ModalFormSituacaoProcessoComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getSituacoes();
      }
    });
  }

  openModalFormParte() {
    const modal = this.modal.create({
      nzTitle: 'Cadastro de parte',
      nzContent: FormPartesComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        var params = { pageSize: 99 };
        this.getReus(params);
        this.getAutores(params);
      }
    });
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.formProcesso, fieldName);
  }

  deleteDocumento(index: number) {
    this.documentos.splice(index, 1);
  }

  async deleteFiles() {
    for (let documento of this.documentos) {
      await this.dataService.deleteFile(documento.path!);
    }
  }

  getError(field: string, validation: string) {
    return this.formProcesso.get(field)?.hasError(validation);
  }

  getTextoReduzido(descricao: string) {
    if (descricao.length <= 30) {
      return descricao;
    }
    return `${descricao.substring(0, 30)}...`;
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProcessosService } from '../../../shared/services/processos.service';
import { Processo } from '../../../core/models/processo.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faCogs, faExclamationCircle, faExclamationTriangle, faEye, faPencil, faRefresh, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ResponsePage } from '../../../core/models/response-page.interface';
import { NgxMaskDirective } from 'ngx-mask';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';
import { SituacaoProcesso } from '../../../core/models/situacao-processo.interface';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CompetenciaService } from '../../../shared/services/competencia.service';
import { Competencia } from '../../../core/models/competencia.interface';
import { ProcessoFieldConfigService } from '../../../shared/services/processo-field-config.service';
import { ProcessoFieldConfig } from '../../../core/models/processo-field-config.interface';
import { Comarca } from '../../../core/models/comarca.interface';
import { ComarcaService } from '../../../shared/services/comarca.service';
import { Usuario } from '../../../core/models/usuario.interface';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { DonoService } from '../../../shared/services/dono.service';
import { Dono } from '../../../core/models/dono.interface';
import { FilterProcessoService } from '../../../shared/services/filter-processo.service';
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ConfigFieldProcessosComponent } from '../config-field-processos/config-field-processos.component';

@Component({
  selector: 'app-listagem-processos',
  standalone: true,
  imports: [ CommonModule , ReactiveFormsModule, FontAwesomeModule, NzToolTipModule, FormsModule,
    NgxMaskDirective, NroProcessoPipe, BtnPesquisarComponent, BtnLimparComponent, BtnNovoComponent, HasRoleDirective,
  NgxSpinnerModule, IconClienteComponent, NzCollapseModule, NzTableModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, NzModalModule, ],
  templateUrl: './listagem-processos.component.html',
  styleUrl: './listagem-processos.component.css'
})
export class ListagemProcessosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  responsePageProcessos: ResponsePage<Processo> = {
      currentPage: 1,
      hasNext: false,
      hasPrevious: false,
      items: [],
      pageSize: 10,
      totalCount: 0,
      totalPages: 0
  };
  processosSobAprovacao: Processo[] = [];
  processoFieldConfigs: ProcessoFieldConfig[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;
  faCheck = faCheck;
  faTimes = faTimes;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faCogs = faCogs;
  faRefresh = faRefresh;
  modalService = inject(NzModalService);
  situacoes: SituacaoProcesso[] = [];
  competencias: Competencia[] = [];
  responsaveis: Usuario[] = [];
  donos: Dono[] = [];
  comarcas: Comarca[] = [];
  processosSobAprovadoCollapsed: boolean = false;
  filtrosCollapsed: boolean = true;
  hasCollapsed = false;
  mask: string = '';
  hasPermissionAllProcessos = false;
  savedPageNumber?: number;
  savedPageSize?: number;

  constructor(private processoService: ProcessosService, private formBuilder: FormBuilder, private situacaoService: SituacaoProcessoService,
    private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private competenciaService: CompetenciaService,
    private processoFieldConfigService: ProcessoFieldConfigService, private comarcaService: ComarcaService, private usuarioService: UsuariosService,
    private localStorageService: LocalstorageService, private donoService: DonoService, private activatedRoute: ActivatedRoute, private filterProcessoService: FilterProcessoService){
  }

  initForm(){
    this.filtroForm = this.formBuilder.group({
      nroProcesso: [null],
      nome: [null],
      cpfCnpj: [null],
      situacaoProcessoId: [''],
      competenciaId: [''],
      comarcaId: [''],
      responsavelId: [''],
      donoId: ['']
    });
  }

  onChangeCollapse(){
    if(!this.hasCollapsed){
      this.getProcessosSobAprovacao();
      this.hasCollapsed = true;
    }
  }

  isFilterActive(): boolean {
    const formValues = this.filtroForm.value;
    // Verifica se algum campo de filtro foi preenchido (além do valor padrão)
    return Object.values(formValues).some(value => value && value !== '');
  }

  getDias(data: string){
    const dateObject = new Date(data);

    // Data atual
    const currentDate = new Date();

    // Calcula a diferença em milissegundos
    const differenceInMilliseconds = currentDate.getTime() - dateObject.getTime();

    // Convertendo milissegundos para dias
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsInADay);
    return differenceInDays;
  }

  ngOnInit(): void {
    const userRoles = this.localStorageService.getAuthStorage().user.grupo.permissoes.map(p => p.nome);
    this.hasPermissionAllProcessos = userRoles.includes('LISTAR_PROCESSO');


    this.initForm();

    this.applySavedFilters();
    
    this.getProcessoFieldConfigs();

    if (this.hasPermissionAllProcessos) {
      // Chama métodos relacionados às permissões
      Promise.all([
        this.getSituacoes(),
        this.getCompetencias(),
        this.getComarcas(),
        this.getResponsaveis(),
        this.getDonos()
      ]).then(() => {
        this.getProcessos(); // Chama getProcessos após todas as chamadas acima serem concluídas
      }).catch(error => {
        console.error('Erro ao carregar dados iniciais', error);
      });
    } else {
      // Se não tiver permissão, apenas carrega os processos
      this.getProcessos();
    }
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  visualizarProcesso(idProcesso: number) {
		this.router.navigateByUrl(`/app/processos/${idProcesso}`);
	}

  filter(){
    this.responsePageProcessos.currentPage = 1;
    this.getProcessos();
  }

  applySavedFilters(): void {
    const savedFilters = this.filterProcessoService.getFilters();
    if (savedFilters) {
      this.filtroForm.patchValue({
        aprovado: true,
        ...savedFilters
      });
      this.savedPageNumber = savedFilters.pageNumber;
      this.savedPageSize = savedFilters.pageSize;
    }
    this.filtrosCollapsed = !this.isFilterActive();
  }

  getProcessos() {
    this.spinner.show();
    const filtros = {
      aprovado: true,
      ...this.filtroForm.value,
      pageNumber: this.savedPageNumber || this.responsePageProcessos.currentPage,
      pageSize: this.savedPageSize || this.responsePageProcessos.pageSize
    };
    this.savedPageNumber = undefined;
    this.savedPageSize = undefined;

    this.filterProcessoService.setFilters(filtros);

    const serviceMethod = this.hasPermissionAllProcessos
      ? this.processoService.getProcessos(filtros)
      : this.processoService.getMeusProcessos(filtros);
  
    serviceMethod
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponsePage<Processo>) => {
          this.responsePageProcessos = res;
        },
        error: () => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      });
  }

  onPageChange(event: number) {
    this.responsePageProcessos.currentPage = event;
    this.getProcessos();
  }

  onPageSizeChange(event: number){
    this.responsePageProcessos.pageSize = event;
    this.getProcessos();
  }

  getProcessoFieldConfigs(){
    this.processoFieldConfigService.getProcessoFieldConfigs()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.processoFieldConfigs = res;
      }
    });
  }

  getProcessosSobAprovacao(){
    this.processoService.getProcessos({
      aprovado: false,
      pageNumber: 1,
      pageSize: 99999
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.processosSobAprovacao = res.items;
      }
    });
  }

  openConfiguracaoFields(){
    const modal = this.modalService.create({
      nzTitle: 'Configuração de campos',
      nzContent: ConfigFieldProcessosComponent,
      nzWidth: '800px',
      nzFooter: null,
      nzData:{
        fields: this.processoFieldConfigs
      },
    });
    
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getProcessoFieldConfigs();
        this.getProcessos();
        if(this.hasCollapsed){
          this.getProcessosSobAprovacao();
        }
      }
    });
  }

  getSituacoes(){
    this.situacaoService.getSituacoes(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.situacoes = res;
      }
    })
  }

  getCompetencias(){
    this.competenciaService.getCompetencias(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.competencias = res;
      }
    })
  }

  getComarcas(){
    this.comarcaService.getComarcas(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.comarcas = res;
      }
    })
  }

  getResponsaveis(){
    this.usuarioService.getUsuarios(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.responsaveis = res;
      }
    })
  }

  getDonos(){
    this.donoService.getDonos(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.donos = res;
      }
    })
  }

  onInputChange(): void {
    const cleanValue = this.filtroForm.get('cpfCnpj')?.value;
    if (cleanValue && cleanValue.length <= 11) {
      this.mask = '000.000.000-009'; // CPF
    } else {
      this.mask = '00.000.000/0000-00'; // CNPJ
    }
  }

  aprovarProcesso(id: number){
    this.processoService.aprovarProcesso(id).subscribe({
      next: () => {
        this.toastr.success('Processo aprovado!', 'Sucesso');
        this.getProcessos();
        this.getProcessosSobAprovacao();
      }
    })
  }

  // resetarDataHistorico(id: number){
  //   const modalRef = this.modalService.open(ConfirmationModalComponent);
  //   modalRef.componentInstance.title = 'Confirmar Reset';
  //   modalRef.componentInstance.message = 'Tem certeza de que deseja resetar o contador?';
    
  //   modalRef.result.then((result) => {
  //     if (result) {
  //       this.processoService.resetarDataHistoricoProcesso(id).subscribe({
  //         next: () => {
  //           this.toastr.success('Contador resetado!', 'Sucesso');
  //           this.getProcessos();
  //         }
  //       });
  //     }
  //   }, () => {
  //   });
  // }

  limpar(){
    this.filtroForm.reset();
    this.filtroForm.get('situacaoId')?.setValue('');
    this.filtroForm.get('competenciaId')?.setValue('');
    this.filtroForm.get('comarcaId')?.setValue('');
    this.filtroForm.get('responsavelId')?.setValue('');
    this.filtroForm.get('donoId')?.setValue('');
    this.filtroForm.get('situacaoProcessoId')?.setValue('');
  }

  novoProcesso(){
    this.router.navigateByUrl('/processos/cadastro');
  }

  includesField(field: string){
    return this.processoFieldConfigs.find(p => p.fieldName == field && p.isSelected);
  }
}

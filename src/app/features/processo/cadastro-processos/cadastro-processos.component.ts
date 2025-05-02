import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { faArrowCircleLeft, faCheck, faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Processo } from '../../../core/models/processo.interface';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ProcessosService } from '../../../shared/services/processos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { BtnVoltarComponent } from '../../../shared/components/btn-voltar/btn-voltar.component';
import { DataService } from '../../../shared/services/data-service';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { existingProcessValidator } from '../../../shared/validators/existing-process.validator';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ModalProcessoArquivadoComponent } from '../modal-processo-arquivado/modal-processo-arquivado.component';
import { TabProcessoComponent } from './tabs/tab-processo/tab-processo.component';
import { TabAutoresComponent } from './tabs/tab-autores/tab-autores.component';
import { TabReusComponent } from './tabs/tab-reus/tab-reus.component';
import { TabHistoricosComponent } from './tabs/tab-historicos/tab-historicos.component';
import { TabDiligenciasComponent } from './tabs/tab-diligencias/tab-diligencias.component';
import { TabAudienciasComponent } from './tabs/tab-audiencias/tab-audiencias.component';
import { TabDocumentosComponent } from './tabs/tab-documentos/tab-documentos.component';
import { Parte } from '../../../core/models/parte.interface';
import { Documento } from '../../../core/models/documento.interface';
import { Audiencia } from '../../../core/models/audiencia.interface';
import { Diligencia } from '../../../core/models/diligencia.interface';
import { Historico } from '../../../core/models/historico.interface';

@Component({
  selector: 'app-cadastro-processos',
  standalone: true,
  imports: [ ReactiveFormsModule, NgxSpinnerModule,
    BtnCadastrarComponent, BtnVoltarComponent, HasRoleDirective, NzTabsModule, NzModalModule, 
    TabProcessoComponent,TabAutoresComponent, TabReusComponent, TabHistoricosComponent, TabDiligenciasComponent, TabAudienciasComponent, TabDocumentosComponent],
  templateUrl: './cadastro-processos.component.html',
  styleUrl: './cadastro-processos.component.css'
})
export class CadastroProcessosComponent implements OnInit {
  formProcesso!: FormGroup;
  modalService = inject(NzModalService);

  tabActive = 0;
  faTrash = faTrash;
  faCheck = faCheck;
  faArrowLeft = faArrowCircleLeft;
  faUpload = faCloudUploadAlt;
  faAddressCard = faAddressCard;

  historicos: Historico[] = [];
  diligencias: Diligencia[] = [];
  audiencias: Audiencia[] = [];
  documentos: Documento[] = [];
  reusSelecionados: Parte[] = [];
  autoresSelecionados: Parte[] = [];

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private processoService: ProcessosService,
    private toastr: ToastrService, private router: Router, private dataService: DataService) {
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
  }

  onAutoresChange(autores: Parte[]) {
    this.autoresSelecionados = autores;
  }

  onReusChange(reus: Parte[]) {
    this.reusSelecionados = reus;
  }

  onHistoricosChange(historicos: Historico[]) {
    this.historicos = historicos;
  }

  onDiligenciasChange(diligencias: Diligencia[]) {
    this.diligencias = diligencias;
  }

  onAudienciasChange(audiencias: Audiencia[]) {
    this.audiencias = audiencias;
  }

  onDocumentosChange(documentos: Documento[]) {
    this.documentos = documentos;
  }

  async onSubmit() {
    if (this.formProcesso.valid) {
      if (this.formProcesso.get('situacaoProcessoId')?.value == 1) {
        const modalRef = this.modalService.create({
          nzContent: ModalProcessoArquivadoComponent,
          nzFooter: null,
          nzWidth: 400
        });

        modalRef.afterClose.subscribe(result => {
          if (result) {
            this.cadastrarProcesso();
          }
        });
      } else {
        this.cadastrarProcesso();
      }
    } else {
      FormUtils.markFormGroupTouched(this.formProcesso);
      this.tabActive = 0;
    }
  }

  async cadastrarProcesso() {
    this.spinner.show();
    try {
      await this.uploadToStorage();
      let processo = <Processo>{
        ...this.formProcesso.value,
        autores: this.autoresSelecionados.map(a => a.id),
        reus: this.reusSelecionados.map(r => r.id),
        diligencias: this.diligencias,
        audiencias: this.audiencias,
        historico: this.historicos,
        documentos: this.documentos,
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


  async deleteFiles() {
    for (let documento of this.documentos) {
      await this.dataService.deleteFile(documento.path!);
    }
  }

}

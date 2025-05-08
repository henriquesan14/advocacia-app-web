import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxMaskDirective } from 'ngx-mask';
import { Dono } from '../../../../../core/models/dono.interface';
import { Usuario } from '../../../../../core/models/usuario.interface';
import { Comarca } from '../../../../../core/models/comarca.interface';
import { Sistema } from '../../../../../core/models/sistema.interface';
import { Competencia } from '../../../../../core/models/competencia.interface';
import { SituacaoProcesso } from '../../../../../core/models/situacao-processo.interface';
import { UsuariosService } from '../../../../../shared/services/usuarios.service';
import { DonoService } from '../../../../../shared/services/dono.service';
import { ComarcaService } from '../../../../../shared/services/comarca.service';
import { Subject, takeUntil } from 'rxjs';
import { SistemaService } from '../../../../../shared/services/sistema.service';
import { SituacaoProcessoService } from '../../../../../shared/services/situacao-processo.service';
import { CompetenciaService } from '../../../../../shared/services/competencia.service';
import { FormUtils } from '../../../../../shared/utils/form.utils';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { ModalFormSituacaoProcessoComponent } from '../../../../situacao-processo/modal-form-situacao-processo/modal-form-situacao-processo.component';
import { ModalFormSistemaComponent } from '../../../../sistema/modal-form-sistema/modal-form-sistema.component';
import { ModalFormCompetenciaComponent } from '../../../../competencia/modal-form-competencia/modal-form-competencia.component';
import { ModalFormComarcaComponent } from '../../../../comarca/modal-form-comarca/modal-form-comarca.component';
import { FormUsuarioComponent } from '../../../../usuarios/form-usuario/form-usuario.component';
import { ModalFormDonoComponent } from '../../../../dono/modal-form-dono/modal-form-dono.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SelectAutocompleteComponent } from '../../../../../shared/components/select-autocomplete/select-autocomplete.component';

@Component({
  selector: 'tab-processo',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NgxMaskDirective, BtnNovoComponent, NzDatePickerModule, SelectAutocompleteComponent],
  templateUrl: './tab-processo.component.html',
  styleUrl: './tab-processo.component.scss'
})
export class TabProcessoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input({ required: true }) formProcesso!: FormGroup;

  donos: Dono[] = [];
  responsaveis: Usuario[] = [];
  comarcas: Comarca[] = [];
  sistemas: Sistema[] = [];
  competencias: Competencia[] = [];
  situacoes: SituacaoProcesso[] = [];

  modalService = inject(NzModalService);

  constructor(private usuarioService: UsuariosService, private donoService: DonoService,
    private comarcaService: ComarcaService, private sistemaService: SistemaService, private situacaoProcessoService: SituacaoProcessoService,
    private competenciaService: CompetenciaService
  ) { }

  ngOnInit(): void {
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

  donoSelected(dono: Usuario) {
    this.formProcesso.patchValue({
      donoId: dono.id,
      donoNome: dono.nome
    });
  }

  donoDeselected() {
    this.formProcesso.patchValue({
      donoId: null,
      donoNome: null
    });
  }

  responsavelSelected(resonsavel: Usuario) {
    this.formProcesso.patchValue({
      responsavelId: resonsavel.id,
      responsavelNome: resonsavel.nome
    });
  }

  responsavelDeselected() {
    this.formProcesso.patchValue({
      responsavelId: null,
      responsavelNome: null
    });
  }

  comarcaSelected(comarca: Comarca) {
    this.formProcesso.patchValue({
      comarcaId: comarca.id,
      comarcaNome: comarca.nome
    });
  }

  comarcaDeselected() {
    this.formProcesso.patchValue({
      comarcaId: null,
      comarcaNome: null
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

  openModalFormDono() {
    const modal = this.modalService.create({
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
    const modal = this.modalService.create({
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
    const modal = this.modalService.create({
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
    const modal = this.modalService.create({
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
    const modal = this.modalService.create({
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
    const modal = this.modalService.create({
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

  get donoNomeControl(): FormControl {
    return this.formProcesso.get('donoNome') as FormControl;
  }

  get responsavelNomeControl(): FormControl {
    return this.formProcesso.get('responsavelNome') as FormControl;
  }

  get comarcaNomeControl(): FormControl {
    return this.formProcesso.get('comarcaNome') as FormControl;
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.formProcesso, fieldName);
  }

  getError(field: string, validation: string) {
    return this.formProcesso.get(field)?.hasError(validation);
  }
}

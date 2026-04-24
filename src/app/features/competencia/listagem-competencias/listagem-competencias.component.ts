import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { ModalFormCompetenciaComponent } from '../modal-form-competencia/modal-form-competencia.component';
import { CompetenciaService } from '../../../shared/services/competencia.service';
import { Competencia } from '../../../core/models/competencia.interface';

@Component({
  selector: 'app-listagem-competencias',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
    NzModalModule
  ],
  templateUrl: './listagem-competencias.component.html',
  styleUrl: './listagem-competencias.component.scss'
})
export class ListagemCompetenciasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  competencias: Competencia[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private competenciaService: CompetenciaService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null]
    });
  }

  ngOnInit(): void {
    this.getCompetencias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCompetencias() {
    this.competenciaService.getCompetencias(this.filtroForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Competencia[]) => {
          this.competencias = res;
        }
      });
  }

  deleteCompetencia(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta competência?',
      nzOnOk: () =>
        this.competenciaService.deleteCompetencia(id).subscribe({
          next: () => {
            this.toastr.success('Competência removida!', 'Sucesso');
            this.getCompetencias();
          }
        })
    });
  }

  openFormCompetencia(competenciaId?: string) {
    const modal = this.modalService.create({
      nzTitle: competenciaId ? 'Edição de competência' : 'Cadastro de competência',
      nzContent: ModalFormCompetenciaComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        competenciaId: competenciaId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getCompetencias();
    });
  }

  limpar() {
    this.filtroForm.reset();
  }
}

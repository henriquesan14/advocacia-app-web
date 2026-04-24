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
import { SituacaoProcesso } from '../../../core/models/situacao-processo.interface';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';
import { ModalFormSituacaoProcessoComponent } from '../modal-form-situacao-processo/modal-form-situacao-processo.component';

@Component({
  selector: 'app-listagem-situacoes',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
    NzModalModule
  ],
  templateUrl: './listagem-situacoes.component.html',
  styleUrl: './listagem-situacoes.component.scss'
})
export class ListagemSituacoesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  situacoes: SituacaoProcesso[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private situacaoProcessoService: SituacaoProcessoService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null]
    });
  }

  ngOnInit(): void {
    this.getSituacoes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSituacoes() {
    this.situacaoProcessoService.getSituacoes(this.filtroForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: SituacaoProcesso[]) => {
          this.situacoes = res;
        }
      });
  }

  deleteSituacao(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta situação de processo?',
      nzOnOk: () =>
        this.situacaoProcessoService.deleteSituacao(id).subscribe({
          next: () => {
            this.toastr.success('Situação processo removida!', 'Sucesso');
            this.getSituacoes();
          }
        })
    });
  }

  openFormSituacao(situacaoId?: string) {
    const modal = this.modalService.create({
      nzTitle: situacaoId ? 'Edição de situação processo' : 'Cadastro de situação processo',
      nzContent: ModalFormSituacaoProcessoComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        situacaoId: situacaoId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getSituacoes();
    });
  }

  limpar() {
    this.filtroForm.reset();
  }
}

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
import { ModalFormSistemaComponent } from '../modal-form-sistema/modal-form-sistema.component';
import { Sistema } from '../../../core/models/sistema.interface';
import { SistemaService } from '../../../shared/services/sistema.service';

@Component({
  selector: 'app-listagem-sistemas',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
    NzModalModule
  ],
  templateUrl: './listagem-sistemas.component.html',
  styleUrl: './listagem-sistemas.component.scss'
})
export class ListagemSistemasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  sistemas: Sistema[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private sistemaService: SistemaService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null]
    });
  }

  ngOnInit(): void {
    this.getSistemas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSistemas() {
    this.sistemaService.getSistemas(this.filtroForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Sistema[]) => {
          this.sistemas = res;
        }
      });
  }

  deleteSistema(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover este sistema?',
      nzOnOk: () =>
        this.sistemaService.deleteSistema(id).subscribe({
          next: () => {
            this.toastr.success('Sistema removido!', 'Sucesso');
            this.getSistemas();
          }
        })
    });
  }

  openFormSistema(sistemaId?: string) {
    const modal = this.modalService.create({
      nzTitle: sistemaId ? 'Edição de sistema' : 'Cadastro de sistema',
      nzContent: ModalFormSistemaComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        sistemaId: sistemaId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getSistemas();
    });
  }

  limpar() {
    this.filtroForm.reset();
  }
}

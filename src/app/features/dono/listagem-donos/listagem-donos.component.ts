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
import { Dono } from '../../../core/models/dono.interface';
import { DonoService } from '../../../shared/services/dono.service';
import { ModalFormDonoComponent } from '../modal-form-dono/modal-form-dono.component';

@Component({
  selector: 'app-listagem-donos',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
    NzModalModule
  ],
  templateUrl: './listagem-donos.component.html',
  styleUrl: './listagem-donos.component.scss'
})
export class ListagemDonosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  donos: Dono[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private donoService: DonoService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null]
    });
  }

  ngOnInit(): void {
    this.getDonos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDonos() {
    this.donoService.getDonos(this.filtroForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Dono[]) => {
          this.donos = res;
        }
      });
  }

  deleteDono(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover este dono?',
      nzOnOk: () =>
        this.donoService.deleteDono(id).subscribe({
          next: () => {
            this.toastr.success('Dono removido!', 'Sucesso');
            this.getDonos();
          }
        })
    });
  }

  openFormDono(donoId?: string) {
    const modal = this.modalService.create({
      nzTitle: donoId ? 'Edição de dono' : 'Cadastro de dono',
      nzContent: ModalFormDonoComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        donoId: donoId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getDonos();
    });
  }

  limpar() {
    this.filtroForm.reset();
  }
}

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
import { ComarcaService } from '../../../shared/services/comarca.service';
import { Comarca } from '../../../core/models/comarca.interface';
import { Estado } from '../../../core/models/estado.interface';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EstadoService } from '../../../shared/services/estado.service';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { ModalFormComarcaComponent } from '../modal-form-comarca/modal-form-comarca.component';

@Component({
  selector: 'app-listagem-comarcas',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
    NzModalModule
  ],
  templateUrl: './listagem-comarcas.component.html',
  styleUrl: './listagem-comarcas.component.scss'
})
export class ListagemComarcasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  comarcas: Comarca[] = [];
  estados: Estado[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private comarcaService: ComarcaService, private estadoService: EstadoService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null],
      uf: ['']
    });
  }

  ngOnInit(): void {
    this.getEstados();
    this.getComarcas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getComarcas() {
    this.comarcaService.getComarcas(this.filtroForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Comarca[]) => {
          this.comarcas = res;
        }
      });
  }

  getEstados() {
    this.estadoService.getEstados()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.estados = res;
        }
      })
  }

  deleteComarca(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta comarca?',
      nzOnOk: () =>
        this.comarcaService.deleteComarca(id).subscribe({
          next: () => {
            this.toastr.success('Comarca removida!', 'Sucesso');
            this.getComarcas();
          }
        })
    });
  }

  openFormComarca(comarcaId?: string) {
    const modal = this.modalService.create({
      nzTitle: comarcaId ? 'Edição de comarca' : 'Cadastro de comarca',
      nzContent: ModalFormComarcaComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        comarcaId: comarcaId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getComarcas();
    });
  }

  limpar() {
    this.filtroForm.reset();
  }
}

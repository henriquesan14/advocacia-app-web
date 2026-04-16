import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Ganho } from '../../../core/models/ganho.interface';
import { faCheck, faExclamationCircle, faExclamationTriangle, faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { GanhoService } from '../../../shared/services/ganho.service';
import { ToastrService } from 'ngx-toastr';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ModalFormGanhoComponent } from '../modal-form-ganho/modal-form-ganho.component';

@Component({
  selector: 'app-listagem-ganhos',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
        NzModalModule, CurrencyPipe, DatePipe, NgClass, NroProcessoPipe, NzToolTipModule, HasRoleDirective, NzTagModule],
  templateUrl: './listagem-ganhos.component.html',
  styleUrl: './listagem-ganhos.component.scss'
})
export class ListagemGanhosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  ganhos: Ganho[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faCheck = faCheck;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private ganhoService: GanhoService, private formBuilder: FormBuilder,
    private toastr: ToastrService){
    this.filtroForm = this.formBuilder.group({
      fonte: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.getGanhos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGanhos(){
    this.ganhoService.getGanhos(this.filtroForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Ganho[]) => {
        this.ganhos = res;
      }
    });
  }

  limpar(){
    this.filtroForm.reset();
    this.filtroForm.get('fonte')?.setValue('');
    this.filtroForm.get('status')?.setValue('');
  }

  openFormGanho(ganhoId?: string) {
      const modal = this.modalService.create({
        nzTitle: ganhoId ? 'Edição de ganho' : 'Cadastro de ganho',
        nzContent: ModalFormGanhoComponent,
        nzWidth: '1000px',
        nzFooter: null,
        nzData: {
          ganhoId: ganhoId,
        }
      });
  
      modal.afterClose.subscribe(() => {
        this.getGanhos();
      });
    }
  
  
  deleteGanho(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover este ganho?',
      nzOnOk: () =>
        this.ganhoService.deleteGanho(id).subscribe({
          next: () => {
            this.toastr.success('Ganho removido!', 'Sucesso');
            this.getGanhos();
          }
        })
    });
  }

  getRecebimentoStatus(dataVencimento: string): number {
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
  
    // Zerar as horas para comparar apenas as datas
    vencimento.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
  
    // Calcula a diferença em milissegundos e converte para dias
    const diffInMilliseconds = vencimento.getTime() - hoje.getTime();
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const diffInDays = Math.floor(diffInMilliseconds / millisecondsInADay);
  
    return diffInDays;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'gold';        // amarelo
      case 'PAGO':
        return 'green';       // sucesso
      case 'AGUARDANDO':
        return 'default';     // cinza
      case 'RECEBIDO':
        return 'blue';        // info
      default:
        return 'default';
    }
  }
}

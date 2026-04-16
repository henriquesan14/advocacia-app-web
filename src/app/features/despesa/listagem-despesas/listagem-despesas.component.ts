import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Despesa } from '../../../core/models/despesa.interface';
import { faCheck, faExclamationCircle, faExclamationTriangle, faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DespesaService } from '../../../shared/services/despesa.service';
import { ToastrService } from 'ngx-toastr';
import { ModalFormDespesaComponent } from '../modal-form-despesa/modal-form-despesa.component';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
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

@Component({
  selector: 'app-listagem-despesas',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzTableModule, NzButtonModule, FontAwesomeModule, NzToolTipModule, DatePipe,
      NzModalModule, CurrencyPipe, DatePipe, NgClass, NroProcessoPipe, NzToolTipModule, HasRoleDirective, NzTagModule],
  templateUrl: './listagem-despesas.component.html',
  styleUrl: './listagem-despesas.component.scss'
})
export class ListagemDespesasComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  despesas: Despesa[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faCheck = faCheck;

  confirmModal?: NzModalRef;
  private modalService = inject(NzModalService);

  constructor(private despesaService: DespesaService, private formBuilder: FormBuilder,  
    private toastr: ToastrService){
    this.filtroForm = this.formBuilder.group({
      tipo: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.getDespesas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDespesas(){
    this.despesaService.getDespesas(this.filtroForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Despesa[]) => {
        this.despesas = res;
      }
    });
  }

  limpar(){
    this.filtroForm.reset();
    this.filtroForm.get('tipo')?.setValue('');
    this.filtroForm.get('status')?.setValue('');
  }

  openFormDespesa(despesaId?: string) {
    const modal = this.modalService.create({
      nzTitle: despesaId ? 'Edição de despesa' : 'Cadastro de despesa',
      nzContent: ModalFormDespesaComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        despesaId: despesaId,
      }
    });

    modal.afterClose.subscribe(() => {
      this.getDespesas();
    });
  }


  deleteDespesa(id: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta despesa?',
      nzOnOk: () =>
        this.despesaService.deleteDespesa(id).subscribe({
          next: () => {
            this.toastr.success('Despesa removida!', 'Sucesso');
            this.getDespesas();
          }
        })
    });
  }

  pagarDespesa(id: string){
    this.despesaService.pagarDespesa(id).subscribe({
      next: () => {
        this.toastr.success('Despesa paga!', 'Sucesso');
        this.getDespesas();
      }
    })
  }

  getVencimentoStatus(dataVencimento: string): number {
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

  getTextoReduzido(descricao: string | undefined){
    if(!descricao){
      return 'N/A';
    }
    if(descricao.length <= 10){
      return descricao;
    }
    return `${descricao.substring(0,10)}...`;
  }
}

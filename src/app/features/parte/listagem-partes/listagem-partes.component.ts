import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsePage } from '../../../core/models/response-page.interface';
import { Subject, takeUntil } from 'rxjs';
import { Parte } from '../../../core/models/parte.interface';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PartesService } from '../../../shared/services/partes.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgxMaskDirective } from 'ngx-mask';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { CpfCnpjPipe } from '../../../shared/pipes/cpf-cnpj.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormPartesComponent } from '../form-partes/form-partes.component';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { BtnAuditoriaComponent } from '../../../shared/components/btn-auditoria/btn-auditoria.component';

@Component({
  selector: 'app-listagem-partes',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzTableModule, NgxMaskDirective, BtnNovoComponent, BtnPesquisarComponent, BtnLimparComponent, CpfCnpjPipe, FontAwesomeModule, DatePipe, NzPaginationModule, NzSelectModule,
    FormsModule, NzModalModule, NzButtonModule, NzInputModule, NzCheckboxModule, NzToolTipModule, HasRoleDirective, BtnAuditoriaComponent
  ],
  templateUrl: './listagem-partes.component.html',
  styleUrl: './listagem-partes.component.scss'
})
export class ListagemPartesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  responsePagePartes: ResponsePage<Parte> = {
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    items: [],
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  };
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;
  mask: string = '';


  private modalService = inject(NzModalService);
  confirmModal?: NzModalRef;

  constructor(private parteService: PartesService, private formBuilder: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.filtroForm = this.formBuilder.group({
      nome: [null],
      cpfCnpj: [null],
      isCliente: [null]
    });
  }

  ngOnInit(): void {
    this.getPartes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPartes(){
    var params = {
      pageNumber: this.responsePagePartes.currentPage,
      pageSize: this.responsePagePartes.pageSize,
      ...this.filtroForm.value
    };
    this.parteService.getPartes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (res) => {
        this.responsePagePartes = res;
      }
      });
  }

  editarParte(id: string){
    this.router.navigateByUrl(`/app/partes/${id}`);
  }

  deleteParte(id: string){
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta parte?',
      nzOnOk: () =>
        this.parteService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Parte removida!', 'Sucesso');
            this.getPartes();
          }
        })
    });
  }

  onPageChange(event: number) {
    this.responsePagePartes.currentPage = event;
    this.getPartes();
  }

  onPageSizeChange(event: number) {
    this.responsePagePartes.pageSize = event;
    this.getPartes();
  }

  limpar(){
    this.filtroForm.reset();
  }

  openFormParte(parteId?: string){
    const modal = this.modalService.create({
        nzTitle: parteId ? 'Edição de parte' : 'Cadastro de parte',
        nzContent: FormPartesComponent,
        nzWidth: '1000px',
        nzFooter: null,
        nzData: {
          parteId: parteId,
        }
      });
  
      modal.afterClose.subscribe(() => {
        this.getPartes();
      });
  }

  onInputChange(): void {
    const cleanValue = this.filtroForm.get('cpfCnpj')?.value;
    if (cleanValue && cleanValue.length <= 11) {
      this.mask = '000.000.000-009'; // CPF
    } else {
      this.mask = '00.000.000/0000-00'; // CNPJ
    }
  }
}

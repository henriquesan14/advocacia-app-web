import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Grupo } from '../../../core/models/grupo.interface';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { GrupoService } from '../../../shared/services/grupo.service';
import { ToastrService } from 'ngx-toastr';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';

@Component({
  selector: 'app-listagem-grupos',
  standalone: true,
  imports: [NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzTableModule, BtnPesquisarComponent, BtnLimparComponent, NzButtonModule, DatePipe, FontAwesomeModule, BtnNovoComponent],
  templateUrl: './listagem-grupos.component.html',
  styleUrl: './listagem-grupos.component.scss'
})
export class ListagemGruposComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  faTrash = faTrash;
  faEye = faEye;
  grupos: Grupo[] = [];

  private modalService = inject(NzModalService);

  constructor(private formBuilder: FormBuilder, private grupoService: GrupoService, private toastr: ToastrService){
    this.filtroForm = this.formBuilder.group({
      nome: [null]
    });
  }

  ngOnInit(): void {
    this.getGrupos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGrupos(){
    this.grupoService.getGrupos(this.filtroForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.grupos = res;
      }
    });
  }

  limpar(){
    this.filtroForm.reset();
  }

  openFormGrupo(){
    
  }

  editarGrupo(id: number){
    
  }

  deleteGrupo(grupoId: number){
    
  }
}
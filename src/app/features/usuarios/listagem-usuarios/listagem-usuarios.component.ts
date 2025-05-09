import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../../core/models/usuario.interface';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Grupo } from '../../../core/models/grupo.interface';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { GrupoService } from '../../../shared/services/grupo.service';
import { ToastrService } from 'ngx-toastr';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';

@Component({
  selector: 'app-listagem-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzModalModule, NzTableModule, DatePipe, NzButtonModule, NzToolTipModule, FontAwesomeModule, BtnPesquisarComponent, BtnLimparComponent],
  templateUrl: './listagem-usuarios.component.html',
  styleUrl: './listagem-usuarios.component.scss'
})
export class ListagemUsuariosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroForm!: FormGroup;
  usuarios: Usuario[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  faEye = faEye;
  grupos: Grupo[] = [];

  private modalService = inject(NzModalService);
  confirmModal?: NzModalRef;

  constructor(private usuarioService: UsuariosService, private formBuilder: FormBuilder,
    private grupoService: GrupoService, private toastr: ToastrService, private localStorageService: LocalstorageService){
    this.filtroForm = this.formBuilder.group({
      nome: [null],
      grupoId: ['']
    });
  }

  ngOnInit(): void {
    const userRoles = this.localStorageService.getAuthStorage().user.grupo.permissoes.map(p => p.nome);
    const hasPermissionGrupo = userRoles.includes('LISTAR_GRUPO');
    if(hasPermissionGrupo){
      this.getGrupos();
    } 
    this.getUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsuarios(){
    this.usuarioService.getUsuarios(this.filtroForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: Usuario[]) => {
        this.usuarios = res;
      }
    });
  }

  getGrupos(){
    this.grupoService.getGrupos(null)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.grupos = res;
      }
    });
  }

  limpar(){
    this.filtroForm.reset();
    this.filtroForm.get('grupoId')?.setValue('');
  }

  openModalFormUsuario(usuarioId?: string){
    const modal = this.modalService.create({
      nzTitle: usuarioId ? 'Edição de usuário' : 'Cadastro de usuário',
      nzContent: FormUsuarioComponent,
      nzWidth: '1000px',
      nzFooter: null,
      nzData: {
        usuarioId: usuarioId
      }
    });

    modal.afterClose.subscribe(() => {
      this.getUsuarios();
    });
  }

  deleteUsuario(usuarioId: string){
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover este usuário?',
      nzOnOk: () =>
        this.usuarioService.deleteUsuario(usuarioId).subscribe({
          next: () => {
            this.toastr.success('Usuário removido!', 'Sucesso');
            this.getUsuarios();
          }
        })
    });
  }

  avatar(usuario: Usuario){
    if(usuario.avatar){
      return usuario.avatar.url;
    }
    return 'images/avatar.webp';
  }
  
}

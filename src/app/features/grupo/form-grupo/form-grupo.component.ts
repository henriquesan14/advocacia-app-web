import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PermissaoCategoria } from '../../../core/models/permissao-categoria';
import { PermissaoService } from '../../../shared/services/permissao.service';
import { GrupoService } from '../../../shared/services/grupo.service';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Grupo } from '../../../core/models/grupo.interface';
import { ToastrService } from 'ngx-toastr';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-form-grupo',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, BtnCadastrarComponent, NzInputModule, NzCheckboxModule, NzButtonModule],
  templateUrl: './form-grupo.component.html',
  styleUrl: './form-grupo.component.scss'
})
export class FormGrupoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formGrupo!: FormGroup;
  permissoes: PermissaoCategoria[] = [];
  permissaoSelecionada: { [key: number]: boolean } = {};

  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Optional() @Inject(NZ_MODAL_DATA) public data: { grupoId: string },
    @Optional() private drawerRef: NzDrawerRef,
    @Optional() private modalRef: NzModalRef,
    private formBuilder: FormBuilder, private permissaoService: PermissaoService, private grupoService: GrupoService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formGrupo = this.formBuilder.group({
      nome: [null, Validators.required],
      sobAprovacao: [false]
    });
    this.getPermissoes();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGrupo() {
    this.grupoService.getGrupoById(this.data.grupoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.formGrupo.get('nome')?.setValue(res.nome);
          this.formGrupo.get('sobAprovacao')?.setValue(res.sobAprovacao);

          res.permissoes.forEach(permissao => {
            if (this.formGrupo.contains(String(permissao.id))) {
              this.formGrupo.get(String(permissao.id))?.setValue(true);
            }
          });
        }
      });
  }

  getPermissoes() {
    this.permissaoService.getPermissoes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.permissoes = res;
          this.inicializarFormulario();
        }
      })
  }

  inicializarFormulario(): void {
    const formControls: { [key: string]: any } = {}; // Definir tipo explícito

    this.permissoes.forEach(categoria => {
      categoria.permissoes.forEach(permissao => {
        formControls[permissao.id] = false;
      });
    });

    this.formGrupo = this.formBuilder.group({
      nome: ['', Validators.required],
      sobAprovacao: [false],
      ...formControls
    });

    if (this.data && this.data.grupoId) {
      this.getGrupo();
    }
  }

  selecionarTudo() {
    this.permissoes.forEach(categoria => {
      categoria.permissoes.forEach(permissao => {
        this.formGrupo.get([permissao.id])?.setValue(true);
      });
    });
  }

  desmarcarTudo() {
    this.permissoes.forEach(categoria => {
      categoria.permissoes.forEach(permissao => {
        this.formGrupo.get([permissao.id])?.setValue(false);
      });
    });
  }

  submit() {
    if (this.formGrupo.valid) {
      const permissoesSelecionadas = Object.keys(this.formGrupo.controls)
        .filter(key => key !== 'nome' && key !== 'sobAprovacao' && this.formGrupo.get(key)?.value)
        .map(key => key, 10);

      const novoGrupo = {
        nome: this.formGrupo.get('nome')?.value,
        sobAprovacao: this.formGrupo.get('sobAprovacao')?.value,
        permissoes: permissoesSelecionadas
      } as any;
      if (this.data && this.data.grupoId) {
        novoGrupo.id = this.data.grupoId;
        this.updateGrupo(novoGrupo);
        return;
      }
      this.cadastrarGrupo(novoGrupo);

    } else {
      FormUtils.markFormGroupTouched(this.formGrupo);
    }
  }

  cadastrarGrupo(grupo: any) {
    this.grupoService.addGrupo(grupo).subscribe({
      next: () => {
        this.toastr.success('Grupo adicionado!', 'Sucesso');
        this.close(true);
      }
    })
  }

  updateGrupo(grupo: any) {
    this.grupoService.updateGrupo(grupo).subscribe({
      next: () => {
        this.toastr.success('Grupo atualizado!', 'Sucesso');
        this.close(true);
      }
    })
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.formGrupo, fieldName);
  }

  close(result: boolean): void {
    if (this.drawerRef) {
      this.drawerRef.close(result);
    } else if (this.modalRef) {
      this.modalRef.close(result);
    }
  }
}

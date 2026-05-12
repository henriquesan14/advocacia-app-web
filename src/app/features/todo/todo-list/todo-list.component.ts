import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { TarefaService } from '../../../shared/services/tarefa.service';
import { Tarefa } from '../../../core/models/tarefa.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [NzCardModule, NzTagModule, NzBadgeModule, NzCheckboxModule, FormsModule, NzGridModule, CommonModule, DragDropModule, ReactiveFormsModule, NzFormModule, NzSelectModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  formFiltro!: FormGroup;
  constructor(private tarefaService: TarefaService, private usuarioService: UsuariosService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formFiltro = this.formBuilder.group({
      responsavelId: ['']
    });
    this.getTarefas();
    this.getResponsaveis();
    this.changeFiltro();
  }

  tarefas: Tarefa[] = [];
  responsaveis: Usuario[] = [];

  get pendentes() {
    return this.tarefas.filter(
      x => x.status === 'PENDENTE'
    );
  }

  get emAndamento() {
    return this.tarefas.filter(
      x => x.status === 'EM_ANDAMENTO'
    );
  }

  get concluidas() {
    return this.tarefas.filter(
      x => x.status === 'CONCLUIDA'
    );
  }

  getTarefas(){
    this.tarefaService.getTarefas(this.formFiltro.value).subscribe({
      next: (res) => {
        this.tarefas = res;
      }
    })
  }

  getResponsaveis(){
    this.usuarioService.getResponsaveis(null).subscribe({
      next: (res) => {
        this.responsaveis = res;
      }
    })
  }

  changeFiltro(){
    this.formFiltro.get('responsavelId')
      ?.valueChanges
      .subscribe(responsavelId => {
        this.tarefaService
          .getTarefas({responsavelId})
          .subscribe({
            next: (res) => {
              this.tarefas = res;
            }
          });

      });
  }

  drop(event: CdkDragDrop<any[]>) {

    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    const item =
      event.container.data[event.currentIndex];

    let novoStatus: string;

    switch (event.container.id) {

      case 'pendentes':
        novoStatus = 'PENDENTE';
        break;

      case 'emAndamento':
        novoStatus = 'EM_ANDAMENTO';
        break;

      default:
        novoStatus = 'CONCLUIDA';
        item.dataConclusao = new Date();
        break;
    }

    const statusAnterior = item.status;

    item.status = novoStatus;

    this.tarefaService
      .updateStatusTarefa({id: item.id, status: novoStatus})
      .subscribe({
        error: () => {

          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );

          item.status = statusAnterior;
        }
      });
  }

  getUrgenciaColor(urgencia: string): string {

    switch (urgencia) {
      case 'ALTA':
        return 'red';

      case 'MEDIA':
        return 'orange';

      default:
        return 'default';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';

@Component({
  selector: 'app-card-processo',
  standalone: true,
  imports: [CommonModule, IconClienteComponent, FontAwesomeModule, NzButtonModule, NroProcessoPipe],
  templateUrl: './card-processo.component.html',
  styleUrl: './card-processo.component.scss'
})
export class CardProcessoComponent {
  faRefresh = faRefresh;
  faTrash = faTrash;
  faEye = faEye;
  @Input() processo: any;
  @Input() getDias!: (data: string) => number;

  @Output() visualizar = new EventEmitter<number>();
  @Output() reiniciar = new EventEmitter<number>();
  @Output() excluir = new EventEmitter<number>();

  onVisualizar() {
    this.visualizar.emit(this.processo.id);
  }

  onReiniciar() {
    this.reiniciar.emit(this.processo.id);
  }

  onExcluir() {
    this.excluir.emit(this.processo.id);
  }

}

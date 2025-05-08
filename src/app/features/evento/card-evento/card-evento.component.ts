import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDay, faClock, faPencil, faTrash, faVideo, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IconClienteComponent } from '../../../shared/components/icon-cliente/icon-cliente.component';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, IconClienteComponent, NroProcessoPipe, NzButtonModule, NzToolTipModule],
  templateUrl: './card-evento.component.html',
  styleUrl: './card-evento.component.scss'
})
export class CardEventoComponent {
  @Input() evento!: any;
  @Output() editar = new EventEmitter<string>();
  @Output() excluir = new EventEmitter<string>();

  faClock = faClock;
  faCalendar = faCalendarDay;
  faVideo = faVideo;
  faPencil = faPencil;
  faTrash = faTrash;
  faCheckCircle = faCheckCircle;
    faTimes = faTimesCircle;

  getTextoReduzido(texto: string): string {
    return texto.length > 60 ? texto.substring(0, 60) + '...' : texto;
  }

  onEditar() {
    this.editar.emit(this.evento.id);
  }

  onExcluir() {
    this.excluir.emit(this.evento.id);
  }
}

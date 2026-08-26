import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Auditoria } from '../../../core/models/auditoria.interface';

@Component({
  selector: 'app-modal-auditoria',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './modal-auditoria.component.html',
  styleUrl: './modal-auditoria.component.scss'
})
export class ModalAuditoriaComponent {
  constructor(@Inject(NZ_MODAL_DATA) public auditoria: Auditoria) {}
}

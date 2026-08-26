import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Auditoria } from '../../../core/models/auditoria.interface';
import { ModalAuditoriaComponent } from '../modal-auditoria/modal-auditoria.component';

@Component({
  selector: 'btn-auditoria',
  standalone: true,
  imports: [FontAwesomeModule, NzButtonModule, NzToolTipModule],
  templateUrl: './btn-auditoria.component.html'
})
export class BtnAuditoriaComponent {
  @Input({ required: true }) auditoria!: Auditoria;

  protected readonly faClockRotateLeft = faClockRotateLeft;
  private readonly modalService = inject(NzModalService);

  abrir(): void {
    this.modalService.create({
      nzTitle: 'Informações de auditoria',
      nzContent: ModalAuditoriaComponent,
      nzData: this.auditoria,
      nzFooter: null,
      nzWidth: 600
    });
  }
}

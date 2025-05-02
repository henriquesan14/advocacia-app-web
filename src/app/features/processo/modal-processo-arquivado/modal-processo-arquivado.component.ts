import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-processo-arquivado',
  standalone: true,
  imports: [NzIconModule, NzModalModule, NzButtonModule, FontAwesomeModule],
  templateUrl: './modal-processo-arquivado.component.html',
  styleUrl: './modal-processo-arquivado.component.css'
})
export class ModalProcessoArquivadoComponent {
  faCheck = faCheck;
  faTimes = faTimes;
  faExclamationCircle = faExclamationCircle;

  handleCancel(): void {
    this.modalRef.destroy(false); // retorna 'false'
  }

  handleConfirm(): void {
    this.modalRef.destroy(true); // retorna 'true'
  }

  constructor(private modalRef: NzModalRef) {}
}

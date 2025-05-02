import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalFormAudienciaComponent } from '../../../modal-form-audiencia/modal-form-audiencia.component';
import { Audiencia } from '../../../../../core/models/audiencia.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tab-audiencias',
  standalone: true,
  imports: [BtnNovoComponent, NzTableModule, FontAwesomeModule, DatePipe],
  templateUrl: './tab-audiencias.component.html',
  styleUrl: './tab-audiencias.component.scss'
})
export class TabAudienciasComponent {
  faTrash = faTrash;
  audiencias: Audiencia[] = [];

  @Output() audienciasChange = new EventEmitter<Audiencia[]>();

  modalService = inject(NzModalService);

  openModalFormAudiencia() {
    const modal = this.modalService.create({
      nzTitle: 'Cadastro de audiência',
      nzContent: ModalFormAudienciaComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.audiencias.push(result);
        this.audienciasChange.emit(this.audiencias);
      }
    });
  }

  deleteAudiencia(index: any) {
    this.audiencias.splice(index, 1);
    this.audienciasChange.emit(this.audiencias);
  }

  getTextoReduzido(descricao: string) {
    if (descricao.length <= 30) {
      return descricao;
    }
    return `${descricao.substring(0, 30)}...`;
  }
}

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Diligencia } from '../../../../../core/models/diligencia.interface';
import { ModalFormDiligenciaComponent } from '../../../modal-form-diligencia/modal-form-diligencia.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tab-diligencias',
  standalone: true,
  imports: [BtnNovoComponent, NzTableModule, FontAwesomeModule, DatePipe],
  templateUrl: './tab-diligencias.component.html',
  styleUrl: './tab-diligencias.component.scss'
})
export class TabDiligenciasComponent {
  faTrash = faTrash;
  diligencias: Diligencia[] = [];

  @Output() diligenciasChange = new EventEmitter<Diligencia[]>();
  
  modalService = inject(NzModalService);

  openModalFormDiligencia() {
      const modal = this.modalService.create({
        nzTitle: 'Cadastro de diligência',
        nzContent: ModalFormDiligenciaComponent,
        nzWidth: '800px',
        nzFooter: null
      });
  
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.diligencias.push(result);
          this.diligenciasChange.emit(this.diligencias);
        }
      });
  
    }

  deleteDiligencia(index: any) {
    this.diligencias.splice(index, 1);
    this.diligenciasChange.emit(this.diligencias);
  }

  getTextoReduzido(descricao: string) {
    if (descricao.length <= 30) {
      return descricao;
    }
    return `${descricao.substring(0, 30)}...`;
  }

}

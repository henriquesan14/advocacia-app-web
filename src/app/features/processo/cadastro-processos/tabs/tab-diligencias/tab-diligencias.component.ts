import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Diligencia } from '../../../../../core/models/diligencia.interface';
import { ModalFormDiligenciaComponent } from '../../../modal-form-diligencia/modal-form-diligencia.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DiligenciaService } from '../../../../../shared/services/diligencia.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tab-diligencias',
  standalone: true,
  imports: [BtnNovoComponent, NzTableModule, FontAwesomeModule, DatePipe, NzButtonModule, NzToolTipModule],
  templateUrl: './tab-diligencias.component.html',
  styleUrl: './tab-diligencias.component.scss'
})
export class TabDiligenciasComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  @Input() diligencias: Diligencia[] = [];

  @Input() processoId?: string;

  @Output() diligenciasChange = new EventEmitter<Diligencia[]>();
  
  modalService = inject(NzModalService);
  diligenciaService = inject(DiligenciaService);
  toastr = inject(ToastrService);

  openModalFormDiligencia(diligencia?: Diligencia) {
      const modal = this.modalService.create({
        nzTitle: diligencia ? 'Edição de diligência' : 'Cadastro de diligência',
        nzContent: ModalFormDiligenciaComponent,
        nzWidth: '800px',
        nzFooter: null,
        nzData: {
          processoId: this.processoId,
          diligencia: diligencia
        }
      });
  
      modal.afterClose.subscribe((result: Diligencia) => {
        if (!result) return;
    
        const index = this.diligencias.findIndex(d => d.id === result.id);
    
        if (index > -1) {
          this.diligencias[index] = result;
        } else {
          this.diligencias.push(result);
        }
    
        this.diligenciasChange.emit(this.diligencias);
      });
  
    }

  deleteDiligencia(diligenciaId: string, index: any) {
    if (this.processoId) {
      this.diligenciaService.deleteDiligencia(diligenciaId).subscribe({
        next: () => {
          this.toastr.success('Diligência excluída com sucesso!', 'Sucesso');
          this.diligencias.splice(index, 1);
          this.diligenciasChange.emit(this.diligencias);
        },
        error: () => {
          this.toastr.error('Erro ao excluir histórico', 'Erro');
        }
      });
    }else{
      this.diligencias.splice(index, 1);
      this.diligenciasChange.emit(this.diligencias);
    }
  }

  getTextoReduzido(descricao: string) {
    if (descricao.length <= 30) {
      return descricao;
    }
    return `${descricao.substring(0, 30)}...`;
  }

}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalFormAudienciaComponent } from '../../../modal-form-audiencia/modal-form-audiencia.component';
import { Audiencia } from '../../../../../core/models/audiencia.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AudienciaService } from '../../../../../shared/services/audiencia.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tab-audiencias',
  standalone: true,
  imports: [BtnNovoComponent, NzTableModule, FontAwesomeModule, DatePipe, NzButtonModule],
  templateUrl: './tab-audiencias.component.html',
  styleUrl: './tab-audiencias.component.scss'
})
export class TabAudienciasComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  @Input() audiencias: Audiencia[] = [];

  @Input() processoId?: string;

  @Output() audienciasChange = new EventEmitter<Audiencia[]>();

  modalService = inject(NzModalService);
  audienciaService = inject(AudienciaService);
  toastr = inject(ToastrService);

  openModalFormAudiencia(audiencia?: Audiencia) {
    const modal = this.modalService.create({
      nzTitle: audiencia ? 'Edição de audiência' : 'Cadastro de audiência',
      nzContent: ModalFormAudienciaComponent,
      nzWidth: '800px',
      nzFooter: null,
      nzData: {
        processoId: this.processoId,
        audiencia: audiencia
      }
    });

    modal.afterClose.subscribe((result: Audiencia) => {
      if (!result) return;
  
      const index = this.audiencias.findIndex(d => d.id === result.id);
  
      if (index > -1) {
        this.audiencias[index] = result;
      } else {
        this.audiencias.push(result);
      }
  
      this.audienciasChange.emit(this.audiencias);
    });
  }

  deleteAudiencia(audienciaId: string, index: any) {
    if (this.processoId) {
      this.audienciaService.deleteAudiencia(audienciaId).subscribe({
        next: () => {
          this.toastr.success('Audiência excluída com sucesso!', 'Sucesso');
          this.audiencias.splice(index, 1);
          this.audienciasChange.emit(this.audiencias);
        },
        error: () => {
          this.toastr.error('Erro ao excluir histórico', 'Erro');
        }
      });
    }else{
      this.audiencias.splice(index, 1);
      this.audienciasChange.emit(this.audiencias);
    }
  }

  getTextoReduzido(descricao: string) {
    if (descricao.length <= 30) {
      return descricao;
    }
    return `${descricao.substring(0, 30)}...`;
  }
}

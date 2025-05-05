import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormHistoricoComponent } from '../../../form-historico/form-historico.component';
import { CardHistoricoComponent } from '../../../card-historico/card-historico.component';
import { Historico } from '../../../../../core/models/historico.interface';
import { HistoricoService } from '../../../../../shared/services/historico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tab-historicos',
  standalone: true,
  imports: [FormHistoricoComponent, CardHistoricoComponent],
  templateUrl: './tab-historicos.component.html',
  styleUrl: './tab-historicos.component.scss'
})
export class TabHistoricosComponent {
  @Input() historicos: Historico[] = [];
  @Input() processoId?: string;
  historicoService = inject(HistoricoService);
  toastr = inject(ToastrService);

  @Output() historicosChange = new EventEmitter<Historico[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historicos']) {
      this.historicos = [...this.historicos];
    }
  }

  addHistorico(historico: any) {
    this.historicos.push(historico);
    this.historicosChange.emit(this.historicos);
  }

  deleteHistorico(historicoId: number, index: number) {
    if (this.processoId) {
      this.historicoService.deleteHistorico(historicoId).subscribe({
        next: () => {
          this.toastr.success('Histórico excluído com sucesso!', 'Sucesso');
          this.historicos.splice(index, 1);
          this.historicosChange.emit(this.historicos);
        },
        error: () => {
          this.toastr.error('Erro ao excluir histórico', 'Erro');
        }
      });
    } else {
      // Caso seja uma exclusão local antes de salvar no back-end
      this.historicos.splice(index, 1);
      this.historicosChange.emit(this.historicos);
    }
  }

  atualizarHistorico(historicoAtualizado: Historico) {
    const index = this.historicos.findIndex(h => h.id === historicoAtualizado.id);
    if (index !== -1) {
      this.historicos[index] = historicoAtualizado;
    }
  }
}

import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormHistoricoComponent } from '../../../form-historico/form-historico.component';
import { CardHistoricoComponent } from '../../../card-historico/card-historico.component';
import { Historico } from '../../../../../core/models/historico.interface';
import { HistoricoService } from '../../../../../shared/services/historico.service';
import { ToastrService } from 'ngx-toastr';
import { ResponsePage } from '../../../../../core/models/response-page.interface';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { HasRoleDirective } from '../../../../../shared/directives/has-role.directive';

@Component({
  selector: 'tab-historicos',
  standalone: true,
  imports: [FormHistoricoComponent, CardHistoricoComponent, NzPaginationModule, HasRoleDirective],
  templateUrl: './tab-historicos.component.html',
  styleUrl: './tab-historicos.component.scss'
})
export class TabHistoricosComponent {
  @Input() responsePageHistoricos: ResponsePage<Historico> = {
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    items: [],
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  };
  @Input() processoId?: string;
  historicoService = inject(HistoricoService);
  toastr = inject(ToastrService);

  @Output() historicosChange = new EventEmitter<ResponsePage<Historico>>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['responsePageHistoricos']) {
      this.responsePageHistoricos = this.responsePageHistoricos;
    }
  }

  addHistorico(historico: any) {
    this.responsePageHistoricos.items.push(historico);
    this.historicosChange.emit(this.responsePageHistoricos);
  }

  deleteHistorico(historicoId: string, index: number) {
    if (this.processoId) {
      this.historicoService.deleteHistorico(historicoId).subscribe({
        next: () => {
          this.toastr.success('Histórico excluído com sucesso!', 'Sucesso');
          this.responsePageHistoricos.items.splice(index, 1);
          this.historicosChange.emit(this.responsePageHistoricos);
        },
        error: () => {
          this.toastr.error('Erro ao excluir histórico', 'Erro');
        }
      });
    } else {
      // Caso seja uma exclusão local antes de salvar no back-end
      this.responsePageHistoricos.items.splice(index, 1);
      this.historicosChange.emit(this.responsePageHistoricos);
    }
  }

  atualizarHistorico(historicoAtualizado: Historico) {
    const index = this.responsePageHistoricos.items.findIndex(h => h.id === historicoAtualizado.id);
    if (index !== -1) {
      this.responsePageHistoricos.items[index] = historicoAtualizado;
    }
  }

  onPageChange(page: number) {
    this.responsePageHistoricos.currentPage = page;
    this.historicosChange.emit(this.responsePageHistoricos);
  }

  onPageSizeChange(size: number) {
    this.responsePageHistoricos.pageSize = size;
    this.responsePageHistoricos.currentPage = 1;

    this.historicosChange.emit(this.responsePageHistoricos);
  }
}

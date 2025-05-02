import { Component, EventEmitter, Output } from '@angular/core';
import { FormHistoricoComponent } from '../../../form-historico/form-historico.component';
import { CardHistoricoComponent } from '../../../card-historico/card-historico.component';
import { Historico } from '../../../../../core/models/historico.interface';

@Component({
  selector: 'tab-historicos',
  standalone: true,
  imports: [FormHistoricoComponent, CardHistoricoComponent],
  templateUrl: './tab-historicos.component.html',
  styleUrl: './tab-historicos.component.scss'
})
export class TabHistoricosComponent {
  historicos: Historico[] = [];

  @Output() historicosChange = new EventEmitter<Historico[]>();

  addHistorico(historico: any) {
    this.historicos.push(historico);
    this.historicosChange.emit(this.historicos);
  }

  deleteHistorico(index: any) {
    this.historicos.splice(index, 1);
    this.historicosChange.emit(this.historicos);
  }
}

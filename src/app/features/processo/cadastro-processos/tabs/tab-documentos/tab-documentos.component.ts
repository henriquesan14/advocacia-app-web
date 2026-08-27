import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Documento } from '../../../../../core/models/documento.interface';

@Component({
  selector: 'tab-documentos',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './tab-documentos.component.html',
  styleUrl: './tab-documentos.component.scss'
})
export class TabDocumentosComponent {
  @Input() documentos: Documento[] = [];

  @Input() processoId?: string;

  @Output() documentosChange = new EventEmitter<Documento[]>();

}

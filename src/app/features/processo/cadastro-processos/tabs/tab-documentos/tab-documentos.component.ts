import { Component, EventEmitter, Output } from '@angular/core';
import { UploadFileComponent } from '../../../../../shared/components/upload-file/upload-file.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Documento } from '../../../../../core/models/documento.interface';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tab-documentos',
  standalone: true,
  imports: [UploadFileComponent, NzTableModule, FontAwesomeModule],
  templateUrl: './tab-documentos.component.html',
  styleUrl: './tab-documentos.component.scss'
})
export class TabDocumentosComponent {
  documentos: Documento[] = [];

  @Output() documentosChange = new EventEmitter<Documento[]>();

  faTrash = faTrash;

  onFilesDropped(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      const urlLocal = URL.createObjectURL(files[i]);
      const fileUpload: Documento = { nome: files[i].name, urlLocal, tipo: files[i].type.toString(), file: files[i] };
      this.documentos.push(fileUpload);
      this.documentosChange.emit(this.documentos);
    }
  }

  deleteDocumento(index: number) {
    this.documentos.splice(index, 1);
    this.documentosChange.emit(this.documentos);
  }
}

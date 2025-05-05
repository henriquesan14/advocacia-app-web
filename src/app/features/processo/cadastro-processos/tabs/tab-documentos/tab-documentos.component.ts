import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UploadFileComponent } from '../../../../../shared/components/upload-file/upload-file.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Documento } from '../../../../../core/models/documento.interface';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DocumentoService } from '../../../../../shared/services/documento.service';
import { ToastrService } from 'ngx-toastr';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../../../../shared/services/data-service';

@Component({
  selector: 'tab-documentos',
  standalone: true,
  imports: [UploadFileComponent, NzTableModule, FontAwesomeModule, NzButtonModule],
  templateUrl: './tab-documentos.component.html',
  styleUrl: './tab-documentos.component.scss'
})
export class TabDocumentosComponent {
  @Input() documentos: Documento[] = [];

  @Input() processoId?: string;

  @Output() documentosChange = new EventEmitter<Documento[]>();

  faTrash = faTrash;

  documentoService = inject(DocumentoService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  dataService = inject(DataService);

  async onFilesDropped(files: File[]) {
    if (this.processoId) {
      try {
        const promises = files.map(async (file) => {
          const fileUpload: Documento = { nome: file.name, tipo: file.type.toString(), file };
          this.documentos.push(fileUpload);
          return this.uploadToStorage(fileUpload);
        });

        await Promise.all(promises);

        this.toastr.success('Documentos adicionados!', 'Sucesso');
        this.documentosChange.emit(this.documentos);
      } catch (error) {
        this.toastr.error('Erro ao enviar arquivos', 'Erro');
      }
    }else{
      for (let i = 0; i < files.length; i++) {
        const urlLocal = URL.createObjectURL(files[i]);
        const fileUpload: Documento = { nome: files[i].name, urlLocal, tipo: files[i].type.toString(), file: files[i] };
        this.documentos.push(fileUpload);
        this.documentosChange.emit(this.documentos);
      }
    }
  }

  uploadToStorage(documentoUpload: Documento): Promise<void> {
    return new Promise((resolve, reject) => {
      this.spinner.show();
      this.dataService.pushFileToStorage(documentoUpload.file, "documentos").subscribe({
        next: (res) => {
          documentoUpload.url = res.url;
          documentoUpload.processoId = this.processoId;
          documentoUpload.path = res.path;
          this.documentoService.cadastrarDocumento(documentoUpload).subscribe({
            next: (res) => {
              documentoUpload.id = res.id;
              resolve();
            },
            error: (err) => {
              this.spinner.hide();
              reject(err);
            },
            complete: () => {
              this.spinner.hide();
            }
          });
        },
        error: (err) => {
          this.spinner.hide();
          reject(err);
        }
      });
    });
  }

  async deleteDocumento(documento: Documento, index: number) {
    if (documento.id) {
      try {
        await this.dataService.deleteFile(documento.path!);
        this.documentoService.removeDocumento(documento.id!).subscribe({
          next: () => {
            this.dataService.deleteFile(documento.path!).subscribe();
            this.toastr.success('Documento removido!', 'Sucesso');
            this.documentos.splice(index, 1);
            this.documentosChange.emit(this.documentos);
          }
        })
      } catch (e) {
        this.toastr.error('Erro ao remover documento', 'Error');
      }
    } else {
      this.documentos.splice(index, 1);
      this.documentosChange.emit(this.documentos);
    }
  }
}

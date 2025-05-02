import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent {
  @Output() filesDropped = new EventEmitter<File[]>();
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  faUploadAlt = faCloudUploadAlt;

  constructor() { }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const fileList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i]);
    }
    this.filesDropped.emit(fileList);
    this.resetInput();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files: any | null = event.dataTransfer?.files;
    if (files) {
      const fileList: File[] = [];
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i]);
      }
      this.filesDropped.emit(fileList);
      this.resetInput();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  resetInput(): void {
    this.fileInputRef.nativeElement.value = '';
  }
}

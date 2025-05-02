import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressorService {

  constructor() { }

  compressImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar a imagem se necessário para ajustar os limites de largura e altura
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Converter o canvas para um Blob
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, file.type, quality);
        };
        img.onerror = (error) => {
          reject(error);
        };
      };
    });
  }
}

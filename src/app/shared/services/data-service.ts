import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadResult } from '../../core/models/upload-result.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private API: string = environment.apiUrlBase;

  constructor(private http: HttpClient){}

  pushFileToStorage(fileUpload: File, folder: string): Observable<UploadResult> {
    const formData: FormData = new FormData();
    formData.append('FormFile', fileUpload, fileUpload.name);
    formData.append('FolderName', folder);
    return this.http.post<UploadResult>(`${this.API}/storage`, formData);
  }

  deleteFile(path: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<void>(`${this.API}/storage`, {
      headers,
      body: { path }
    });
  }
}

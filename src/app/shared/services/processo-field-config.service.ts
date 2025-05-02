import { Injectable } from '@angular/core';
import { ProcessoFieldConfig } from '../../core/models/processo-field-config.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UpdateProcessoFieldConfig } from '../../core/models/update-processo-field-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessoFieldConfigService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getProcessoFieldConfigs(): Observable<ProcessoFieldConfig[]>{
    return this.http.get<ProcessoFieldConfig[]>(`${this.API}/processoFieldConfig`);
  }

  updateFieldConfigs(updatedFields: UpdateProcessoFieldConfig){
    return this.http.put(`${this.API}/processoFieldConfig`, updatedFields);
  }
}

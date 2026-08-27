import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginAudit } from '../../core/models/login-audit.interface';

@Injectable({ providedIn: 'root' })
export class LoginAuditService {
  constructor(private readonly http: HttpClient) {}

  getAll(filters: { usuario?: string; dataInicio?: Date; dataFim?: Date }): Observable<LoginAudit[]> {
    let params = new HttpParams();
    if (filters.usuario) params = params.set('usuario', filters.usuario);
    if (filters.dataInicio) params = params.set('dataInicio', this.formatDate(filters.dataInicio));
    if (filters.dataFim) params = params.set('dataFim', this.formatDate(filters.dataFim));
    return this.http.get<LoginAudit[]>(`${environment.apiUrlBase}/platform/login-audits`, { params });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

import { Injectable } from '@angular/core';
import { Usuario } from '../../core/models/usuario.interface';
import { ImpersonationSession } from '../../core/models/impersonation.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setUserStorage(data: Usuario){
    const dataString = JSON.stringify(data);
    localStorage.setItem('user', dataString);
  }

  getUserStorage(): Usuario{
    const dataString = localStorage.getItem('user');
    return JSON.parse(dataString!);
  }

  removeUsertorage(){
    localStorage.removeItem('user');
    localStorage.removeItem('impersonation');
  }

  setImpersonation(session: ImpersonationSession): void {
    localStorage.setItem('impersonation', JSON.stringify(session));
  }

  getImpersonation(): ImpersonationSession | null {
    const data = localStorage.getItem('impersonation');
    return data ? JSON.parse(data) : null;
  }

  clearImpersonation(): void {
    localStorage.removeItem('impersonation');
  }

  setSidebarCollapsed(collapsed: boolean): void {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }

  getSidebarCollapsed(): boolean {
    const collapsed = localStorage.getItem('sidebar-collapsed');
    return collapsed === null ? true : collapsed === 'true';
  }
}

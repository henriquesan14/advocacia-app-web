import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notification } from '../../core/models/notification.interface';
import { ResponsePage } from '../../core/models/response-page.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<any>(null);
  notification$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.urlHub}/hubs/notifications`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      this.notificationSubject.next(notification);
    });

    this.hubConnection.start()
      .then(() => {})
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.error('Error while stopping SignalR connection: ' + err));
    }
  }

  sendNotification(notificacao: any){
    return this.http.post(`${environment.apiUrlBase}/notificacao`, notificacao);
  }

  getNotifications(parametros: any): Observable<ResponsePage<Notification>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Notification>>(`${environment.apiUrlBase}/notificacao`, {params});
  }

  getCountNaoLidas(): Observable<number>{
    return this.http.get<number>(`${environment.apiUrlBase}/notificacao/count`);
  }

  marcarComoLida(id: number){
    return this.http.put(`${environment.apiUrlBase}/notificacao`, {id});
  }

  marcarTodasComoLidas(){
    return this.http.put(`${environment.apiUrlBase}/notificacao/mark-as-read`, {});
  }

  limparNotificacoesLidas(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrlBase}/notificacao/read`);
  }
}

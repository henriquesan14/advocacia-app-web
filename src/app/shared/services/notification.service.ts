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

  startConnection(userId: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.urlHub}/hubs/notifications?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      this.notificationSubject.next(notification);
    });

    this.hubConnection.start()
      .then(() => {
        this.joinGroup(userId);
      })
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.error('Error while stopping SignalR connection: ' + err));
    }
  }

  joinGroup(userId: string): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('JoinGroup', userId)
        .then(() => {})
        .catch(err => console.error('Error while joining group: ' + err));
    } else {
      console.error('Cannot join group: SignalR connection is not in the connected state.');
    }
  }

  leaveGroup(userId: string): void {
    this.hubConnection.invoke('LeaveGroup', userId)
      .catch(err => console.error('Error while leaving group: ' + err));
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
}

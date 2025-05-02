import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  
  deleteAvatar(id: number){
    return this.http.delete(`${this.API}/avatar/${id}`);
  }
}

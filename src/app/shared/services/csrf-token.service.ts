import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CsrfTokenResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private readonly storageKey = 'csrf_token';
  private tokenRequest?: Observable<string>;

  constructor(private http: HttpClient) {}

  getToken(): Observable<string> {
    const storedToken = sessionStorage.getItem(this.storageKey);
    if (storedToken) {
      return new Observable<string>(subscriber => {
        subscriber.next(storedToken);
        subscriber.complete();
      });
    }

    this.tokenRequest ??= this.http
      .get<CsrfTokenResponse>(`${environment.apiUrlBase}/auth/csrf-token`, {
        withCredentials: true
      })
      .pipe(
        map(response => {
          sessionStorage.setItem(this.storageKey, response.token);
          return response.token;
        }),
        shareReplay(1)
      );

    return this.tokenRequest;
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
    this.tokenRequest = undefined;
  }
}

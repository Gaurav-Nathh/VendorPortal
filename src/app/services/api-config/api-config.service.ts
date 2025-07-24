import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  // private apiUrl = 'https://efactoapitest.efacto.cloud/api';
  private apiUrl = 'https://efactoapitest.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';

  constructor() {}

  getApiUrl(): string {
    return this.apiUrl;
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
  }
}

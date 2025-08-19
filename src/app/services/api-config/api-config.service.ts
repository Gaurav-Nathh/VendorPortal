import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  // private apiUrl = 'https://efactoapitest.efacto.cloud/api';
  // private apiKey = '140-9299-524-TEST';

  private apiUrl: string = '';
  private apiKey: string = '';
  private logInPageUrl: string = '';
  private isProduction: boolean = false;
  private efactoAppUrl: string = '';
  // private logInPageUrl: string = 'http://127.0.0.1:5501/';

  constructor() {}

  initialize(): void {
    const currentUrl = window.location.href;
    if (currentUrl.includes('localhost:')) {
      this.isProduction = false;
      this.logInPageUrl = '/login';
    } else {
      this.isProduction = true;
      this.logInPageUrl = 'http://127.0.0.1:5501/';
    }
  }

  getEfactoAppUrl(): string {
    return this.efactoAppUrl;
  }

  setConfig(apiUrl: string, apiKey: string): void {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  getLoginPageUrl(): string {
    return this.logInPageUrl;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getIsProduction(): boolean {
    return this.isProduction;
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
  }

  getHead(): string {
    return this.apiKey;
  }

  clearConfig(): void {
    this.apiUrl = '';
    this.apiKey = '';
  }
}

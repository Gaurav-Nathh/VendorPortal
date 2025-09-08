import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  // private apiUrl = 'https://efactoapitest.efacto.cloud/api';
  // private apiKey = '140-9299-524-TEST';
  // private logInPageUrl: string = 'http://127.0.0.1:5501/';

  private apiUrl: string = '';
  private apiKey: string = '';
  private logInPageUrl: string = '';
  private isProduction: boolean = false;
  private efactoAppUrl: string = '';
  private AWSS3BucketUrl: string = '';

  constructor() {}

  initialize(): void {
    const currentUrl = window.location.href;
    if (
      currentUrl.includes('localhost:') ||
      currentUrl.includes('192.168.1.7:4200')
    ) {
      this.isProduction = false;
      this.logInPageUrl = '/login';
    } else {
      this.isProduction = true;
      this.logInPageUrl = 'https://erptest.efacto.cloud/';
    }
  }

  getEfactoAppUrl(): string {
    return this.efactoAppUrl;
  }

  setConfig(apiUrl: string, apiKey: string, awsS3Url: string): void {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.AWSS3BucketUrl = awsS3Url;
  }

  getLoginPageUrl(): string {
    return this.logInPageUrl;
  }

  getAWSS3BucketUrl(): string {
    return this.AWSS3BucketUrl;
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

import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any = {};

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    // this.config = {
    //   apiBaseUrl: 'https://efactoapidevelopment.efacto.cloud/api',
    //   apiCode: '140-9299-524-TEST',
    // };
    if (isDevMode()) {
      const data = await firstValueFrom(this.http.get('/assets/config.json'));
      this.config = data;
    } else {
      this.config.apiBaseUrl = (window as any)['env']?.apiBaseUrl || '';
      this.config.apiCode = (window as any)['env']?.apiCode || '';
      return Promise.resolve();
    }
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl || '';
  }

  get apiCode(): string {
    return this.config.apiCode || '';
  }
}

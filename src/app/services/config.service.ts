import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any = {};

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/config.json')).then((data) => {
      this.config = data;
      this.config.apiBaseUrl =
        (window as any)['env']['apiUrl'] || this.config.apiUrl;
      this.config.apiCode =
        (window as any)['env']['apiKey'] || this.config.apiKey;
    });
  }

  get apiUrl(): string {
    return this.config.apiUrl || '';
  }

  get apiCode(): string {
    return this.config.apiKey || '';
  }
}

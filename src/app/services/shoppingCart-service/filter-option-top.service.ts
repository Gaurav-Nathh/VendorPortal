import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterOptionTopService {
  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';

  constructor(private http: HttpClient) {}

  getFilterOptionsTop(categoryType: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    const params = new HttpParams().set('CatType', categoryType);
    return this.http.get<any[]>(
      `${this.apiUrl}/Common/GetShopCartCatgoryList`,
      { headers, params }
    );
  }
}

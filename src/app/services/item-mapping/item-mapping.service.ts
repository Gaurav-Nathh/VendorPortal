import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ItemMappingService {
  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
  private mappingItemsSubject = new BehaviorSubject<any[]>([]);
  mappingItems$ = this.mappingItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMappingItems(): Observable<any[]> {
    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any[]>(`${this.apiUrl}/Item/GetItemByVendorCustomer`, {
        headers,
        params: { acmId: this.acmId },
      })
      .pipe(tap((response) => this.mappingItemsSubject.next(response)));
  }

  getCurrentMappingItems(): any[] {
    return this.mappingItemsSubject.getValue();
  }
}

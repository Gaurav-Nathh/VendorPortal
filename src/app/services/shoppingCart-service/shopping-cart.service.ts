import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';
  private btpCode: string | null = null;
  private checkoutItemsSubject = new BehaviorSubject<any[]>([]);
  public checkoutItems$ = this.checkoutItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getItems(filters: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    return this.http.post<any[]>(
      `${this.apiUrl}/Common/GetShopCartItemCatgoryList`,
      filters,
      { headers }
    );
  }

  setBtpCode(code: string): void {
    this.btpCode = code;
  }

  getBtpCode(): string | null {
    return this.btpCode;
  }

  setCheckoutItems(items: any[]): void {
    this.checkoutItemsSubject.next([...items]);
  }

  putCheckoutItems(newItems: any[]): void {
    const currentItems = this.checkoutItemsSubject.getValue();
    this.checkoutItemsSubject.next([...currentItems, ...newItems]);
  }

  getCheckoutItems(): any[] {
    return this.checkoutItemsSubject.getValue();
  }
}

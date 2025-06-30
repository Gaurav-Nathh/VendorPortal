import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PSOMain } from '../../../Models/SalesOrder/SalesOrder';
import { map, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private apiUrlLocal = 'http://localhost:5024/api';

  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';

  private editableItemId: any;

  constructor(private http: HttpClient) {}

  postSalesOrder(salesOrder: PSOMain): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrlLocal}/PSOMain/CreatePSO`, salesOrder)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateSalesOrder(updatedOrder: PSOMain): Observable<any> {
    console.log('Updated Order:', updatedOrder);
    return this.http
      .post<any>(`${this.apiUrlLocal}/PSOMain/UpdatePSO`, updatedOrder)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteSalesOrder(mkey: string): Observable<string> {
    return this.http.delete(`${this.apiUrlLocal}/PSOMain/DeletePSO/${mkey}`, {
      responseType: 'text',
    });
  }

  getItemsDetail(codes: { code: string }[]): Observable<any[]> {
    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    return this.http
      .post<{ Detail: any[] }>(
        `${this.apiUrl}/Common/GetItemDetailList`,
        codes,
        { headers }
      )
      .pipe(map((response) => response.Detail || []));
  }

  getOrderList(acmId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(
      `${this.apiUrlLocal}/PSOMain/GetPSOByAcmID/${acmId}`,
      { headers }
    );
  }

  setEditableItemIds(items: any) {
    this.editableItemId = items;
  }
  getEditableItemIds(): any {
    return this.editableItemId;
  }
  clearEditableItemIds() {
    this.editableItemId = [];
  }
}

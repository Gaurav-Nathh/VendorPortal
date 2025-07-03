import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PSOMain } from '../../../Models/SalesOrder/SalesOrder';
import { map, catchError, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  // private apiUrlLocal = 'http://localhost:5024/api';
  private apiUrlLocal = 'http://localhost:5252/api';

  private editableItem: any;

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  postSalesOrder(salesOrder: PSOMain): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrlLocal}/PSOMain/CreatePSO`, salesOrder)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateSalesOrder(updatedOrder: PSOMain): Observable<string> {
    return this.http
      .put<{ message: string }>(
        `${this.apiUrlLocal}/PSOMain/UpdatePSO`,
        updatedOrder
      )
      .pipe(
        map((res) => res.message),
        catchError((error) => throwError(() => error))
      );
  }

  deleteSalesOrder(mkey: string): Observable<string> {
    return this.http.delete(`${this.apiUrlLocal}/PSOMain/DeletePSO/${mkey}`, {
      responseType: 'text',
    });
  }

  getItemsDetail(codes: { code: string }[]): Observable<any[]> {
    const headers = this.config.getHeader();
    return this.http
      .post<{ Detail: any[] }>(
        `${this.config.getApiUrl()}/Common/GetItemDetailList`,
        codes,
        { headers }
      )
      .pipe(map((response) => response.Detail || []));
  }

  getOrderList(
    acmId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlLocal}/PSOMain/GetPSOByAcmID/${acmId}`,
      {
        params: {
          pageNumber,
          pageSize,
        },
      }
    );
  }

  setEditableItem(items: any) {
    this.editableItem = items;
    console.log(items);
  }
  getEditableItem(): any {
    return this.editableItem;
  }
  clearEditableItem() {
    this.editableItem = [];
  }
}

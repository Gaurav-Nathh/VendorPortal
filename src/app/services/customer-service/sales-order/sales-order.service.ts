import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PSOMain } from '../../../Models/SalesOrder/SalesOrder';
import { map, catchError, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  // private apiUrlLocal = 'http://localhost:5252/api';
  private apiUrlLocal = 'http://localhost:5000/api';
  private editableItem: any;

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  postSalesOrder(salesOrder: PSOMain): Observable<any> {
    const headers = this.config.getHeader();
    return this.http
      .post<any>(`${this.config.getApiUrl()}/PSO/CreatePSO`, salesOrder, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateSalesOrder(updatedOrder: PSOMain): Observable<string> {
    const headers = this.config.getHeader();
    return this.http
      .put<{ message: string }>(
        // `${this.config.getApiUrl()}/PSO/UpdatePSO`,
        `${this.apiUrlLocal}/PSO/UpdatePSO`,
        updatedOrder,
        { headers }
      )
      .pipe(
        map((res) => res.message),
        catchError((error) => throwError(() => error))
      );
  }

  deleteSalesOrder(mkey: string): Observable<string> {
    const headers = this.config.getHeader();
    return this.http.delete(
      `${this.config.getApiUrl()}/PSO/DeletePSO/${mkey}`,
      {
        responseType: 'text',
        headers,
      }
    );
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
    pageSize: number,
    searchOrderNoTerm?: string
  ): Observable<any> {
    const params: any = {
      pageNumber,
      pageSize,
    };

    const headers = this.config.getHeader();

    if (searchOrderNoTerm?.trim()) {
      params.searchOrderNoTerm = searchOrderNoTerm;
    }
    return this.http.get<any>(
      `${this.config.getApiUrl()}/PSO/GetPSOByAcmID/${acmId}`,
      {
        params,
        headers,
      }
    );
  }

  setEditableItem(items: any) {
    this.editableItem = items;
  }
  getEditableItem(): any {
    return this.editableItem;
  }
  clearEditableItem() {
    this.editableItem = [];
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PSOMain, SOMain } from '../../../Models/SalesOrder/SalesOrder';
import { map, catchError, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private editableItem: any;

  constructor(private http: HttpClient, private config: ApiConfigService, public datepipe: DatePipe) { }

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
        `${this.config.getApiUrl()}/PSO/UpdatePSO`,
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

  // getOrderListt(
  //   acmId: number,
  //   pageNumber: number,
  //   pageSize: number,
  //   searchOrderNoTerm?: string
  // ): Observable<any> {
  //   const params: any = {
  //     pageNumber,
  //     pageSize,
  //   };

  //   const headers = this.config.getHeader();

  //   if (searchOrderNoTerm?.trim()) {
  //     params.searchOrderNoTerm = searchOrderNoTerm;
  //   }
  //   return this.http.get<any>(
  //     `${this.config.getApiUrl()}/PSO/GetPSOByAcmID/${acmId}`,
  //     {
  //       params,
  //       headers,
  //     }
  //   );
  // }

  setEditableItem(items: any) {
    this.editableItem = items;
  }
  getEditableItem(): any {
    return this.editableItem;
  }
  clearEditableItem() {
    this.editableItem = [];
  }

  BindDropDown(BtpCode: string): Observable<any> {
    const headers = this.config.getHeader();
    const params = { BtpCode: BtpCode };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/SO/BindDropDown`,
      {
        headers,
        params
      }
    );
  }

  GetVoucherPrefix(Vtype: string, BrnId: number, FyrId: number, Vdate: any, AcmId: number): Observable<any> {
    Vtype = Vtype == null || Vtype == undefined || Vtype == '' ? '' : Vtype;
    if (Vdate) {
      Vdate = new Intl.DateTimeFormat('en-US').format(new Date(Vdate));
    }
    Vdate = this.datepipe.transform(Vdate, 'MM-dd-yyyy');

    const headers = this.config.getHeader();
    const params = { Vtype: Vtype, BrnId: BrnId, FyrId: FyrId, Vdate: Vdate, AcmId: AcmId };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/Common/GetVoucherPreffix`,
      {
        headers,
        params
      }
    );
  }

  postSO(salesOrder: SOMain): Observable<any> {
    var body = { ...salesOrder };
    const headers = this.config.getHeader();

    return this.http
      .post<any>(`${this.config.getApiUrl()}/SO`, body, { headers })
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return throwError(() => error);
        })
      );
  }

  updateSO(updatedOrder: SOMain): Observable<string> {
    var body = { ...updatedOrder };
    var mKey = body.SomMkey;

    const headers = this.config.getHeader();
    return this.http.put<any>(`${this.config.getApiUrl()}/SO/${mKey}`, body, { headers })
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return throwError(() => error);
        })
      );
  }

  deleteSO(mkey: string, user: number): Observable<string> {
    const headers = this.config.getHeader();
    const params = { SomMkey: mkey, User: user };

    return this.http.delete(
      `${this.config.getApiUrl()}/SO/DeleteSO/`,
      {
        responseType: 'text',
        headers,
        params
      }
    );
  }

  getOrderList(acmId: number,stsCode: number): Observable<any> {
    const headers = this.config.getHeader();
    const params = { acmId: acmId, stsCode: stsCode };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/SO/PortalGetSOListByAcmId`,
      {
        headers,
        params,
      }
    );
  }

  getSOByMkey(SomMkey: string): Observable<any> {
    const headers = this.config.getHeader();

    return this.http.get<any>(
      `${this.config.getApiUrl()}/SO/${SomMkey}`,
      {
        headers,
      }
    );
  }

}

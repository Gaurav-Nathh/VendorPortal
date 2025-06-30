import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from '../Models/view-invoice.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewInvoiceService {

private apiUrl="https://efactoapidevelopment.efacto.cloud/api/Sale/GetSaleList"

  constructor(private http: HttpClient) { }

  getSaleList(): Observable<{ Sale: Sale[] }> {
    const headers = new HttpHeaders().set('Code', '140-9299-524-TEST');

    const params = new HttpParams()
      .set('PeriodType', 'this Year')
      .set('DateType', 'VDATE')
      .set('CmpId', '1')
      .set('BrnId', '14')
      .set('FyrId', '25')
      .set('EmpId', '0')
      .set('LogId', '0')
      .set('NavId', '0')
      .set('MaxRecord', '100')
      .set('BtpCode', 'SI')
      .set('AllRecord', 'N')
      .set('SessionId', '0');

    return this.http.get<{ Sale: Sale[] }>(this.apiUrl, { headers, params });
  }
}

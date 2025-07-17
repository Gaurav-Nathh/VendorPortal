import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from '../Models/view-invoice.model';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ViewInvoiceService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  getSaleList(): Observable<{ Sale: Sale[] }> {
    const headers = this.config.getHeader();

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

    return this.http.get<{ Sale: Sale[] }>(this.config.getApiUrl(), {
      headers,
      params,
    });
  }
}

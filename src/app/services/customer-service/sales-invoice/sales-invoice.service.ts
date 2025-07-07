import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesInvoiceService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  getPortalSalesInvoiceList(acmId: number): Observable<any> {
    const headers = this.config.getHeader();
    const params = { acmId: acmId };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/Sale/PortalGetSaleListByAcmId`,
      {
        headers,
        params,
      }
    );
  }

  getPortalSalesInvoiceDetail(acmId: number, mkey: string): Observable<any> {
    const headers = this.config.getHeader();
    const params = { acmId: acmId, mkey: mkey };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/Sale/PortalGetItemList`,
      { headers, params }
    );
  }
}

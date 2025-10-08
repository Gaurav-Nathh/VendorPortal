import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable, map } from 'rxjs';
import {
  SaleOrderDetail,
  SaleOrderDetailResponse,
} from '../../../Models/interface/SaleOrderDetail.interface';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  getPortalSOList(acmId: number): Observable<any> {
    const headers = this.config.getHeader();
    const params = { acmId: acmId };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/SO/PortalGetSOListByAcmId`,
      {
        headers,
        params,
      }
    );
  }

  getPortalSODetail(
    acmId: number,
    mkey: string
  ): Observable<SaleOrderDetailResponse> {
    const headers = this.config.getHeader();
    const params = { acmId: acmId, mKey: mkey };
    return this.http.get<SaleOrderDetailResponse>(
      `${this.config.getApiUrl()}/SO/PortalGetItemList`,
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

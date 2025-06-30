import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class PoVendorServiceService {
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private config: ApiConfigService, private http: HttpClient) {}

  vendorPoList(): Observable<any[]> {
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/PO/PortalGetPOListByAcmId`,
      {
        headers,
        params: { acmId: this.acmId },
      }
    );
  }
  ItemsByMkey(mkey: string): Observable<any[]> {
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/PO/PortalGetItemList`,
      {
        headers,
        params: { mkey: mkey, acmId: this.acmId },
      }
    );
  }
}

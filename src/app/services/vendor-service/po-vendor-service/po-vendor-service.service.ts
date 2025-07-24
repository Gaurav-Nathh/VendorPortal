import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class PoVendorServiceService {
  

  constructor(private config: ApiConfigService, private http: HttpClient) {}

  vendorPoList(): Observable<any[]> {
    const acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/PO/PortalGetPOListByAcmId`,
      {
        headers,
        params: { acmId: acmId },
      }
    );
  }
  ItemsByMkey(mkey: string): Observable<any[]> {
    const acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/PO/PortalGetItemList`,
      {
        headers,
        params: { mkey: mkey, acmId: acmId },
      }
    );
  }
}

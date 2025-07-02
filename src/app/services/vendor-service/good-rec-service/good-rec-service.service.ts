import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class GoodRecServiceService {
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  goodRecList(): Observable<any[]> {
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/GR/PortalGetGRListByAcmId`,
      {
        headers,
        params: { acmId: this.acmId },
      }
    );
  }
  getGoodRecItems(mkey: string): Observable<any[]> {
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/GR/PortalGetItemList`,
      {
        headers,
        params: { mkey, acmId: this.acmId },
      }
    );
  }
}

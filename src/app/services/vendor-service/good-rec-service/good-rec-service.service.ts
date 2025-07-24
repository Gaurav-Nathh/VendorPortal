import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';
import { GrrApiArry } from '../../../Models/Vendor/GoodRec.model';

@Injectable({
  providedIn: 'root',
})
export class GoodRecServiceService {
 

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  goodRecList(): Observable<GrrApiArry> {
     const acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
    const headers = this.config.getHeader();

    return this.http.get<GrrApiArry>(
      `${this.config.getApiUrl()}/GR/PortalGetGRListByAcmId`,
      {
        headers,
        params: { acmId: acmId },
      }
    );
  }
  getGoodRecItems(mkey: string): Observable<any[]> {
     const acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
    const headers = this.config.getHeader();

    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/GR/PortalGetItemList`,
      {
        headers,
        params: { mkey, acmId:acmId },
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodRecServiceService {
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private envConfig: ConfigService,private http: HttpClient) { }



    goodRecList(): Observable<any[]> {
  const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

  return this.http.get<any[]>(
    `https://efactoapitest.efacto.cloud/api/GR/PortalGetGRListByAcmId`,
    {
      headers,
      params: { acmId: this.acmId },
    }
  );
}
getGoodRecItems(mkey: string): Observable<any[]> {
  const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

  return this.http.get<any[]>(
    `https://efactoapitest.efacto.cloud/api/GR/PortalGetItemList`,
    {
      headers,
      params: { mkey, acmId: this.acmId },
    }
  );
}

}

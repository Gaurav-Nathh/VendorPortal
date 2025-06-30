import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoVendorServiceService {
   private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private envConfig: ConfigService,private http: HttpClient) { }

  vendorPoList(): Observable<any[]> {
  const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

  return this.http.get<any[]>(
    `https://efactoapitest.efacto.cloud/api/PO/PortalGetPOListByAcmId`,
    {
      headers,
      params: { acmId: this.acmId },
    }
  );
}
ItemsByMkey(mkey:string): Observable<any[]> {
  const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

  return this.http.get<any[]>(
    `https://efactoapitest.efacto.cloud/api/PO/PortalGetItemList`,
    {
      headers, params: { mkey: mkey,acmId:this.acmId }
      
    }
  );
}

}

import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoVendorServiceService {
   private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private envConfig: ConfigService,private http: HttpClient) { }

  vendorPoList()
  {
     const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

    return this.http
      .get(`https://efactoapitest.efacto.cloud/api/PO/GetPOListByAcmId`, {
        headers,
        params: { acmId: this.acmId },
      });
  }
}

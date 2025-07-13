import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../../Models/Vendor/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardServiceService {
  // private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  userDetails: user = new user();

  getDshbrd(): Observable<any[]> {
    const headers = this.config.getHeader();
    // console.log(this.acmId);
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);
    console.log(acmId);
    return this.http.get<any[]>(`${this.config.getApiUrl()}/Acm/${acmId}`, {
      headers,
    });
  }
  getDashbrdOtsnd() {
    const headers = this.config.getHeader();

    const params = {
      AcmId: 596,
      FyrId: 25,
      BrnId: 4,
      Vdate: '2025-07-03', // Replace with dynamic date if needed
    };

    return this.http.get<any>(
      `${this.config.getApiUrl()}/Common/GetAcmOutstanding`,
      {
        headers,
        params,
      }
    );
  }
}

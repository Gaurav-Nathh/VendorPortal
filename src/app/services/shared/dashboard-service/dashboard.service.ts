import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';
import { user } from '../../../Models/Common/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  userDetails: user = new user();

  getDshbrd(): Observable<any[]> {
    const headers = this.config.getHeader();
    // console.log(this.acmId);
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);
    // console.log(acmId);
    return this.http.get<any[]>(`${this.config.getApiUrl()}/Acm/${acmId}`, {
      headers,
    });
  }
  getDashbrdOtsnd() {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);
    const fyrid = Number(sessionStorage.getItem('fryId') || 0);
    const brnId = Number(sessionStorage.getItem('UsrBrnId') || 0);
    const headers = this.config.getHeader();

    const params = {
      AcmId: acmId,
      FyrId: fyrid,
      BrnId: brnId,
      Vdate: formattedDate, // Replace with dynamic date if needed
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

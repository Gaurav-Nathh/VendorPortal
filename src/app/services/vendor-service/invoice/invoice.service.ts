import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';

export interface Branch {
  Id: string;
  Text: string;
  Value: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  getBranches(
    acmId: number,
    type: string
  ): Observable<{ BranchList: Branch[] }> {
    const headers = this.config.getHeader();
    const params = new HttpParams()
      .set('AcmId', acmId.toString())
      .set('Type', type);
    return this.http.get<{ BranchList: Branch[] }>(
      `${this.config.getApiUrl()}/Common/BindDropDown`,
      {
        params,
        headers,
      }
    );
  }
}

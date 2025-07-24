import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';
import { user } from '../../../Models/Common/dashboard.model';
import { AccountStatementParams } from '../../../Models/Vendor/AcntStatment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  userDetails: user = new user();
  acntModel = new AccountStatementParams();

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
  getDashbodTable(){
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);
    const typr = sessionStorage.getItem('userType') || '';
    const params={
      AcmId: acmId,
      Type: typr
    };
    return this.http.get<any[]>(`${this.config.getApiUrl()}/Common/PortalDashboardAPI`, {
      headers: this.config.getHeader(),
      params,
    
    });

  }

  accountStatement():Observable<any[]>{

    const acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
  const UseBrnId = sessionStorage.getItem('UsrBrnId');
  const fryId = sessionStorage.getItem('fryId');
  const UsrCode = sessionStorage.getItem('UsrCode') ?? '';  

  this.acntModel.TypeValue=acmName;
  this.acntModel.BrnId=UseBrnId ? +UseBrnId : undefined;
  this.acntModel.FyrId=fryId ?+fryId : undefined;
  this.acntModel.UserId=UsrCode ?? '';
  const headers = this.config.getHeader();
  let params = new HttpParams();
  Object.entries(this.acntModel).forEach(([KeyboardEvent,value])=>{
    if(value !== undefined && value !== null){
    params = params.set(KeyboardEvent,String(value))
    }
  });
  return this.http.get<any[]>(
    `${this.config.getApiUrl()}/Report/LedgerReport`,
    {
      headers,
      params,
    }
  )
}
}

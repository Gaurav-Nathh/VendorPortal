import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';
import { OutstandingStatementParams } from '../../../Models/Vendor/purchase.model';
import { AccountStatementParams } from '../../../Models/Vendor/AcntStatment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  
  constructor(private config: ApiConfigService, private http: HttpClient) { }

  dateNum:number=0;
paymentModel = new OutstandingStatementParams();
acntModel = new AccountStatementParams();

 pendingPaymentList(): Observable<any[]> {

  const acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
  const UseBrnId = sessionStorage.getItem('UsrBrnId');
  const fryId = sessionStorage.getItem('fryId');
  const UsrCode = sessionStorage.getItem('UsrCode') ?? '';  

  this.paymentModel.WiseDesc=acmName;
this.paymentModel.BrnId = UseBrnId ? +UseBrnId : undefined;
this.paymentModel.FyrId=fryId ?+fryId : undefined;
this.paymentModel.User = UsrCode ?? '';


  const headers = this.config.getHeader();

  // Convert object to HttpParams
  let params = new HttpParams();
  Object.entries(this.paymentModel).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params = params.set(key, String(value));
    }
  });

  return this.http.get<any[]>(
    `${this.config.getApiUrl()}/Report/OutstandingReport`,
    {
      headers,
      params,
    }
  );
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

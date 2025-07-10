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

   private acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
   private UseBrnId =sessionStorage.getItem('UsrBrnId')
private fryId = sessionStorage.getItem('fryId')
private UsrCode=sessionStorage.getItem('UsrCode');
  constructor(private config: ApiConfigService, private http: HttpClient) { }

  dateNum:number=0;
paymentModel = new OutstandingStatementParams();
acntModel = new AccountStatementParams();

 pendingPaymentList(): Observable<any[]> {
  this.paymentModel.WiseDesc=this.acmName;
this.paymentModel.BrnId = this.UseBrnId ? +this.UseBrnId : undefined;
this.paymentModel.FyrId=this.fryId ?+this.fryId : undefined;
this.paymentModel.User = this.UsrCode ?? '';

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
  this.acntModel.TypeValue=this.acmName;
  this.acntModel.BrnId=this.UseBrnId ? +this.UseBrnId : undefined;
  this.acntModel.FyrId=this.fryId ?+this.fryId : undefined;
  this.acntModel.UserId=this.UsrCode ?? '';
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

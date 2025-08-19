import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';
import { OutstandingStatementParams } from '../../../Models/Vendor/purchase.model';
import { AccountStatementParams } from '../../../Models/Vendor/AcntStatment';
import { UserService } from '../../shared/user-service/user.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentServiceService {
  constructor(
    private config: ApiConfigService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  dateNum: number = 0;
  paymentModel = new OutstandingStatementParams();
  acntModel = new AccountStatementParams();
  currentYearShort = new Date().getFullYear().toString().slice(-2);

  pendingPaymentList(): Observable<any[]> {
    // const acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
    const acmName = this.userService._user?.UsrLinkAcmName;
    // const UseBrnId = sessionStorage.getItem('UsrBrnId');
    const UseBrnId = this.userService._user?.UsrBrnId;
    const fryId = this.currentYearShort;
    // const UsrCode = sessionStorage.getItem('UsrCode') ?? '';
    const UsrCode = this.userService._user?.UsrCode;

    this.paymentModel.WiseDesc = acmName;
    this.paymentModel.BrnId = UseBrnId ? +UseBrnId : undefined;
    this.paymentModel.FyrId = fryId ? +fryId : undefined;
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
  accountStatement(): Observable<any[]> {
    // const acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
    const acmName = this.userService._user?.UsrLinkAcmName;
    // const UseBrnId = sessionStorage.getItem('UsrBrnId');
    const UseBrnId = this.userService._user?.UsrBrnId;
    const fryId = this.currentYearShort;
    // const UsrCode = sessionStorage.getItem('UsrCode') ?? '';
    const UsrCode = this.userService._user?.UsrCode;

    this.acntModel.TypeValue = acmName;
    this.acntModel.BrnId = UseBrnId ? +UseBrnId : undefined;
    this.acntModel.FyrId = fryId ? +fryId : undefined;
    this.acntModel.UserId = UsrCode ?? '';
    const headers = this.config.getHeader();
    let params = new HttpParams();
    Object.entries(this.acntModel).forEach(([KeyboardEvent, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(KeyboardEvent, String(value));
      }
    });
    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/Report/LedgerReport`,
      {
        headers,
        params,
      }
    );
  }
}

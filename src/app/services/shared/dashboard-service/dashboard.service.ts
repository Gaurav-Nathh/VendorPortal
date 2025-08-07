import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable, tap, map } from 'rxjs';
import { user } from '../../../Models/Common/dashboard.model';
import { AccountStatementParams } from '../../../Models/Vendor/AcntStatment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private config: ApiConfigService) {}

  userDetails: user = new user();
  acntModel = new AccountStatementParams();

  getDshbrd(): Observable<user> {
    const headers = this.config.getHeader();
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);

    return this.http
      .get<any>(`${this.config.getApiUrl()}/Acm/${acmId}`, {
        headers,
      })
      .pipe(
        tap((data: any) => this.fillDetails(data.Acm)),
        map(() => this.userDetails)
      );
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
  getDashbodTable() {
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || 0);
    const typr = sessionStorage.getItem('userType') || '';
    const params = {
      AcmId: acmId,
      Type: typr,
    };
    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/Common/PortalDashboardAPI`,
      {
        headers: this.config.getHeader(),
        params,
      }
    );
  }

  accountStatement(): Observable<any[]> {
    const acmName = sessionStorage.getItem('UsrLinkAcmName') || '';
    const UseBrnId = sessionStorage.getItem('UsrBrnId');
    const fryId = sessionStorage.getItem('fryId');
    const UsrCode = sessionStorage.getItem('UsrCode') ?? '';

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

  private fillDetails(data: any): void {
    this.userDetails.Name = data.AcmName;
    this.userDetails.email = data.AcmEmail;
    this.userDetails.gstin = data.AcmGstin;
    this.userDetails.phone = data.AcmMobileNo;
    this.userDetails.bank = data.AcmBanks;
    this.userDetails.AcmAddress1 = data.AcmAddress1;
    this.userDetails.AcmAddress2 = data.AcmAddress2;

    if (data.AcmLocations?.length > 0) {
      this.userDetails.AclLocation = data.AcmLocations[0].AclLocation;
      this.userDetails.AclAddress1 = data.AcmLocations[0].AclAddress1;
      this.userDetails.AclAddress2 = data.AcmLocations[0].AclAddress2;
      this.userDetails.AclPinCode = data.AcmLocations[0].AclPinCode;
    }
  }
}

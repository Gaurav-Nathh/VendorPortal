import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { Observable } from 'rxjs';
import { Pgrmain } from '../../../Models/Invoice/invoice.model';

export interface Branch {
  Id: string;
  Text: string;
  Value: string;
}

export interface PODetailItem {
  PodMyItmCode: string;
  PodMyItmName: string;
  PodMrp: number;
  PodRate: number;
  PodQty: number;
  PodItmCode: string;
  PodItmName: string;
  PodItmId: number;
}

export interface POModel {
  PoDetails: PODetailItem[];
  PomMkey: string;
}

export interface POApiResponse {
  model: POModel;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private baseUrl = 'https://localhost:7133/api/';

  private mkey: string | null = null;

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

  getPODetail(acmId: number, vno: string) {
    const headers = this.config.getHeader();
    const params = new HttpParams()
      .set('AcmId', acmId.toString())
      .set('Vno', vno);
    return this.http.get<POApiResponse>(
      `${this.config.getApiUrl()}/PO/PortalGetByVno`,
      { params, headers }
    );
  }

  setMKey(value: string) {
    this.mkey = value;
  }

  getMKey(): string | null {
    return this.mkey;
  }

  clearMKey() {
    this.mkey = null;
  }

  deleteInvoice(mkey: string): Observable<any> {
    const headers = this.config.getHeader();
    return this.http.delete(`${this.config.getApiUrl()}/PGR/Delete/${mkey}`, {
      responseType: 'text' as 'json',
      headers
    });
  }

  createInvoice(payload: Pgrmain) {
    const headers = this.config.getHeader();
    return this.http.post<Pgrmain>(`${this.config.getApiUrl()}/PGR/CreatePGRMain`, payload, { headers });
  }

  searchVendorItems(query: string, acmId: string) {
    const headers = this.config.getHeader();
    const params = new HttpParams()
      .set('query', query)
      .set('acmId', acmId);
    return this.http.get<any[]>(`${this.config.getApiUrl()}/PGR/search-itemvendor`, { params, headers });
  }

  getItemDetails(itmId: string, acmId: string) {
    const headers = this.config.getHeader();
    const params = new HttpParams()
      .set('itmId', itmId)
      .set('acmId', acmId);
    return this.http.get<any>(`${this.config.getApiUrl()}/PGR/item-details`, { params, headers });
  }

  getInvoiceByMKey(mkey: string): Observable<Pgrmain> {
    return this.http.get<Pgrmain>(`${this.config.getApiUrl()}/PGRMain/${mkey}`);
  }

  updateInvoice(data: Pgrmain): Observable<any> {
    return this.http.put(`${this.config.getApiUrl()}/PGR/Update`, data, {
      responseType: 'text' as 'json'
    });
  }

  generateVno(
    vType: string
  ): Observable<{
    vNo: string;
    vNoSeq: number;
    vNoPrefix: string;
    mKey: string;
  }> {
    const params = new HttpParams().set('vType', vType);
    const headers = this.config.getHeader();

    return this.http.get<{ vNo: string, vNoSeq: number, vNoPrefix: string, mKey: string }>(
      `${this.config.getApiUrl()}/PGR/generate-vno`, { params, headers }
    );
  }

  getPaginatedInvoices(
    pageNumber: number,
    pageSize: number,
    searchTerm: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }
    const headers = this.config.getHeader();

    return this.http.get<any>(`${this.config.getApiUrl()}/PGR/GetPaginatedInvoices`, { params, headers });
  }
}

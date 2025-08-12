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
    return this.http.delete(`${this.baseUrl}PGRMain/Delete/${mkey}`, {
      responseType: 'text' as 'json',
    });
  }

  createInvoice(payload: Pgrmain) {
    return this.http.post<Pgrmain>(
      `${this.baseUrl}PGRMain/CreatePGRMain`,
      payload
    );
  }

  searchVendorItems(query: string, acmId: string) {
    const params = new HttpParams().set('query', query).set('acmId', acmId);
    return this.http.get<any[]>(`${this.baseUrl}PGRMain/search-itemvendor`, {
      params,
    });
  }

  getItemDetails(itmId: string, acmId: string) {
    const params = new HttpParams().set('itmId', itmId).set('acmId', acmId);
    return this.http.get<any>(`${this.baseUrl}PGRMain/item-details`, {
      params,
    });
  }

  getInvoiceByMKey(mkey: string): Observable<Pgrmain> {
    return this.http.get<Pgrmain>(`${this.baseUrl}PGRMain/${mkey}`);
  }

  updateInvoice(data: Pgrmain): Observable<any> {
    return this.http.put(`${this.baseUrl}PGRMain/Update`, data, {
      responseType: 'text' as 'json',
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
    return this.http.get<{
      vNo: string;
      vNoSeq: number;
      vNoPrefix: string;
      mKey: string;
    }>(`${this.baseUrl}PGRMain/generate-vno`, { params });
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

    return this.http.get<any>(`${this.baseUrl}PGRMain/GetPaginatedInvoices`, {
      params,
    });
  }
}

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';
  private btpCode: string | null = null;

  constructor(private http: HttpClient) {}

  setBtpCode(code: string): void {
    this.btpCode = code;
  }

  getBtpCode(): string | null {
    return this.btpCode;
  }

  searchItemsList(
    search: string,
    searchType: string,
    searchColumn: string,
    brnId: number,
    maxRecord: number,
    btpCode: string,
    callback: (data: any[]) => void
  ) {
    const params = new HttpParams()
      .set('Search', search)
      .set('SearchType', searchType)
      .set('SearchColumn', searchColumn)
      .set('BrnId', brnId)
      .set('MaxRecord', maxRecord)
      .set('BtpCode', btpCode);

    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    this.http
      .get<{ ItemSearchList: any[] }>(`${this.apiUrl}/Item/GetItemSearchList`, {
        headers,
        params,
      })
      .subscribe({
        next: (res) => callback(res.ItemSearchList || []),
        error: (err) => {
          console.error('Search failed:', err);
          callback([]);
        },
      });
  }

  getItemByItemId(id: number, callback: (data: any[]) => void) {
    const params = new HttpParams().set('Id', id);

    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    this.http
      .get<{ item: any[] }>(`${this.apiUrl}/Item/GetByItemId`, {
        headers,
        params,
      })
      .subscribe({
        next: (res) => callback(res.item || []),
        error: (err) => {
          console.error('Search failed:', err);
          callback([]);
        },
      });
  }

  getItem(
    Code: string,
    WrnId: number,
    BrnId: number,
    FyrId: number,
    Vdate: string,
    CmpId: number,
    Mkey: string,
    WithStock: boolean,
    AllowNegStock: boolean,
    BrnType: string,
    ItemType: string,
    IsWrhUnderIncl: boolean,
    BtpCode: string,
    GetpriceCode: boolean,
    AcmId: number,
    callback: (data: any[]) => void
  ) {
    const params = new HttpParams()
      .set('Code', Code)
      .set('WrnId', WrnId)
      .set('BrnId', BrnId)
      .set('FyrId', FyrId)
      .set('Vdate', Vdate)
      .set('CmpId', CmpId)
      .set('Mkey', Mkey)
      .set('WithStock', WithStock)
      .set('AllowNegStock', AllowNegStock)
      .set('BrnType', BrnType)
      .set('ItemType', ItemType)
      .set('IsWrhUnderIncl', IsWrhUnderIncl)
      .set('BtpCode', BtpCode)
      .set('GetpriceCode', GetpriceCode)
      .set('AcmId', AcmId);

    const headers = new HttpHeaders({
      Code: this.apiKey,
      'Content-Type': 'application/json',
    });
    this.http
      .get<{ ItemSearchList: any[] }>(`${this.apiUrl}/Common/GetItemDetail`, {
        headers,
        params,
      })
      .subscribe({
        next: (res) => callback(res.ItemSearchList || []),
        error: (err) => {
          console.error('Search failed:', err);
          callback([]);
        },
      });
  }
}

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private editingSubject = new BehaviorSubject<boolean>(false);
  public isEditing$: Observable<boolean> = this.editingSubject.asObservable();

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  enableEditing(): void {
    this.editingSubject.next(true);
  }

  disableEditing(): void {
    this.editingSubject.next(false);
  }
  getFilterOptionsTop(categoryType: string): Observable<any[]> {
    const headers = this.config.getHeader();
    const params = new HttpParams().set('CatType', categoryType);
    return this.http.get<any[]>(
      `${this.config.getApiUrl()}/Common/GetShopCartCatgoryList`,
      { headers, params }
    );
  }

  getItems(filters: string): Observable<any[]> {
    const headers = this.config.getHeader();
    return this.http.post<any[]>(
      `${this.config.getApiUrl()}/Common/GetShopCartItemCatgoryList`,
      filters,
      { headers }
    );
  }

  // getItemCatalougeList(searchText: string, actId: number): Observable<any> {
  //   const headers = this.config.getHeader();
  //   const params = { search: searchText, actId: actId };
  //   return this.http.get<any>(
  //     `${this.config.getApiUrl()}/OrdCat/GetOrdCatSearch`,
  //     { headers, params }
  //   );
  // }

  getItemCatalougeByMkey(mkey: string): Observable<any> {
    const headers = this.config.getHeader();
    const params = { ocmMkey: mkey };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/OrdCat/GetOrdCatByMkeyandStock`,
      { headers, params }
    );
  }

  getItemCatalougeList(actId: number): Observable<any> {
    const headers = this.config.getHeader();
    const params = { actId: actId };
    return this.http.get<any>(
      `${this.config.getApiUrl()}/OrdCat/BindDropDown`,
      { headers, params }
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemMappingResponse } from '../../../pages/vendor/item-mapping/item-mapping.component';
import { ItemMappingModel } from '../../../Models/MappingForm.model';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ItemMappingService {
  /* private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST'; */
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';
  private mappingItemsSubject = new BehaviorSubject<any[]>([]);
  mappingItems$ = this.mappingItemsSubject.asObservable();

  itemMapping: any = new ItemMappingModel();

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  getMappingItems(): Observable<ItemMappingResponse> {
    const headers = this.config.getHeader();

    return this.http.get<ItemMappingResponse>(
      `${this.config.getApiUrl}/Item/GetItemByVendorCustomer`,
      {
        headers,
        params: { acmId: this.acmId },
      }
    );
  }

  getCurrentMappingItems(): any[] {
    return this.mappingItemsSubject.getValue();
  }

  /*   postMappingItems()
  {

 const headers = new HttpHeaders({
    Code: this.envConfig.apiCode,
    'Content-Type': 'application/json',
  });

  return this.http
    .get<ItemMappingResponse>(`${this.envConfig.apiBaseUrl}/Item/PostItemVendor`, {
      headers,
     
    });


  } */

  postMappingItems() {
    this.itemMapping.itvAcmId = this.acmId; // Set acmId from session storage
    const headers = this.config.getHeader();

    return this.http.post<any>(
      `${this.config.getApiUrl}/Item/PostItemVendor`,
      this.itemMapping, // JSON body
      { headers }
    );
  }
}

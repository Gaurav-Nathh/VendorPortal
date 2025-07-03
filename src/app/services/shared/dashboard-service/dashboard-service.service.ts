import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../../Models/Vendor/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {
  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';


  constructor(private http: HttpClient, private config: ApiConfigService) { }

  userDetails:user =new user();


   getDshbrd(): Observable<any[]> {
      const headers = this.config.getHeader();
  
      return this.http.get<any[]>(
        `${this.config.getApiUrl()}/Acm/${this.acmId}`,
        {
          headers,
          
        }
      );
    }
    

}

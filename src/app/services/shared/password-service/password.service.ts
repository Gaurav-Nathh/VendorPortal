import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';

export class passwordModel {
  OldPassword!:string;
  NewPassword!:string;
  Id!:number;
} 


@Injectable({
  providedIn: 'root'
})
export class PasswordService {
    

  constructor(private config: ApiConfigService, private http: HttpClient) { }

passModel:passwordModel = new passwordModel();

 changePassword(model: passwordModel): Observable<any> {
  const userId = sessionStorage.getItem('userId');
  model.Id = userId ? +userId : 0;

  const headers = this.config.getHeader();
  let params = new HttpParams();

  Object.entries(model).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params = params.set(key, String(value));
    }
  });

  return this.http.get<any>(
    `${this.config.getApiUrl()}/Users/ChangePassword`,
    {
      headers,
      params,
    }
  );
}
}

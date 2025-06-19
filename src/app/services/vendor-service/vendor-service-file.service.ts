import { Injectable } from '@angular/core';
import { PoFormModel, PurchaseList, SearchVendorModel, TDSDetailsModel, VendorFormData } from '../../Models/data-structure/vendor.model';
import { Vendor } from '../../Models/interface/Vendor.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TDSResponse } from '../../pages/vendor/purchase-orders/purchase-orders.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceFileService {
  
 vendor:Vendor=new VendorFormData();


vendors:Vendor[]=[];


 

 poList:any=new PurchaseList();
  poForm:any= new PoFormModel();
  poVendor:any= new SearchVendorModel();
  poTdsDetails:any= new TDSDetailsModel()




  private apiUrl="https://efactoapidevelopment.efacto.cloud/api"
  private authCode='140-9299-524-TEST'
  constructor(private http: HttpClient) { }

 getPOList(purchaseList: PurchaseList): Observable<any> {
  let params = new HttpParams();
    Object.keys(purchaseList).forEach(key => {
      const value = (purchaseList as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

  const headers = new HttpHeaders({
    'code': this.authCode
  });

return this.http.get(`${this.apiUrl}/PO/GetPOList`, { headers, params });

}



  postPoForm(PoFormModel: PoFormModel) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'code': this.authCode // Include any custom headers required by the API
  });

  return this.http.post(`${this.apiUrl}/PO`, PoFormModel, { headers });
}

getVendor(PoVendorModel: SearchVendorModel) {
  const headers = new HttpHeaders({
    'code': this.authCode
  });

  const params = new HttpParams({ fromObject: { 
    Search: PoVendorModel.Search,
    EmpId: PoVendorModel.EmpId?.toString() ?? '',
    BtpId: PoVendorModel.BtpId.toString(),
    SearchType: PoVendorModel.SearchType,
    SearchColumn: PoVendorModel.SearchColumn ?? '',
    AcgGroups: PoVendorModel.AcgGroups ?? '',
    AcgCategorys: PoVendorModel.AcgCategorys,
    MaxRecord: PoVendorModel.MaxRecord.toString(),
    AcgIds: PoVendorModel.AcgIds,
    ActIds: PoVendorModel.ActIds.join(',')  // Assuming the API expects CSV
  }});

  return this.http.get(`${this.apiUrl}/Acm/GetAccountSearchList`, { headers, params });
}

TDSDetails(AcmId: number) {
  const params = new HttpParams({
    fromObject: {
      AcmId: AcmId.toString(),
      Vdate: this.poTdsDetails.Vdate,
      PartyAcmId: this.poTdsDetails.PartyAcmId?.toString() ?? '',
      TdsId: this.poTdsDetails.TdsId?.toString() ?? ''
    }
  });
 /*  const paramsSearch = new HttpParams({
    fromObject:{
      Id:AcmId.toString(),
      Value:this.poContactSearch.Value,
      Text1:this.poContactSearch.Text1,
      Text2:this.poContactSearch.Text2,
    }
  }) */

  const headers = new HttpHeaders({
    'code': this.authCode
  });

  return this.http.get<TDSResponse>(`${this.apiUrl}/Common/GetTDSDetail`, { headers, params });
 // 
}

AcmContactSearchList(id:number){
   const headers = new HttpHeaders({
    'code': this.authCode
  });
  const params = new HttpParams({ fromObject: {
  Id:id
  }})
  return this.http.get(`${this.apiUrl}/Acm/GetAcmContactSearchList`,{headers,params})
}
GetAcmByName(name:string){
  const headers = new HttpHeaders({
   'code': this.authCode
  });
  const params = new HttpParams({ fromObject: {
   Name:name
  }})
   return this.http.get(`${this.apiUrl}Acm/GetAcmByName`,{headers,params})
}


  
  
}





 /* vendors = [
  {
    name: 'John Doe',
    vendorNumber: 'VND001',
    companyName: 'ABC Pvt Ltd',
    email: 'john.doe@example.com',
    workPhone: '+91-9876543210',
    payables: 50000,
  },
  {
    name: 'Jane Smith',
    vendorNumber: 'VND002',
    companyName: 'XYZ Ltd',
    email: 'jane.smith@example.com',
    workPhone: '+91-8765432109',
    payables: 75000,
  },
  {
    name: 'Alice Johnson',
    vendorNumber: 'VND003',
    companyName: 'LMN Corp',
    email: 'alice.johnson@example.com',
    workPhone: '+91-7654321098',
    payables: 60000,
  },
]; */
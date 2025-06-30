export class VendorFormData {
    code: string = '';
    name: string = '';
    email:string='';
    companyName='';
    balancingMethod: string = '';
    group: string = '';
    parentAccount: string = '';
    gstApplicable: boolean = false;
    reverseChargeApplicable: boolean = false;
    gstType: string = '';
    hsnSac: string = '';
    serviceType: string = '';
    defaultGst: string = '';
    tdsApplicable: boolean = false;
    tdsCode: string = '';
    status: 'draft' | 'confirm' = 'draft'; 
  }
  


  export class PoFormModel {
  
}

export class SearchVendorModel {
  Search: string = "";
  EmpId: number | null = null;
  ActIds: number[] = [2, 1, 3];
  BtpId: number = 0;
  SearchType: string = "";
  SearchColumn?: string; 
  AcgGroups?: string;    
  AcgCategorys: string = "";
  MaxRecord: number = 100;
  AcgIds: string = "";
}

export class TDSDetailsModel {
  AcmId!: number;
Vdate!: Date ;
  PartyAcmId: number | null = null;
  TdsId: number | null = null;
}




 
export class PurchaseList {
     StatusCode:string= 'null';
    SearchValue:string= 'null';
    CmpId:number= 1;
    BrnId:number= 86;
    FyrId:number= 25;
    Vtype:string= '';
    EmpId:string= 'null';
    LogId:number= 157325;
    NavId:number= 181993;
    MaxRecord:number= 100;
    PeriodType:string= 'THIS YEAR';
    SearchColumn:string= '';
    FromDate:string= 'null';
    ToDate:string= 'null';
    DateType:string= 'VDATE';
    MultiSearchColumns:string= '';
    BtpId:number= 1;
    BtpCode:string= 'PO';
    AllRecord:string= ''
}

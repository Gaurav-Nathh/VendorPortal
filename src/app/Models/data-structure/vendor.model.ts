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
  
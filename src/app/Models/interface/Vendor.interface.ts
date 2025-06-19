export interface Vendor {
    code: string;
    name: string;
    balancingMethod: string;
    email:string;
    companyName:string;
    group: string;
    parentAccount: string;
    gstApplicable: boolean;
    reverseChargeApplicable: boolean;
    gstType: string;
    hsnSac: string;
    serviceType: string;
    defaultGst: string;
    tdsApplicable: boolean;
    tdsCode: string;
    status: 'draft' | 'confirm';
  }
  
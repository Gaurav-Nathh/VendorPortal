export interface DomainCodeResponse {
  $id: string;
  DomainCode: DomainCode;
}

export interface DomainCode {
  CmpId: number;
  CmpCode: string;
  CmpKey: string;
  CmpName: string | null;
  CmpPassword: string | null;
  CmpDomain: string;
  CmpCountry: string | null;
  CmpPhone: string | null;
  CmpEmail: string | null;
  CmpState: string | null;
  CmpCity: string | null;
  CmpProduct: string | null;
  CmpSubs: string | null;
  CmpServer: string | null;
  CmpUsers: number;
  CmpDbName: string | null;
  CmpDbServer: string | null;
  CmpDbPort: number;
  CmpDbUser: string | null;
  CmpDbPassword: string | null;
  CmpStatus: boolean;
  CmpAddUser: string | null;
  CmpAddDate: string | null;
  CmpMobileApp: boolean;
  CmpWebTracking: boolean;
  CmpSms: boolean;
  CmpEwayBill: boolean;
  CmpEnvoice: boolean;
  CmpPortal: boolean;
  CmpContactPerson: string | null;
  CmpAppUrl: string;
  CmpApiUrl: string;
  CmpLicKey: string;
  CmpReportUrl: string;
  CmpDocUrl: string;
  CmpDocBucketName: string;
  CmpDocAccessKey: string;
  CmpDocSecretAccessKey: string;
  CmpDocRegion: string;
  CmpPlan: string;
}

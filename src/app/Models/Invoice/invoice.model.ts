export interface Pgrmain {
  PgrmMKey: string;
  PgrmCmpId: number;
  PgrmBrnId: number;
  PgrmVType: string;
  PgrmVNoSeq: number;
  PgrmVNoPrefix: string;
  PgrmVNo?: string;
  PgrmVDate?: string;
  PgrmRefNo: string;
  PgrmRefDate: string; 
  PgrmAcmId: number;
  PgrmNetAmount: number;
  PgrmRemarks?: string;
  PgrmStatusCode: number;
  PgrmAddUser: string;
  PgrmAddDate: string; 
  PgrmModUser: string;
  PgrmModDate: string; 
  PgrmForBrnId: number;
  PgrmForBrnName: string;
  PgrmDocNo?: string;
  PgrmDocType?: string;
  PGRDetails: Pgrdetail[];
}

export interface Pgrdetail {
  PgrdRowNo: number;
  PgrdItemId: number;
  PgrdMRP: number;
  PgrdRate: number;
  PgrdQuantity: number;
  PgrdGrossAmount: number;
  PgrdDiscountAmount?: number;
  PgrdGstAmount?: number;
  PgrdBarcode: string;
  PgrdItemCode: string;
  PgrdItemName: string;
  PgrdRemarks?: string;
}

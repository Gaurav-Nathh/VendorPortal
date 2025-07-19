export interface SalesInvoice {
  SlmMkey: string;
  SlmCmpId: number;
  SlmBrnId: number;
  SlmFyrId: number;
  SlmVno: string;
  SlmVdate: string;
  SlmAcmId: number;
  SlmNetAmt: number;
  SlmGrossAmt: number;
  SlmQty: number;
  SlmBaseQty: number;
  SlmItems: number;
  SlmTotalAmt: number;
  SlmBillDisAmt: number;
  SlmRoundoff: number;
  SlmAdjAmt: number;
  SlmBrnName?: string;
  SlmGstName?: string;
  SlmRemarks?: string;
  Saledetails?: SalesInvoiceDetail[];
  Saleothers?: any[];
  Salepaymode?: any[];
  SaleDiscs?: any[];
  Saleexps?: any[];
  SlmTcsAmt?: number;
  SlmTcsRate?: number;
  SlmTcsStatus?: string;
  SlmTcsCertificateNo?: string;
  SlmDlvAddress1?: string;
  SlmDlvAddress2?: string;
  SlmDlvMobileNo?: string;
  SlmDlvCtyName?: string;
  SlmDlvStaName?: string;
  SlmDlvCntName?: string;
  SlmEmpName?: string;
  SlmWrhName?: string;
  SlmAcmName?: string;
  SlmPrint?: number;
  SlmSavingAmt?: number;
  SlmCrmName?: string;
  SlmCrmMobileNo?: string;
  SlmCrmEmail?: string;
}

export interface SalesInvoiceDetail {
  ItmCode: string;
  ItmName: string;
  MyItmCode?: string;
  MyItmName?: string;
  Qty: number;
  Rate: number;
  Amount: number;
  BaseQty: number;
  GrossAmt: number;
  DisRate: number;
  DisAmt: number;
  GstName: string;
  UnitName: string;
}

export interface SaleInvoiceDetailResponse {
  PortalItemDetailSale: SalesInvoiceDetail[];
}

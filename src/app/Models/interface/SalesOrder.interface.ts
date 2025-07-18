export interface SalesOrder {
  SomMkey: string;
  SomCmpId: number;
  SomBrnId: number;
  SomFyrId: number;
  SomType: string | null;
  SomVtype: string | null;
  SomVnoPrefix: string | null;
  SomVnoSeq: number;
  SomVnoSuffix: string | null;
  SomVno: string;
  SomVdate: string;
  SomRefNo: string | null;
  SomRefDate: string | null;
  SomDocType: string | null;
  SomDocNo: string | null;
  SomAcmId: number;
  SomEmpId: number;
  SomShpBrnId: number | null;
  SomDlvBy: string | null;
  SomDlvDate: string | null;
  SomDlvLocation: string | null;
  SomDlvMobileNo: string | null;
  SomDlvKeyPerson: string | null;
  SomDlvAddress1: string | null;
  SomDlvAddress2: string | null;
  SomDlvPinCode: string | null;
  SomDlvCtyId: number | null;
  SomDlvStaId: number | null;
  SomDlvCntId: number | null;
  SomShpMode: string | null;
  SomShpDlvDate: string | null;
  SomShipper: string | null;
  SomPayMethod: string | null;
  SomPayTerms: number;
  SomAdvAmt: number;
  SomAdvBank: string | null;
  SomAdvDetail: string | null;
  SomLcTerms: number;
  SomLcDate: string | null;
  SomLcExpDate: string | null;
  SomLcBank: string | null;
  SomCurId: number | null;
  SomCurRate: number;
  SomPriceAt: string | null;
  SomGstInclusive: boolean;
  SomGstType: string | null;
  SomPos: string | null;
  SomInterState: boolean | null;
  SomTaxableAmt: number;
  SomGstAmt: number;
  SomBillDisType: string | null;
  SomBillDisRate: number;
  SomBillDisAmt: number;
  SomOtherAmt: number;
  SomDlvAmt: number;
  SomPackAmt: number;
  SomTotalAmt: number;
  SomRoundOff: number;
  SomNetAmt: number;
  SomTerms: string | null;
  SomRemarks: string | null;
  SomStsCode: number;
  SomAddUser: string | null;
  SomAddDate: string | null;
  SomModUser: string | null;
  SomModDate: string | null;
  SomTId: number | null;
  SomDlvGstIn: string | null;
  SomCrmId: number | null;
  SomUnit: string | null;
  SomStatus: string;
  SomNextDocNo: string | null;
  SomQty: number;
  SomBaseQty: number;
  SomAcm: any;
  SoDetails: any[];
  SomBranch: any;
  errorMsg: string | null;
  SomLogId: number;
  SomReason: string | null;
  VnoSeq: number | null;
  SomNavId: number;
  SomIsVtypeAuto: boolean;
  SomIsVdateAuto: boolean;
  SomVtpUseSeparator: string | null;
  SomVtpSeqType: string | null;
  SomVtpUseScanner: boolean;
  SomVtpAutoFillDoc: boolean;
  SomAcmName: string | null;
  SomAcmGstin: string | null;
  SomEmpName: string | null;
  SomShpBrnName: string | null;
  SomDlvBrnName: string | null;
  SomDlvCtyName: string | null;
  SomDlvStaName: string | null;
  SomDlvCntName: string | null;
  SomCurName: string | null;
  RefDoc: string | null;
  SomBtpCode: string | null;
  SomVtpAccTypes: string | null;
  SomAllowBackDate: boolean;
  SomCrmName: string | null;
  SomCrmCode: string | null;
  SomBrnName: string;
  SomItems: number;
}

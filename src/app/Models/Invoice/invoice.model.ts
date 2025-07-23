export interface Pgrmain {
  mKey: string;
  cmpId: number;
  brnId: number;
  vType: string;
  vNoSeq: number;
  vNoPrefix: string;
  vNo?: string;
  vDate?: string;
  refNo: string;
  refDate: string; 
  acmId: number;
  netAmount: number;
  remarks?: string;
  statusCode: number;
  addUser: string;
  addDate: string; 
  modUser: string;
  modDate: string; 
  for_BrnName: string;
  docNo?: string;
  docType?: string;
  details: Pgrdetail[];
}

export interface Pgrdetail {
  rowNo: number;
  itemId: number;
  mrp: number;
  rate: number;
  quantity: number;
  grossAmount: number;
  discountAmount?: number;
  gstAmount?: number;
  barcode: string;
  itemCode: string;
  itemName: string;
}

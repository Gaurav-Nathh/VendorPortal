export interface SaleOrderDetail {
  ItmCode: string;
  ItmName: string;
  MyItmCode: string;
  MyItmName: string;
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

export interface SaleOrderDetailResponse {
  PortalItemDetailListSO: SaleOrderDetail[];
}

export class PSOMain {
  mKey?: string;
  cmpId?: number = 0;
  brnId?: number = 0;
  acmId?: number = 0;
  vtype?: string = '';
  itmCount: number = 0;
  itmQty: number = 0;
  netAmount: number = 0;
  status?: string = '';
  statusCode?: number = 0;
  addUser?: string = '';
  modUser?: string = '';
  psoItems?: PSODetail[] = [];
}

export class PSODetail {
  itmId: number = 0;
  pack: string = '';
  mrp: number = 0;
  rate: number = 0;
  qty: number = 0;
  untId: number = 0;
  unitFactor: number = 0;
  netAmount: number = 0;
  stock: number = 0;
  baseQty: number = 0;
  baseUnitId: number = 0;
  remarks: string = '';
}

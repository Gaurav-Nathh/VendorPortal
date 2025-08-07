export class PSOMain {
  psomMKey?: string;
  psomCmpId?: number = 0;
  psomBrnId?: number = 0;
  psomAcmId?: number = 0;
  psomVtype?: string = '';
  psomItmCount: number = 0;
  psomItmQty: number = 0;
  psomNetAmount: number = 0;
  psomOrderType?: string = '';
  psomStatus?: string = '';
  psomStatusCode?: number = 0;
  psomAddUser?: string = '';
  psomModUser?: string = '';
  psoItems?: PSODetail[] = [];
}

export class PSODetail {
  psodItmId: number = 0;
  psodPack: string = '';
  psodMrp: number = 0;
  psodRate: number = 0;
  psodQty: number = 0;
  psodUnitId: number = 0;
  psodUnitFactor: number = 0;
  psodNetAmount: number = 0;
  psodStock: number = 0;
  psodBaseQty: number = 0;
  psodBaseUnitId: number = 0;
  psodRemarks: string = '';
}

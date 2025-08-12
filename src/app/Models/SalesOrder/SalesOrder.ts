export class PSOMain {
  psomMKey?: string;
  psomCmpId?: number = 0;
  psomBrnId?: number = 0;
  psomAcmId?: number = 0;
  psomVtype?: string = '';
  psomVNoPrefix?: string = '';
  psomVNoSeq?: 0;
  psomVNo?: '';
  psomVdate?: Date = new Date();
  psomItmCount: number = 0;
  psomItmQty: number = 0;
  psomNetAmount: number = 0;
  psomOrderType?: string = '';
  psomStatus?: string = '';
  psomRemarks?: string = '';
  psomStatusCode?: number = 0;
  psomAddUser?: string = '';
  psomAddDate?: Date = new Date();
  psomModUser?: string = '';
  psomModDate?: Date = new Date();
  psomAcmName?: string = '';
  psomBrnname?: string = '';
  psoDetails?: PSODetail[] = [];
}

export class PSODetail {
  psodPsomMkey?: string = '';
  psodRowNo?: number = 0;
  psodItmId: number = 0;
  psodPack: string = '';
  psodMRP: number = 0;
  psodRate: number = 0;
  psodQty: number = 0;
  psodUnitId: number = 0;
  psodUnitFactor: number = 0;
  psodNetAmount: number = 0;
  psodStock: number = 0;
  psodBaseQty: number = 0;
  psodBaseUnitId: number = 0;
  psodRemarks?: string = '';
  psodItmCode?: string = '';
  psodItmName?: string = '';
}

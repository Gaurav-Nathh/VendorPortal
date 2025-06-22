// simplified-po.model.ts

export interface SimplifiedPoDetailInterface {
  PodNetAmt: number;
  PodQty: number;
}

export interface SimplifiedPOInterface {
  PomVno: string;
  PomVdate: string;
  PomStatus: string;
  PoDetails: SimplifiedPoDetailInterface[];
  PomQty: number;
}

export class SimplifiedPoDetail implements SimplifiedPoDetailInterface {
  PodNetAmt: number;
  PodQty: number;

  constructor(data: any) {
    this.PodNetAmt = data.PodNetAmt ?? 0;
    this.PodQty = data.PodQty ?? 0;
  }
}

export class SimplifiedPO implements SimplifiedPOInterface {
  PomVno: string;
  PomVdate: string;
  PomStatus: string;
  PoDetails: SimplifiedPoDetail[];
  PomQty: number;

  constructor(data: any) {
    this.PomVno = data.PomVno ?? '';
    this.PomVdate = data.PomVdate ?? '';
    this.PomStatus = data.PomStatus ?? '';
    this.PoDetails = (data.PoDetails || []).map((d: any) => new SimplifiedPoDetail(d));
    this.PomQty = this.calculateTotalQty();
  }

  private calculateTotalQty(): number {
    return this.PoDetails.reduce((total, item) => total + item.PodQty, 0);
  }
}

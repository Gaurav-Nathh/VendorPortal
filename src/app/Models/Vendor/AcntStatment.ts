export class AccountStatementParams {
  BrnId: number = 86;
  UserId: string = 'Rohan'; // decoded from %20Rohan
  Wise: string = 'DETAIL';
  ViewType: string = 'SINGLE';
  Status?: string = ''; // optional, not provided
  FromDate?: string = ''; // was "undefined"
  ToDate?: string = '';   // was "undefined"
  FyrId: number = 25;
  BrnLevel: string = 'BO';
  Type: string = 'PARTICULAR';
  TypeValue: string = 'CENTRAL WARE HOUSING CORP.LTD.'; // decoded
  Vtype?: string = '';         // not provided
  DebitOpr?: string = '';      // not provided
  DebitAmt?: number;           // not provided
  CreditOpr?: string = '';     // not provided
  CreditAmt?: number;          // not provided
  NarrationOpr?: string = '';  // not provided
  Narration?: string = '';     // not provided
  ShortNarrationOpr?: string = ''; // not provided
  ShortNarration?: string = '';    // not provided
  VnoOpr?: string = '';        // not provided
  Vno?: string = '';           // not provided
  InterestRate?: number;       // was "undefined"
  AgainstAcccount?: string = ''; // was "undefined"
  HideOpening: boolean = false;
  AddSql?: string = '';        // not provided
  PeriodType: string = 'THIS YEAR'; // decoded
  StartPage: number = 1;
  LastPage: number = 100;
  MaxRecord?: number | null = null;
  CmpId: number = 0;
}

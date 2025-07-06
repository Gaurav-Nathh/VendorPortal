export class OutstandingStatementParams {
BrnLevel: string = 'BO';
  BrnId: number = 86;
  AsOnDate?: string = '';           // optional, not provided
  PayDate?: string = '';            // optional, not provided
  User: string = 'Rohan';
  FyrId: number = 25;
  WiseType: string = 'PARTY';
  WiseDesc: string = 'CENTRAL WARE HOUSING CORP.LTD.'; // decoded
  OutsType: string = 'UNCLEARED';
  DateType: string = 'REF DATE';    // decoded
  OutsRefType: string = 'ALL';
  PeriodType: string = 'TODAY';
  ViewType: string = 'DETAIL';
  Status?: string = '';             // optional, not provided
  GroupId: number = 15;
  Vtype?: string = '';              // optional, not provided
  InvType?: string = '';            // optional, not provided
  BalanceAmt?: number;              // optional, not provided
  BalanceOpr?: string = '';         // optional, not provided
  OverDueDays?: number;             // optional, not provided
  OverDueDaysOpr?: string = '';     // optional, not provided
  Addfield: string = 'ALL';
  AgingDays?: string = '';          // optional, not provided
  StartPage: number = 1;
  LastPage: number = 100;
  MaxRecord?: number;               // optional, not provided
  CmpId: number = 0;
  fromName: string = 'Outstanding Statement'; // decoded
}

export class OutstandingStatementParams {
BrnLevel: string = 'BO';
  BrnId?: number;
  AsOnDate?: string = '';           // optional, not provided
  PayDate?: string = '';            // optional, not provided
  User?: string ;
  FyrId?: number;
  WiseType: string = 'PARTY';
  WiseDesc?: string;// decoded
  OutsType: string = 'UNCLEARED';
  DateType: string = 'REF DATE';    // decoded
  OutsRefType: string = 'ALL';
  PeriodType: string = 'TODAY';
  ViewType: string = 'SUMMARY';
  Status?: string = '';             // optional, not provided
  GroupId: number = 47;
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

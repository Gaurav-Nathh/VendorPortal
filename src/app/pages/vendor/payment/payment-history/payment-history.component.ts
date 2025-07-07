import { Component, ElementRef, QueryList,ViewChildren,AfterViewInit } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';



export interface AccountTransaction {
  CODE: string;
  Date: string;               // ISO date string, e.g., "2025-04-16T00:00:00"
  Vtype: string;
  'No.': string;
  Particular: string;
  Amount: number | null;
  Debit: number;
  Credit: number;
  Narration: string;
  'Trn. No.': string;
  'Trn. Date': string | null; // nullable
  DIFF: number;
  ROWNO: number;
  TYPE: string;               // e.g., "TRN"
  BTPID: number;
  BTPCODE: string;
  BRNID: number;
  FYRID: number;
}




@Component({
  selector: 'app-payment-history',
  imports: [CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss'
})
export class PaymentHistoryComponent {



  @ViewChildren('tooltipRef') tooltips!: QueryList<ElementRef>;

ngAfterViewInit() {
  this.tooltips.forEach((tooltipEl: ElementRef) => {
    new Tooltip(tooltipEl.nativeElement);
  });
}



  constructor(public statementService:PaymentServiceService){

  }
data:AccountTransaction[]=[];

 ngOnInit(){
    this.AcntStament();
  }



  AcntStament()
  {
    this.statementService.accountStatement().subscribe({
      next: (response:any) =>{
        console.log(response);
        this.data=response.ReportData.Table;
      }
      
    })
  }
}

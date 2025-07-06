import { Component } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';



export interface OutstandingBill {
  WISE: string;
  BILLDATE: string;     // format: DD/MM/YYYY
  BILLTYPE: string;
  BILLNO: string;
  BILLAMT: number;
  PAYAMT: number;
  ADJAMT: number;
  BALANCE: number;
  DUEDATE: string;      // format: DD/MM/YYYY
  OVERDUE: number;
}


@Component({
  selector: 'app-payment-pending',
  imports: [CommonModule],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.scss'
})





export class PaymentPendingComponent {

 data: OutstandingBill[] = [];
  


  constructor(public paymentService:PaymentServiceService){

  }


  ngOnInit(){
    this.paymentFun();
  }
 
  paymentFun()
  {
this.paymentService.pendingPaymentList().subscribe({
      next: (response:any) =>{
        console.log(response);
        this.data=response.ReportData;
      }
      
    })
  }


}

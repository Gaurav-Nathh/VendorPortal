import { Component } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';



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


exportToExcel(): void {
  const exportData = this.data.map((item: any) => ({
    'Date': item.BILLDATE,
    'Type': item.BILLTYPE,
    'Ref No.': item.BILLNO,
    'Invoice': item.BILLAMT,
    'Payment': item.PAYAMT,
    'Adjustment': item.ADJAMT,
    'Balance': item.BALANCE,
    'Due Date': item.DUEDATE,
    'Over Due': item.OVERDUE
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Outstanding': worksheet },
    SheetNames: ['Outstanding'],
  };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blobData, 'Outstanding_Report.xlsx');
}



}

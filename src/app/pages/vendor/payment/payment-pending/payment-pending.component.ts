import { Component } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormsModule } from '@angular/forms';



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
  imports: [CommonModule,FormsModule],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.scss'
})





export class PaymentPendingComponent {

 data: OutstandingBill[] = [];
 totalInvoice: number = 0;
totalPayment: number = 0;
totalAdjustment: number = 0;
totalBalance: number = 0;
currentPage: number = 1;
itemsPerPage: number = 16;
  filteredItems: OutstandingBill[] = [];
  
  searchText: string = '';

  constructor(public paymentService:PaymentServiceService){

  }


  ngOnInit(){
    this.paymentFun();
  }



applySearch() {
  const text = this.searchText.toLowerCase();
  this.filteredItems = this.data.filter(item =>
    item.BILLTYPE?.toLowerCase().includes(text) ||
    item.BILLNO?.toLowerCase().includes(text)
  );
  this.currentPage = 1;
}

 
  paymentFun()
  {
this.paymentService.pendingPaymentList().subscribe({
      next: (response:any) =>{
        console.log(response);
        this.data=response.ReportData;
        this.filteredItems=response.ReportData.reverse();
         this.calculateTotals();
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



calculateTotals() {
  this.totalInvoice = this.data.reduce((sum, item) => sum + (item.BALANCE ?? 0), 0);
  this.totalPayment = this.data.reduce((sum, item) => sum + (item.PAYAMT ?? 0), 0);
  this.totalAdjustment = this.data.reduce((sum, item) => sum + (item.ADJAMT ?? 0), 0);
  this.totalBalance = this.data.reduce((sum, item) => sum + (item.BALANCE ?? 0), 0);
}


get paginatedData(){
  const start= (this.currentPage-1)*this.itemsPerPage;
  const end = start+ this.itemsPerPage;
  return this.filteredItems.slice(start, end);
}
get totalPages(): number {
  return Math.ceil(this.filteredItems.length / this.itemsPerPage);
}

goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

referseData(){

}
}

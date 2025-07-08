import { Component, ElementRef, QueryList,ViewChildren,AfterViewInit } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';




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
tble:any[]=[];

 ngOnInit(){
    this.AcntStament();
  }



  AcntStament()
  {
    this.statementService.accountStatement().subscribe({
      next: (response:any) =>{
        console.log(response);
        this.data=response.ReportData.Table.reverse();
        this.tble=response.ReportData.Table1;
      }
      
    })
  }



  exportToExcel(): void {
    const exportData = this.data.map((item: any) => ({
      'Date': item.Date,
      'Type': item.Vtype,
      'No.': item['No.'],
      'Particular': item.Particular,
      'Debit': item.Debit,
      'Credit': item.Credit,
      'Narration': item.Narration,
      'Trn. No.': item['Trn. No.'],
      'Trn. Date': item['Trn. Date'],

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
    FileSaver.saveAs(blobData, 'AccountStatement_Report.xlsx');
  }

  referseData(){
    
  }

}

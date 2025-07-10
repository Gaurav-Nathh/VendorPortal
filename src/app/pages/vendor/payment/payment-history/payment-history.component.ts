import { Component, ElementRef, QueryList,ViewChildren,AfterViewInit } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormsModule } from '@angular/forms';




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
  imports: [CommonModule,FormsModule],
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

searchText: string = '';
filteredItems: AccountTransaction[] = [];
currentPage: number = 1;
itemsPerPage: number = 10;


 ngOnInit(){
    this.AcntStament();
  }





  


AcntStament() {
  this.statementService.accountStatement().subscribe({
    next: (response: any) => {
      this.data = response.ReportData.Table.reverse();
      this.tble = response.ReportData.Table1;
      this.filteredItems = [...this.data]; // initialize filtered data
    }
  });
}

applySearch() {
  const text = this.searchText.toLowerCase();
  this.filteredItems = this.data.filter(item =>
    item.Particular?.toLowerCase().includes(text) ||
    item['No.']?.toLowerCase().includes(text) ||
    item.Vtype?.toLowerCase().includes(text)
  );
  this.currentPage = 1;
}

get paginatedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
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

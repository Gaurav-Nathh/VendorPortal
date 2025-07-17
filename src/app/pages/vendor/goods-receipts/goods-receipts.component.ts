import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PoGoodReceiptComponent } from "../../../components/vendor/po-good-receipt/po-good-receipt.component";
import { GoodRecServiceService } from '../../../services/vendor-service/good-rec-service/good-rec-service.service';
import { FormsModule } from '@angular/forms';
import { GrrApi, GrrApiArry, GrrSummary } from '../../../Models/Vendor/GoodRec.model';

@Component({
  selector: 'app-goods-receipts',
  imports: [CommonModule, PoGoodReceiptComponent,FormsModule],
  templateUrl: './goods-receipts.component.html',
  styleUrl: './goods-receipts.component.scss'
})
export class GoodsReceiptsComponent {


  
fullData: GrrSummary[] = [];
constructor(private grService:GoodRecServiceService) { }

ngOnInit() {
this.getGrList()
}

expandedkey: string | null = null;
selectedItem:GrrSummary | null = null;
filteredData: any[] = [];
  currentPage: number = 1;
itemsPerPage: number = 10;
searchText: string = '';
searchTimeout: any;

openedRowKey: string | null = null;

/* toggleRow(key: string) {
  this.openedRowKey = this.openedRowKey === key ? null : key;
} */


toggleRow(key: string) {
  if (this.openedRowKey === key) {
    this.openedRowKey = null; // close if same
  } else {
    this.openedRowKey = key; // open new
  }
}




referseData(){
  this.getGrList()
}

getGrList() {
  this.grService.goodRecList().subscribe((data: GrrApiArry) => {
    if (Array.isArray(data.GRList)) {
      this.fullData = data.GRList.map((item: GrrApi) => ({
        GrmBrnName: item.GrmBrnName,
        GrmRefNo: item.GrmRefNo,
        GrmVdate: item.GrmVdate,
        GrmVno: item.GrmVno,
        GrmRefDate: item.GrmRefDate,
        GrmMkey: item.GrmMkey,
        GrmBillDisAmt: item.GrmNetAmt,
        GrmTdsAmt: item.GrmTdsAmt,
        GrmAdjAmt: item.GrmAdjAmt,
        GrmNetAmt: item.GrmNetAmt,
        GrmItems: item.GrmItems,
      }));

      this.filteredData = [...this.fullData];
    } else {
      console.error('gr is not an array', data);
    }
  });
}



closeDropdown() {
  this.expandedkey = null;
  this.selectedItem = null;
 
//  this.showModal = false;
}


get paginatedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredData.slice(start, end);
}

get totalPages(): number {
  return Math.ceil(this.filteredData.length / this.itemsPerPage);
}

goToPreviousPage() {
  if (this.currentPage > 1) this.currentPage--;
   this.openedRowKey = null; // Close any open dropdown
}

goToNextPage() {
  if (this.currentPage < this.totalPages) this.currentPage++;
   this.openedRowKey = null; // Close any open dropdown
}



onSearchChange(value: string) {
  clearTimeout(this.searchTimeout);
  this.searchTimeout = setTimeout(() => {
    this.applySearch();
  }, 300);
}

applySearch() {
  const text = this.searchText.toLowerCase().trim();
  this.filteredData = this.fullData.filter(item =>
    item.GrmBrnName?.toLowerCase().includes(text) ||
    item.GrmRefNo?.toLowerCase().includes(text) ||
    item.GrmVno?.toLowerCase().includes(text)
  );
  this.currentPage = 1; // reset pagination
}


}

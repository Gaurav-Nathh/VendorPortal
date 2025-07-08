import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PoGoodReceiptComponent } from "../../../components/vendor/po-good-receipt/po-good-receipt.component";
import { GoodRecServiceService } from '../../../services/vendor-service/good-rec-service/good-rec-service.service';

@Component({
  selector: 'app-goods-receipts',
  imports: [CommonModule, PoGoodReceiptComponent],
  templateUrl: './goods-receipts.component.html',
  styleUrl: './goods-receipts.component.scss'
})
export class GoodsReceiptsComponent {


  
fullData: any[] = [];
constructor(private grService:GoodRecServiceService) { }

ngOnInit() {
this.getGrList()
}

expandedkey: string | null = null;
selectedItem:any = null;

  currentPage: number = 1;
itemsPerPage: number = 10;


openedRowKey: string | null = null;

toggleRow(key: string) {
  this.openedRowKey = this.openedRowKey === key ? null : key;
}

referseData(){
  
}

getGrList() {
  this.grService.goodRecList().subscribe((data: any) => {
    if (Array.isArray(data.GRList)) {
      this.fullData = data.GRList.map((item: any) => ({
        GrmBrnName: item.GrmBrnName,//branch
        GrmRefNo: item.GrmRefNo, //bill no
        GrmVdate: item.GrmVdate, //date
        GrmVno: item.GrmVno, //vno
        GrmRefDate: item.GrmRefDate,//date
        GrmMkey: item.GrmMkey,
        GrmBillDisAmt:item.GrmNetAmt,//bill value
        GrmTdsAmt:item.GrmTdsAmt,//tds
        GrmAdjAmt:item.GrmAdjAmt,//adjustment
        GrmNetAmt: item.GrmNetAmt,// net amount
        GrmItems:item.GrmItems,//count
      }));
     // this.applyFilters();
     console.log('GRList:', data.GRList);
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


get paginatedData(){
  const start= (this.currentPage-1)*this.itemsPerPage;
  const end = start+ this.itemsPerPage;
  return this.fullData.slice(start, end);
}
get totalPages(): number {
  return Math.ceil(this.fullData.length / this.itemsPerPage);
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




}

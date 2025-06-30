import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PoVendorServiceService } from '../../../services/vendor-service/po-vendor-service/po-vendor-service.service';


export interface POItem {
  itemCode: string;
  itemName: string;
  myItemCode: string;
  myItemName: string;
  qty: number;
  rate: number;
  amount: number;
}


@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './po-list.component.html',
  styleUrl: './po-list.component.scss'
})
export class PoListComponent {
@Input() po!: any;
@Input() close!: () => void;




purchaseOrderNo: string = 'PO-2024-999999';
  
  poItems: any[] = [];

  constructor(private itemService:PoVendorServiceService) { }

  ngOnInit(): void {
    // Component initialization logic
    //console.log('Purchase Order Component Initialized', this.po.PomMkey);
    this.getItemDetails(this.po.PomMkey);
    this.purchaseOrderNo = this.po.PomVno;

  }

getItemDetails(item: string) {
  this.itemService.ItemsByMkey(item).subscribe({
    next: (data: any) => {
      const poItemArray = data?.PortalItemDetailList;

      if (Array.isArray(poItemArray) && poItemArray.length > 0) {
        this.poItems = poItemArray.map((detail: any) => ({
          ItmCode: detail.ItmCode,
          ItmName: detail.ItmName,
          MyItmCode: detail.MyItmCode,
          MyItmName: detail.MyItmName,
          Qty: detail.Qty,
          Rate: detail.Rate,
          Amount: detail.Amount
        }));

        console.log('Extracted Items:', this.poItems);
      } else {
        console.warn('No data found or data is malformed.');
      }
    },
    error: (error) => {
      console.error('Failed to fetch item details:', error);
    },
    complete: () => {
      console.log('Item details fetch complete.');
    }
  });
}



  

  

  get totalQty(): number {
  return this.poItems.reduce((sum, item) => sum + item.Qty, 0);
}

get totalNetAmt(): number {
  return this.poItems.reduce((sum, item) => sum + item.Amount, 0);
}


  




  getAlignment(value: any): string {
  return typeof value === 'number' ? 'text-end' : 'text-start';
}
}

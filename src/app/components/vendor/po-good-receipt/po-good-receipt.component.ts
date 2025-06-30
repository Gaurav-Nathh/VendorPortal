import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { GoodRecServiceService } from '../../../services/vendor-service/good-rec-service/good-rec-service.service';

@Component({
  selector: 'app-po-good-receipt',
  imports: [CommonModule],
  templateUrl: './po-good-receipt.component.html',
  styleUrl: './po-good-receipt.component.scss'
})
export class PoGoodReceiptComponent {

  @Input() data!: any;
  @Input() close!: () => void;
poItems:any[] = [];
fullData: any[] = [];
billNo: string = '';


    getAlignment(value: any): string {
  return typeof value === 'number' ? 'text-end' : 'text-start';
}

constructor(private grService: GoodRecServiceService) { }
ngOnInit() {
  this.getGoodRecItems();
}

getGoodRecItems() {
this.grService.getGoodRecItems(this.data.GrmMkey).subscribe((data: any) => {
    if (Array.isArray(data.PortalItemDetailList)) {
      this.fullData = data.PortalItemDetailList.map((item: any) => ({
        ItmCode: item.ItmCode,//item code
        ItmName: item.ItmName, //bill no
        Qty: item.Qty, //date
        Rate: item.Rate, //vno
        Amount: item.Amount,
      
      }));
     // this.applyFilters();
     console.log('GRList:', data.GRList);
     this.billNo = this.data.GrmRefNo; // Assuming GrmRefNo is the bill number
    } else {
      console.error('gr is not an array', data);
    }
  });
}
}

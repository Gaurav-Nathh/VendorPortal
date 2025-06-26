import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


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



purchaseOrderNo: string = 'PO-2024-999999';
  
  poItems: POItem[] = [
    {
      itemCode: 'ITM001',
      itemName: 'High-Quality Steel Bolts M12x50',
      myItemCode: 'MY-STL-001',
      myItemName: 'Premium Steel Fasteners',
      qty: 500,
      rate: 12.50,
      amount: 6250.00
    },
    {
      itemCode: 'ITM002',
      itemName: 'Industrial Grade Washers 12mm',
      myItemCode: 'MY-WSH-002',
      myItemName: 'Heavy Duty Washers',
      qty: 1000,
      rate: 2.75,
      amount: 2750.00
    },
    {
      itemCode: 'ITM003',
      itemName: 'Stainless Steel Nuts M12',
      myItemCode: 'MY-NUT-003',
      myItemName: 'Corrosion Resistant Nuts',
      qty: 500,
      rate: 8.90,
      amount: 4450.00
    },
    {
      itemCode: 'ITM004',
      itemName: 'Precision Ball Bearings 6205',
      myItemCode: 'MY-BRG-004',
      myItemName: 'High Performance Bearings',
      qty: 25,
      rate: 145.00,
      amount: 3625.00
    },
    {
      itemCode: 'ITM005',
      itemName: 'Hydraulic Seals 50x62x8',
      myItemCode: 'MY-SEL-005',
      myItemName: 'Premium Hydraulic Seals',
      qty: 100,
      rate: 18.75,
      amount: 1875.00
    },
    {
      itemCode: 'ITM006',
      itemName: 'Carbon Steel Pipes 2" x 6m',
      myItemCode: 'MY-PIP-006',
      myItemName: 'Industrial Carbon Pipes',
      qty: 20,
      rate: 285.50,
      amount: 5710.00
    },
    {
      itemCode: 'ITM007',
      itemName: 'Electrical Cables 16AWG x 100m',
      myItemCode: 'MY-CBL-007',
      myItemName: 'Multi-Core Electrical Wire',
      qty: 5,
      rate: 425.00,
      amount: 2125.00
    },
    {
      itemCode: 'ITM008',
      itemName: 'Safety Valves 1/2" BSP',
      myItemCode: 'MY-VLV-008',
      myItemName: 'Pressure Relief Valves',
      qty: 12,
      rate: 165.75,
      amount: 1989.00
    },
    {
      itemCode: 'ITM009',
      itemName: 'Gear Oil SAE 90 - 20L',
      myItemCode: 'MY-OIL-009',
      myItemName: 'Premium Gear Lubricant',
      qty: 8,
      rate: 78.50,
      amount: 628.00
    },
    {
      itemCode: 'ITM010',
      itemName: 'Industrial Filters 25 Micron',
      myItemCode: 'MY-FLT-010',
      myItemName: 'High-Efficiency Filters',
      qty: 50,
      rate: 32.25,
      amount: 1612.50
    },
    {
      itemCode: 'ITM011',
      itemName: 'Heat Exchangers Tube Bundle',
      myItemCode: 'MY-HEX-011',
      myItemName: 'Copper Tube Heat Exchanger',
      qty: 2,
      rate: 1250.00,
      amount: 2500.00
    },
    {
      itemCode: 'ITM012',
      itemName: 'Control Panel Enclosure IP65',
      myItemCode: 'MY-ENC-012',
      myItemName: 'Weatherproof Enclosures',
      qty: 3,
      rate: 485.00,
      amount: 1455.00
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization logic
  }

  getTotalAmount(): number {
    return this.poItems.reduce((total, item) => total + item.amount, 0);
  }

  getTotalQuantity(): number {
    return this.poItems.reduce((total, item) => total + item.qty, 0);
  }

  onPrint(): void {
    // Implement print functionality
    window.print();
  }

  onExport(): void {
    // Implement export functionality
    this.exportToCSV();
  }

  private exportToCSV(): void {
    const headers = ['S.No', 'Item Code', 'Item Name', 'My Item Code', 'My Item Name', 'Qty', 'Rate', 'Amount'];
    const csvData = this.poItems.map((item, index) => [
      index + 1,
      item.itemCode,
      item.itemName,
      item.myItemCode,
      item.myItemName,
      item.qty,
      item.rate,
      item.amount
    ]);

   
  }


  getAlignment(value: any): string {
  return typeof value === 'number' ? 'text-end' : 'text-start';
}
}

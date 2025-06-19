import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-purchase-order',
  imports: [CommonModule, RouterModule],
  templateUrl: './list-purchase-order.component.html',
  styleUrl: './list-purchase-order.component.scss',
})
export class ListPurchaseOrderComponent {
  viewOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Billed', value: 'billed' },
    { label: 'Open', value: 'open' },
  ];

  currentView = 'all';
  filteredOrders: any[] = [];

  mockPOs = [
    {
      orderNumber: 'PO-2023-0896',
      referenceNumber: 'SUP-2309-0456',
      date: new Date('2023-09-15'),
      value: 42450.75,
      status: 'Billed',
    },
    {
      orderNumber: 'PO-2023-1023',
      referenceNumber: 'VDR-8291',
      date: new Date('2023-09-14'),
      value: 18990.0,
      status: 'Open',
    },
    {
      orderNumber: 'PO-2023-0843',
      referenceNumber: 'RFQ-2309-12',
      date: new Date('2023-09-11'),
      value: 8999.99,
      status: 'Draft',
    },
    {
      orderNumber: 'PO-2023-1055',
      referenceNumber: 'BOM-2309',
      date: new Date('2023-09-10'),
      value: 234599.5,
      status: 'Billed',
    },
    {
      orderNumber: 'PO-2023-0888',
      referenceNumber: 'SHIP-2309',
      date: new Date('2023-09-08'),
      value: 45870.25,
      status: 'Open',
    },
  ];

  constructor() {
    this.filteredOrders = this.mockPOs;
  }

  updateView(view: string): void {
    this.currentView = view;
    this.filteredOrders = this.mockPOs.filter((po) =>
      view === 'all' ? true : po.status.toLowerCase() === view
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}

import { Injectable } from '@angular/core';
import { Invoice } from '../../Models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoices: Invoice[] = [
    {
      no: 'INV-001',
      date: new Date('2023-05-15'),
      value: 1250.75,
      balance: 0,
      status: 'Paid',
      dueDate: new Date('2023-06-15')
    },
    {
      no: 'INV-002',
      date: new Date('2023-06-20'),
      value: 890.50,
      balance: 450.50,
      status: 'Partially Paid',
      dueDate: new Date('2023-07-20')
    },
    {
      no: 'INV-003',
      date: new Date('2023-07-10'),
      value: 3200.00,
      balance: 3200.00,
      status: 'Unpaid',
      dueDate: new Date('2023-08-10')
    },
    // Add more sample data as needed
  ];

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  getInvoiceByNo(no: string): Invoice | undefined {
    return this.invoices.find(inv => inv.no === no);
  }

  getStatusCounts(): { paid: number, partiallyPaid: number, unpaid: number } {
    return {
      paid: this.invoices.filter(inv => inv.status === 'Paid').length,
      partiallyPaid: this.invoices.filter(inv => inv.status === 'Partially Paid').length,
      unpaid: this.invoices.filter(inv => inv.status === 'Unpaid').length
    };
  }

}

import { Component } from '@angular/core';
import { Sale } from '../../Models/view-invoice.model';
import { ViewInvoiceService } from '../../services/view-invoice.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-invoice',
  imports: [RouterModule, CommonModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss'
})
export class ViewInvoiceComponent {
sales: Sale[] = [];

  constructor(private viewInvoiceService: ViewInvoiceService) {}

   ngOnInit(): void {
    this.viewInvoiceService.getSaleList().subscribe({
      next: (response) => {
        this.sales = response.Sale;
      },
      error: (err) => {
        console.error('Failed to load sales:', err);
      }
    });
  }
}

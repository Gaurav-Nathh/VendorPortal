import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../services/vendor-service/invoice/invoice.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Pgrmain } from '../../../../Models/Invoice/invoice.model';

@Component({
  selector: 'app-view-invoice',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  invoiceList: Pgrmain[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  pageSizes: number[] = [10, 15, 20, 50, 100];

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.invoiceService.getAllInvoices().subscribe({
      next: (response) => {
        this.invoiceList = response;
        console.log('list', this.invoiceList);
      },
      error: (err) => {
        console.error('Failed to load invoice:', err);
      },
    });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.invoiceList.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.invoiceList.length / this.itemsPerPage) || 1;
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

  calculateNetAmount(details: any[]): number {
    return Array.isArray(details)
      ? details.reduce(
          (sum, d) =>
            sum +
            (d.grossAmount || 0) -
            (d.discountAmount || 0) +
            (d.gstAmount || 0),
          0
        )
      : 0;
  }

  deleteInvoice(mkey: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.deleteInvoice(mkey).subscribe({
          next: () => {
            this.invoiceList = this.invoiceList.filter(
              (inv) => inv.mKey !== mkey
            );
            Swal.fire('Deleted!', 'Invoice has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting invoice:', err);
            Swal.fire('Error!', 'Failed to delete invoice.', 'error');
          },
        });
      }
    });
  }

  editInvoice(mkey: string) {
    Swal.fire({
      title: 'Edit Invoice?',
      text: 'Do you want to edit this invoice?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit it',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.setMKey(mkey);
        this.router.navigate(['/vendor/invoice-form']);
      }
    });
  }
}

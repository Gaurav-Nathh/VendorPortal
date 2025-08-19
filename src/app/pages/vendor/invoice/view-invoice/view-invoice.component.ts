import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../services/vendor-service/invoice/invoice.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Pgrmain } from '../../../../Models/Invoice/invoice.model';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  invoiceList: Pgrmain[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  pageSizes: number[] = [10, 15, 20, 50, 100];
  openIndexes = new Set<number>();
  isLoading: boolean = false;
  totalRecords: number = 0;
  searchTerm: string = '';

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit(): void {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.isLoading = true;

    this.invoiceService
      .getPaginatedInvoices(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.invoiceList = res.data;
          this.totalRecords = res.totalRecords;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load invoices:', err);
          this.isLoading = false;
        },
      });
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
        this.router.navigate(['/invoice-form']);
      }
    });
  }

  toggleDetails(index: number): void {
    if (this.openIndexes.has(index)) {
      this.openIndexes.delete(index);
    } else {
      this.openIndexes.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  getTotalAmount(items: any[]): number {
    return items.reduce((sum, item) => {
      const qty = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const discount = Number(item.discountAmount || 0);
      const gst = Number(item.gstAmount || 0);
      const lineTotal = qty * rate - discount + gst;
      return sum + lineTotal;
    }, 0);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchInvoices();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchInvoices();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage) || 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.fetchInvoices();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.fetchInvoices();
  }

  reloadInvoices(): void {
    this.fetchInvoices();
  }

}

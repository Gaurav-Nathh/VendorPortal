import { Component, OnInit } from '@angular/core';
import { SalesInvoiceService } from '../../../services/customer-service/sales-invoice/sales-invoice.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-invoice',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-invoice.component.html',
  styleUrl: './sales-invoice.component.scss',
})
export class SalesInvoiceComponent implements OnInit {
  salesInvoice: any[] = [];
  fetchedInvoices = new Map<number, any[]>();
  pagedInvoices: any[] = [];
  openIndexes = new Set<number>();
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private salesInvoiceService: SalesInvoiceService) {}

  ngOnInit(): void {
    this.getSalesInvoiceList();
  }

  getSalesInvoiceList() {
    const amcId: number = Number(sessionStorage.getItem('UsrLinkAcmId'));
    this.salesInvoiceService.getPortalSalesInvoiceList(amcId).subscribe({
      next: (response) => {
        this.salesInvoice = response.SOList;
        this.paginate();
      },
      error: (err) => {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error getting records.',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
    });
  }

  toggleDetails(index: number): void {
    if (this.openIndexes.has(index)) {
      this.openIndexes.delete(index);
    } else {
      const row = this.salesInvoice[index];
      if (!this.fetchedInvoices.has(index)) {
        this.salesInvoiceService
          .getPortalSalesInvoiceDetail(row.SlmAcmId, row.SlmMkey)
          .subscribe({
            next: (response) => {
              this.fetchedInvoices.set(
                index,
                response?.PortalItemDetailSale ?? []
              );
            },
            error: (err) => {},
          });
      }
      this.openIndexes.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  paginate(): void {
    this.totalPages = Math.ceil(this.salesInvoice.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedInvoices = this.salesInvoice.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }
}

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
  branchList: any[] = [];
  branchMap: { [key: number]: string } = {};

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.invoiceService.getBranches(0, 'MOBILEAPP').toPromise().then((res) => {
      this.branchList = res?.BranchList || [];
      console.log("branchList", this.branchList);
      this.branchMap = this.branchList.reduce((acc, b) => {
        acc[b.Id] = b.Text;
        return acc;
      }, {} as { [key: number]: string });

      this.fetchInvoices();
    })
  }

  fetchInvoices(): void {
    this.invoiceService
      .getPaginatedInvoices(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.invoiceList = res.data.map((inv: Pgrmain) => ({
            ...inv,
            PgrmForBrnName: this.branchMap[inv.PgrmForBrnId] || 'Unknown'
          }));
          this.totalRecords = res.totalRecords;
          this.isLoading = false;
          console.log('list data', this.invoiceList)
        },
        error: (err) => {
          console.error('Failed to load invoices:', err);
          this.isLoading = false;
        },
      });
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
              (inv) => inv.PgrmMKey !== mkey
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

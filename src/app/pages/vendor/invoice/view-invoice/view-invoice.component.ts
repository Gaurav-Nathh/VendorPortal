import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../services/vendor-service/invoice/invoice.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Pgrmain } from '../../../../Models/Invoice/invoice.model';
import { ReportGenratedResponse } from '../../../../Models/Common/generated-report.model';
import { HttpClient } from '@angular/common/http';
import { ReportGeneratorService } from '../../../../services/shared/report-generator/report-generator.service';
import { ReportGeneratorComponent } from '../../../../components/report-generator/report-generator.component';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReportGeneratorComponent],
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
  latestReportStatus: string | null = null;
  latestReport: ReportGenratedResponse | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private http: HttpClient,
    private reportGeneratorService: ReportGeneratorService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.invoiceService
      .getBranches(0, 'MOBILEAPP')
      .toPromise()
      .then((res) => {
        this.branchList = res?.BranchList || [];
        this.branchMap = this.branchList.reduce((acc, b) => {
          acc[b.Id] = b.Text;
          return acc;
        }, {} as { [key: number]: string });

        this.fetchInvoices();
      });
  }

  onReportGenerated(reports: ReportGenratedResponse[]) {
    if (!reports || reports.length === 0) {
      this.latestReportStatus = null;
      this.latestReport = null;
      return;
    }

    const hadPending = reports.some((r) => r.status === 'Pending');
    if (hadPending) {
      this.latestReportStatus = 'Processing...';
      this.latestReport = null;
      return;
    }

    this.latestReport = reports.reduce((latest, current) =>
      new Date(current.reqDate) > new Date(latest.reqDate) ? current : latest
    );

    if (this.latestReport.isDownloaded === false) {
      this.latestReportStatus = 'Download';
    } else {
      this.latestReportStatus = 'Downloaded';
    }
  }

  downloadLatestReport(report: ReportGenratedResponse) {
    if (!report || !report.fileUrl) {
      return;
    }

    this.http.get(report.fileUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = report.fileName || 'report.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.reportGeneratorService.markAsDownloaded(
          report.acmId,
          report.reqId
        );
      },
      error: (error) => {},
    });
    // window.open(report.fileUrl, '_blank');
  }

  fetchInvoices(): void {
    this.invoiceService
      .getPaginatedInvoices(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm
      )
      .subscribe({
        next: (res) => {
          this.invoiceList = res.data.map((inv: Pgrmain) => ({
            ...inv,
            PgrmForBrnName: this.branchMap[inv.PgrmForBrnId] || 'Unknown',
          }));
          this.totalRecords = res.totalRecords;
          this.isLoading = false;
        },
        error: (err) => {
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

import { Component, OnInit } from '@angular/core';
import { SalesInvoiceService } from '../../../services/customer-service/sales-invoice/sales-invoice.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import {
  SalesInvoiceDetail,
  SalesInvoice,
} from '../../../Models/customer/salesInvoice.model';
import { UserService } from '../../../services/shared/user-service/user.service';

@Component({
  selector: 'app-sales-invoice',
  imports: [CommonModule, FormsModule, TooltipModule],
  templateUrl: './sales-invoice.component.html',
  styleUrl: './sales-invoice.component.scss',
})
export class SalesInvoiceComponent implements OnInit {
  salesInvoice: SalesInvoice[] = [];
  fetchedInvoices = new Map<number, SalesInvoiceDetail[]>();
  pagedInvoices: any[] = [];
  openIndexes = new Set<number>();
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  pageSize: number = 50;
  currentPage: number = 1;
  totalPages: number = 0;
  isInvoicesLoading: boolean = false;

  private searchOrderNoSubject = new Subject<string>();

  constructor(
    private salesInvoiceService: SalesInvoiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getSalesInvoiceList();

    this.searchOrderNoSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchValue: string) => {
        this.onSearchOrderNoInputString(searchValue);
      });
  }

  getSalesInvoiceList() {
    this.isInvoicesLoading = true;
    const amcId: number = this.userService._user?.UsrLinkAcmId ?? 0;
    this.salesInvoiceService.getPortalSalesInvoiceList(amcId).subscribe({
      next: (response) => {
        this.isInvoicesLoading = false;
        this.salesInvoice = response.SOList;
        this.paginate();
      },
      error: (err) => {
        this.isInvoicesLoading = false;
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

  onSearchOrderNoInput(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.onSearchOrderNoInputString(searchValue);
  }

  onSearchOrderNoInputString(searchValue: string) {
    searchValue = searchValue.trim().toLowerCase();

    if (searchValue === '') {
      this.paginate();
      return;
    }
    const matchingOrders = this.salesInvoice.filter((order) =>
      order.SlmMkey.toLowerCase().includes(searchValue)
    );

    this.pagedInvoices = matchingOrders;
    this.totalPages = 1;
    this.currentPage = 1;
    this.openIndexes.clear();
  }

  refreshMyOrders() {
    this.openIndexes.clear();
    this.getSalesInvoiceList();
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  paginate(): void {
    this.totalPages = Math.ceil(this.salesInvoice.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedInvoices = this.salesInvoice.slice(startIndex, endIndex);
    this.openIndexes.clear();
  }

  nextPage(): void {
    this.openIndexes.clear();
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

  getTotalQty(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Qty || 0), 0);
  }

  getTotalBaseQty(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.BaseQty || 0), 0);
  }

  getTotalRate(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Rate || 0), 0);
  }

  getTotalGrossAmount(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.GrossAmt || 0), 0);
  }

  getTotalDiscountAmount(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.DisAmt || 0), 0);
  }

  getTotalAmount(items: SalesInvoiceDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Amount || 0), 0);
  }

  exportSalesInvoicToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Invoices');

    const heading = [['Purchase Invoice List']];

    heading.forEach((row, index) => {
      const headingRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);
      headingRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.font = { bold: true, size: 12 };
    });
    const columnHeaders = [
      'Branch',
      'Invoice No.',
      'Date',
      'Item Count',
      'Quantity',
      'Net Amount',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = this.salesInvoice.map((si: any) => [
      si.SlmBrnName,
      si.SlmVno,
      si.SlmVdate,
      si.SlmItems,
      si.SlmQty,
      si.SlmNetAmt,
    ]);

    exportData.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'Purchase Invoice List.xlsx');
    });
  }

  exportInvoiceToExcel(
    order: SalesInvoiceDetail[],
    orderNumber: string,
    index: number
  ) {
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
    } else {
      this.exportToExcel(
        this.fetchedInvoices.get(index) || [],
        orderNumber,
        index
      );
    }
  }

  exportToExcel(
    order: SalesInvoiceDetail[],
    orderNumber: string,
    index: number
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [
      ['Purchase Invoice Details'],
      [`Invoice No: ${orderNumber}`],
    ];

    heading.forEach((row, index) => {
      const headingRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);
      headingRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.font = { bold: true, size: 12 };
    });

    const columnHeaders = [
      'Item Code',
      'Item Name',
      'Unit',
      'Quantity',
      'Base Qunatity',
      'Rate',
      'Gross',
      'Discount',
      'GST',
      'Net Amount',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = (order || []).map((item: any) => [
      item.ItmCode,
      item.ItmName,
      item.UnitName,
      item.Qty,
      item.BaseQty,
      item.Rate,
      item.GrossAmt,
      item.DisAmt,
      item.GstName,
      item.Amount,
    ]);

    exportData.forEach((rowData: any) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    const totalQty = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[3] || 0),
      0
    );
    const totalBaseQty = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[4] || 0),
      0
    );

    const totalRate = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[5] || 0),
      0
    );
    const totalGrossAmount = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[6] || 0),
      0
    );
    const totalDiscountAmount = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[7] || 0),
      0
    );
    const totalAmount = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[9] || 0),
      0
    );

    const totalRow = worksheet.addRow([
      'Total',
      '',
      '',
      totalQty,
      totalBaseQty,
      totalRate,
      totalGrossAmount,
      totalDiscountAmount,
      '',
      totalAmount,
    ]);
    worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `Purchase Invoice ${orderNumber} .xlsx`);
    });
  }
}

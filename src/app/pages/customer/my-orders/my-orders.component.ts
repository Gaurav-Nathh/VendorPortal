import { Component, OnInit } from '@angular/core';
import { MyOrdersService } from '../../../services/customer-service/my-orders/my-orders.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SalesOrder } from '../../../Models/interface/SalesOrder.interface';
import { SaleOrderDetail } from '../../../Models/interface/SaleOrderDetail.interface';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, FormsModule, TooltipModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  soList: SalesOrder[] = [];
  pagedSOList: any[] = [];
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  pageSize: number = 50;
  currentPage: number = 1;
  totalPages: number = 0;
  fetchedDetails = new Map<number, SaleOrderDetail[]>();
  openIndexes = new Set<number>();
  isOrdersLoading: boolean = false;

  private searchOrderNoSubject = new Subject<string>();

  constructor(private myOrdersService: MyOrdersService) {}

  ngOnInit(): void {
    this.getPortalSOList();

    this.searchOrderNoSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchValue: string) => {
        this.onSearchOrderNoInputString(searchValue);
      });
  }

  getPortalSOList() {
    this.isOrdersLoading = true;
    const amcId: number = Number(sessionStorage.getItem('UsrLinkAcmId'));
    this.myOrdersService.getPortalSOList(amcId).subscribe({
      next: (response) => {
        this.isOrdersLoading = false;
        this.soList = response.SOList;
        this.paginate();
      },
      error: (err) => {
        this.isOrdersLoading = false;
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
      const row = this.soList[index];
      if (!this.fetchedDetails.has(index)) {
        this.myOrdersService
          .getPortalSODetail(row.SomAcmId, row.SomMkey)
          .subscribe({
            next: (response) => {
              this.fetchedDetails.set(
                index,
                response?.PortalItemDetailListSO ?? []
              );
            },
            error: (err) => {
              console.error('Error fetching details', err);
            },
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
    const matchingOrders = this.soList.filter((order) =>
      order.SomMkey.toLowerCase().includes(searchValue)
    );

    this.pagedSOList = matchingOrders;
    this.totalPages = 1;
    this.currentPage = 1;
    this.openIndexes.clear();
  }

  refreshMyOrders() {
    this.openIndexes.clear();
    this.getPortalSOList();
  }

  getTotalQty(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Qty || 0), 0);
  }

  getTotalBaseQty(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.BaseQty || 0), 0);
  }

  getTotalRate(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Rate || 0), 0);
  }

  getTotalGrossAmount(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.GrossAmt || 0), 0);
  }

  getTotalDiscountAmount(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.DisAmt || 0), 0);
  }

  getTotalAmount(items: SaleOrderDetail[]): number {
    return items.reduce((sum, item) => sum + Number(item.Amount || 0), 0);
  }

  exportSalesOrdersToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [['Confirm Orders List']];

    heading.forEach((row, index) => {
      const headingRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);
      headingRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.font = { bold: true, size: 12 };
    });
    const columnHeaders = [
      'Branch',
      'Order No.',
      'Date',
      'Reference No.',
      'Reference Date',
      'Item Count',
      'Net Amount',
      'Status',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = this.soList.map((so: any) => [
      so.SomBrnName,
      so.SomVno,
      so.SomVdate,
      so.SomRefNo,
      so.SomRefDate,
      so.SomItems,
      so.SomNetAmt,
      so.SomStatus,
    ]);

    exportData.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'Purchase Orders.xlsx');
    });
  }

  exportOrderToExcel(
    order: SaleOrderDetail[],
    orderNumber: string,
    index: number
  ) {
    const row = this.soList[index];
    if (!this.fetchedDetails.has(index)) {
      this.myOrdersService
        .getPortalSODetail(row.SomAcmId, row.SomMkey)
        .subscribe({
          next: (response) => {
            this.fetchedDetails.set(
              index,
              response?.PortalItemDetailListSO ?? []
            );
            this.exportToExcel(
              this.fetchedDetails.get(index) || [],
              orderNumber,
              index
            );
          },
          error: (err) => {
            console.error('Error fetching details', err);
          },
        });
    } else {
      this.exportToExcel(
        this.fetchedDetails.get(index) || [],
        orderNumber,
        index
      );
    }
  }

  exportToExcel(
    order: SaleOrderDetail[],
    orderNumber: string,
    index: number
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [['Purchase Order Details'], [`Order No: ${orderNumber}`]];

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
      FileSaver.saveAs(blob, `Purchase Order ${orderNumber} .xlsx`);
    });
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  paginate(): void {
    this.totalPages = Math.ceil(this.soList.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedSOList = this.soList.slice(startIndex, endIndex);
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
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingCartService } from '../../../../services/shoppingCart-service/shopping-cart.service';
import { SalesOrderService } from '../../../../services/customer-service/sales-order/sales-order.service';
import Swal from 'sweetalert2';
import { debounce, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { SharedService } from '../../../../services/shared/shared.service';
import { UserService } from '../../../../services/shared/user-service/user.service';

@Component({
  selector: 'app-list-sales-order',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-sales-order.component.html',
  styleUrl: './list-sales-order.component.scss',
})
export class ListSalesOrderComponent implements OnInit {
  Math = Math;
  viewOptions = [
    { label: 'View All', value: 'all' },
    { label: 'Created', value: 'created' },
    { label: 'Open', value: 'open' },
    { label: 'Billed', value: 'billed' },
  ];

  currentView = 'all';
  orders: any[] = [];
  editableItems: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 50;
  totalRecords: number = 0;
  pageSizes = [5, 10, 50, 100, 200];
  openIndexes = new Set<number>();
  isOrderLoading: boolean = false;
  acmId: number = 0;

  private searchOrderNoSubject = new Subject<string>();

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private sharedServrice: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.acmId = this.userService._user?.UsrLinkAcmId ?? 0;
    this.changePageSize(this.pageSizes[2]); // Default to 50 items per page
    this.searchOrderNoSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((serachOrderNoTerm) => {
        if (serachOrderNoTerm.trim()) {
          this.searchOrders(serachOrderNoTerm);
        } else {
          this.getOrderList();
        }
      });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  // createSO() {
  //   this.sharedServrice.setCartMode('items');
  //   this.shoppingCartService.disableEditing();
  //   this.router.navigate(['/customer/items/create-order']);
  //   console.log(this.sharedServrice.getCartMode());
  // }

  editSO(so: any) {
    this.shoppingCartService.enableEditing();
    this.salesOrderService.setEditableItem(so);
    if (so.orderType === 'items') {
      this.sharedServrice.setCartMode('items');
      this.router.navigate(['/items/create-order']);
    } else {
      this.sharedServrice.setCartMode('catalouge');
      this.router.navigate(['/catalouge/create-order']);
    }
  }

  deleteSO(so: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this sales order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesOrderService.deleteSalesOrder(so.mkey).subscribe({
          next: () => {
            this.getOrderList();
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Deleted',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          },
          error: (err) => {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: 'Error deleting the order.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          },
        });
      }
    });
  }

  getTotalQty(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }

  getTotalRate(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.rate || 0), 0);
  }

  getTotalMRP(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.rate || 0), 0);
  }

  getTotalAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.netamount || 0), 0);
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

  onSearchOrderNoInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchOrderNoSubject.next(value);
  }

  getOrderList() {
    this.isOrderLoading = true;
    this.salesOrderService
      .getOrderList(this.acmId, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.isOrderLoading = false;
          this.orders = response.data;
          this.totalRecords = response.totalRecords;
          console.log(this.orders);
        },
        error: (err) => {
          this.isOrderLoading = false;
          console.error('Failed to fetch orders:', err);
        },
      });
  }

  searchOrders(searchTerm: string) {
    this.pageNumber = 1;
    this.salesOrderService
      .getOrderList(this.acmId, this.pageNumber, this.pageSize, searchTerm)
      .subscribe({
        next: (response) => {
          this.orders = response.data;
          this.totalRecords = response.totalRecords;
        },
        error: (err) => {
          console.error('Failed to search orders:', err);
        },
      });
  }

  refreshOrders() {
    this.openIndexes.clear();
    this.getOrderList();
  }
  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.getOrderList();
  }

  totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages()) {
      this.pageNumber++;
      this.getOrderList();
      this.openIndexes.clear();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getOrderList();
      this.openIndexes.clear();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageNumber = page;
      this.getOrderList();
      this.openIndexes.clear();
    }
  }

  exportSalesOrdersToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [['Orders List']];

    heading.forEach((row, index) => {
      const headingRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);
      headingRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.font = { bold: true, size: 12 };
    });
    const columnHeaders = [
      'For Branch',
      'Order No.',
      'Date',
      'Item Count',
      'Item Quantity',
      'Net Amount',
      'Status',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = this.orders.map((item: any) => [
      item.branchName,
      item.mkey,
      item.vDate,
      item.itmCount,
      item.itmQty,
      item.netAmount,
      item.status,
    ]);

    exportData.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'Sales Orders.xlsx');
    });
  }

  exportOrderToExcel(order: any): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [
      ['Order Details'],
      [`Order No: ${order.mkey}`],
      [`Date: ${order.vDate}`],
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
      'Quantity',
      'MRP',
      'Rate',
      'Net Amount',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = (order.psoItems || []).map((item: any) => [
      item.itmCode,
      item.itmName,
      item.qty,
      item.mrp,
      item.rate,
      item.netamount,
    ]);

    exportData.forEach((rowData: any) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    const totalQty = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[2] || 0),
      0
    );
    const totalMRP = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[3] || 0),
      0
    );
    const totalRate = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[4] || 0),
      0
    );
    const totalAmount = exportData.reduce(
      (sum: any, row: any[]) => sum + (row[5] || 0),
      0
    );

    const totalRow = worksheet.addRow([
      'Total',
      '',
      totalQty,
      totalMRP,
      totalRate,
      totalAmount,
    ]);
    worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `Sales Order ${order.mkey} .xlsx`);
    });
  }

  updateView(view: string): void {
    // this.currentView = view;    // this.filteredOrders = this.orders.filter((po) =>
    //   view === 'all' ? true : po.status.toLowerCase() === view
    // );
  }
}

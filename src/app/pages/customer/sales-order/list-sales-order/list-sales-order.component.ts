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
import { ReportGeneratorComponent } from '../../../../components/report-generator/report-generator.component';
import { ReportGenratedResponse } from '../../../../Models/Common/generated-report.model';
import { HttpClient } from '@angular/common/http';
import { ReportGeneratorService } from '../../../../services/shared/report-generator/report-generator.service';
import { SalesOrder } from '../../../../Models/interface/SalesOrder.interface';
import { SODetail, SOMain } from '../../../../Models/SalesOrder/SalesOrder';

@Component({
  selector: 'app-list-sales-order',
  imports: [CommonModule, FormsModule, RouterModule, ReportGeneratorComponent],
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
  latestReportStatus: string | null = null;
  latestReport: ReportGenratedResponse | null = null;
  soList: SalesOrder[] = [];
  totalPage: number = 0;
  currentPage: number = 1;
  pagedSOList: any[] = [];
  fetchedDetails = new Map<number, SODetail[]>();
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  updationData: {} = {};

  private searchOrderNoSubject = new Subject<string>();

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private sharedServrice: SharedService,
    private userService: UserService,
    private reportGeneratorService: ReportGeneratorService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.acmId = this.userService._user?.UsrLinkAcmId ?? 0;
    this.changePageSize(this.pageSizes[2]); // Default to 50 items per page
    this.searchOrderNoSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((serachOrderNoTerm) => {
        if (serachOrderNoTerm.trim()) {
          // this.searchOrders(serachOrderNoTerm);
          this.onSearchOrderNoInputString(serachOrderNoTerm);
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
      error: (error) => { },
    });
    // window.open(report.fileUrl, '_blank');
  }

  // editSO(so: any) {
  //   this.shoppingCartService.enableEditing();
  //   this.salesOrderService.setEditableItem(so);
  //   if (so.orderType === 'items') {
  //     this.sharedServrice.setCartMode('items');
  //     this.router.navigate(['/items/create-order']);
  //   } else {
  //     this.sharedServrice.setCartMode('catalouge');
  //     this.router.navigate(['/catalouge/create-order']);
  //   }
  // }

  // deleteSO(so: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You want to delete this sales order?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.salesOrderService.deleteSalesOrder(so.mkey).subscribe({
  //         next: () => {
  //           this.getOrderList();
  //           Swal.fire({
  //             toast: true,
  //             icon: 'success',
  //             title: 'Deleted',
  //             position: 'top-end',
  //             showConfirmButton: false,
  //             timer: 2000,
  //             timerProgressBar: true,
  //             didOpen: (toast) => {
  //               toast.addEventListener('mouseenter', Swal.stopTimer);
  //               toast.addEventListener('mouseleave', Swal.resumeTimer);
  //             },
  //           });
  //         },
  //         error: (err) => {
  //           Swal.fire({
  //             toast: true,
  //             icon: 'error',
  //             title: 'Error deleting the order.',
  //             position: 'top-end',
  //             showConfirmButton: false,
  //             timer: 2000,
  //             timerProgressBar: true,
  //             didOpen: (toast) => {
  //               toast.addEventListener('mouseenter', Swal.stopTimer);
  //               toast.addEventListener('mouseleave', Swal.resumeTimer);
  //             },
  //           });
  //         },
  //       });
  //     }
  //   });
  // }

  // getTotalQty(items: any[]): number {
  //   return items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  // }

  // getTotalRate(items: any[]): number {
  //   return items.reduce((sum, item) => sum + Number(item.rate || 0), 0);
  // }

  // getTotalMRP(items: any[]): number {
  //   return items.reduce((sum, item) => sum + Number(item.rate || 0), 0);
  // }

  // getTotalAmount(items: any[]): number {
  //   return items.reduce((sum, item) => sum + Number(item.netamount || 0), 0);
  // }

  // toggleDetails(index: number): void {
  //   if (this.openIndexes.has(index)) {
  //     this.openIndexes.delete(index);
  //   } else {
  //     this.openIndexes.add(index);
  //   }
  // }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  // onSearchOrderNoInput(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.searchOrderNoSubject.next(value);
  // }

  // getOrderListt() {
  //   this.isOrderLoading = true;
  //   this.salesOrderService
  //     .getOrderListt(this.acmId, this.pageNumber, this.pageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.isOrderLoading = false;
  //         this.orders = response.data;
  //         this.totalRecords = response.totalRecords;
  //         console.log('response', response);
  //         console.log('orders', this.orders);
  //         console.log('totalRecords', this.totalRecords);
  //       },
  //       error: (err) => {
  //         this.isOrderLoading = false;
  //         console.error('Failed to fetch orders:', err);
  //       },
  //     });
  // }

  // searchOrders(searchTerm: string) {
  //   this.pageNumber = 1;
  //   this.salesOrderService
  //     .getOrderList(this.acmId, this.pageNumber, this.pageSize, searchTerm)
  //     .subscribe({
  //       next: (response) => {
  //         this.orders = response.data;
  //         this.totalRecords = response.totalRecords;
  //       },
  //       error: (err) => {
  //         console.error('Failed to search orders:', err);
  //       },
  //     });
  // }

  handleReport(event: {
    startDate: string;
    endDate: string;
    listType: string;
  }) {
    console.log('Report request:', event);
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

  // nextPage(): void {
  //   if (this.pageNumber < this.totalPages()) {
  //     this.pageNumber++;
  //     this.getOrderList();
  //     this.openIndexes.clear();
  //   }
  // }

  // prevPage(): void {
  //   if (this.pageNumber > 1) {
  //     this.pageNumber--;
  //     this.getOrderList();
  //     this.openIndexes.clear();
  //   }
  // }

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
      'Net Amount',
      'Status',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    const exportData = this.pagedSOList.map((item: any) => [
      item.SomBrnName,
      item.SomVno,
      item.SomVdate,
      item.SomItems,
      item.SomNetAmt,
      item.SomStatus,
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

  exportOrderToExcel(order: any,so: any): void {
    if (!Array.isArray(this.orders) || this.orders.length === 0) {
      console.warn('No orders to export');
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Orders');

    const heading = [
      ['Order Details'],
      [`Order No: ${so.SomVno}`],
      [`Date: ${so.SomVdate}`],
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

    const exportData = (order || []).map((item: any) => [
      item.SodItmCode,
      item.SodItmName,
      item.SodQty,
      item.SodMrp,
      item.SodRate,
      item.SodNetAmt,
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
      FileSaver.saveAs(blob, `Sales Order ${so.SomVno} .xlsx`);
    });
  }

  updateView(view: string): void {
    // this.currentView = view;    // this.filteredOrders = this.orders.filter((po) =>
    //   view === 'all' ? true : po.status.toLowerCase() === view
    // );
  }

  getOrderList() {
    this.isOrderLoading = true;
    const amcId: number = this.userService._user?.UsrLinkAcmId ?? 0;
    const stsCode: number = 0;
    this.salesOrderService.getOrderList(amcId, stsCode).subscribe({
      next: (response) => {
        this.isOrderLoading = false;
        this.soList = response.SOList;
        console.log('slList', this.soList);
        this.paginate();
      },
      error: (err) => {
        this.isOrderLoading = false;
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

  editSO(so: any, index: number) {
    this.shoppingCartService.enableEditing();

    this.GetSoDetail(index, (finalData: any) => {
      this.salesOrderService.setEditableItem(finalData);
      this.router.navigate(['/items/create-order']);
    });
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
        const user = this.userService._user?.UsrId || 0;
        this.salesOrderService.deleteSO(so.SomMkey, user).subscribe({
          next: () => {
            this.refreshOrders();
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

  GetSoDetail(index: number, callback: (data: any) => void) {
    const data = this.soList[index];
    this.salesOrderService
      .getSOByMkey(data.SomMkey)
      .subscribe({
        next: (response) => {
          this.updationData = { ...response };
          callback(this.updationData);
        },
        error: (err) => {
          console.error('Error fetching details', err);
        }
      })

  }

  paginate(): void {
    this.totalPage = Math.ceil(this.soList.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedSOList = this.soList.slice(startIndex, endIndex);
    this.openIndexes.clear();
  }

  nextPage(): void {
    this.openIndexes.clear();
    if (this.currentPage < this.totalPage) {
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


  // GetSoDetail(index: number, callback: (data: any) => void) {
  //   const data = this.soList[index];

  //   this.myOrdersService
  //     .getSOByMkey(data.SomMkey)
  //     .subscribe({
  //       next: (response) => {
  //         this.updationData = { ...response };
  //         console.log('updatation Data', this.updationData);
  //         callback(this.updationData);
  //       },
  //       error: (err) => {
  //         console.error('Error fetching details', err);
  //       }
  //     })

  // }

  toggleDetails(index: number): void {
    if (this.openIndexes.has(index)) {
      this.openIndexes.delete(index);
    } else {
      const row = this.soList[index];
      if (!this.fetchedDetails.has(index)) {
        this.salesOrderService
          .getSOByMkey(row.SomMkey)
          .subscribe({
            next: (response) => {
              this.fetchedDetails.set(
                index,
                response?.SO?.SoDetails ?? []
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

  getTotalQty(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.SodQty || 0), 0);
  }

  getTotalRate(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.SodRate || 0), 0);
  }

  getTotalMRP(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.SodRate || 0), 0);
  }

  getTotalAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.SodNetAmt || 0), 0);
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
    this.totalPage = 1;
    this.currentPage = 1;
    this.openIndexes.clear();
  }

  async exportAndGetData(so: any, index: number) {
    try {
      await this.GetData(index);       // wait for HTTP fetch
      this.exportOrderToExcel(this.orders, so);     // then export
    } catch (err) {
      console.error('Failed to fetch data, export cancelled', err);
    }
  }

  async GetData(index: number): Promise<void> {
    const row = this.soList[index];

    return new Promise((resolve, reject) => {
      this.salesOrderService.getSOByMkey(row.SomMkey).subscribe({
        next: (response) => {
          this.fetchedDetails.set(index, Array.isArray(response?.SO?.SoDetails) ? response.SO.SoDetails : []);
          this.orders = this.fetchedDetails.get(index) || [];
          resolve(); //  resolve AFTER data is fetched
        },
        error: (err) => {
          console.error('Error fetching details', err);
          reject(err); // reject on error
        },
      });
    });
  }


}

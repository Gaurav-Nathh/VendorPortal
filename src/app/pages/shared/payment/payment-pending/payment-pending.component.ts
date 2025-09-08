import { Component } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { UserService } from '../../../../services/shared/user-service/user.service';

export interface OutstandingBill {
  WISE: string;
  BILLDATE: string; // format: DD/MM/YYYY
  BILLTYPE: string;
  BILLNO: string;
  BILLAMT: number;
  PAYAMT: number;
  ADJAMT: number;
  BALANCE: number;
  DUEDATE: string; // format: DD/MM/YYYY
  OVERDUE: number;
}

@Component({
  selector: 'app-payment-pending',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.scss',
})
export class PaymentPendingComponent {
  data: OutstandingBill[] = [];
  totalInvoice: number = 0;
  totalPayment: number = 0;
  totalAdjustment: number = 0;
  totalBalance: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 16;
  filteredItems: OutstandingBill[] = [];
  private acmName: string = '';
  private UsrName: string = '';

  searchText: string = '';

  constructor(
    public paymentService: PaymentServiceService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.acmName = this.userService._user?.UsrLinkAcmName ?? '';
    this.UsrName = this.userService._user?.UsrName ?? '';
    this.paymentFun();
  }

  applySearch() {
    const text = this.searchText.toLowerCase();
    this.filteredItems = this.data.filter(
      (item) =>
        // item.WISE?.toLowerCase().includes(text) ||
        // item.BILLNO?.toLowerCase().includes(text)
        item.WISE?.toLowerCase().includes(text)
    );
    this.currentPage = 1;
  }

  paymentFun() {
    this.paymentService.pendingPaymentList().subscribe({
      next: (response: any) => {
        this.data = response.ReportData.Table;
        this.filteredItems = response.ReportData.Table;
        console.log('DATA', this.data);
        this.calculateTotals();
      },
    });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Outstanding');

    // ===== 1. Header Lines =====
    const headerLines = [
      ['Archies Test Company'],
      ['509-511 Gagandeep Building, Rajendra Place, New Delhi 110008 | 110008'],
      ['Dehradun'],
      [
        'Rajpur Rd, Opposite Osho, Chander Lok Colony, Hathibarkala Salwala | Uttarakhand | Dehradun',
      ],
      [`${this.acmName}`],
      [
        `${new Date().toDateString()} | PARTY | DETAIL | NORMAL | UNCLEARED | ALL | ALL | REF DATE | ALL`,
      ],
    ];

    headerLines.forEach((line, idx) => {
      const row = worksheet.addRow(line);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center' };
        if (idx === 0) {
          cell.font = { bold: true, size: 12 };
        }
      });
      worksheet.mergeCells(`A${row.number}:I${row.number}`);
    });

    worksheet.addRow([]); // blank line

    // ===== 2. Table Column Titles =====
    const columnHeaders = [
      'Date',
      'Type',
      'Ref No.',
      'Invoice',
      'Payment',
      'Adjustment',
      'Balance',
      'Due Date',
      'Over Due',
    ];
    const headerRow = worksheet.addRow(columnHeaders);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getColumn(colNumber).width = 15;
    });

    // ===== 3. Data Rows =====
    const exportData = this.data.map((item: any) => [
      item.BILLDATE,
      item.BILLTYPE,
      item.BILLNO,
      item.BILLAMT,
      item.PAYAMT,
      item.ADJAMT,
      item.BALANCE,
      item.DUEDATE,
      item.OVERDUE,
    ]);

    exportData.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // ===== 4. Total Row =====
    const totalInvoice = this.data.reduce(
      (sum, item) => sum + (item.BILLAMT ?? 0),
      0
    );
    const totalPayment = this.data.reduce(
      (sum, item) => sum + (item.PAYAMT ?? 0),
      0
    );
    const totalAdjustment = this.data.reduce(
      (sum, item) => sum + (item.ADJAMT ?? 0),
      0
    );
    const totalBalance = this.data.reduce(
      (sum, item) => sum + (item.BALANCE ?? 0),
      0
    );

    const totalRow = worksheet.addRow([
      '',
      '',
      'TOTAL :',
      totalInvoice,
      totalPayment,
      totalAdjustment,
      totalBalance,
      '',
      '',
    ]);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // ===== 5. Footer =====
    worksheet.addRow([]);
    const footer1 = worksheet.addRow(['This is system generated excel sheet.']);
    worksheet.mergeCells(`A${footer1.number}:I${footer1.number}`);
    footer1.getCell(1).alignment = { horizontal: 'center' };

    const footer2 = worksheet.addRow([`Generated by: ${this.UsrName}`]);
    worksheet.mergeCells(`A${footer2.number}:I${footer2.number}`);
    footer2.getCell(1).alignment = { horizontal: 'center' };

    const footer3 = worksheet.addRow([
      `Generated on: ${new Date().toLocaleString()}`,
    ]);
    worksheet.mergeCells(`A${footer3.number}:I${footer3.number}`);
    footer3.getCell(1).alignment = { horizontal: 'center' };

    // ===== 6. Export File =====
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'Outstanding_Report.xlsx');
    });
  }

  calculateTotals() {
    this.totalInvoice = this.data.reduce(
      (sum, item) => sum + (item.BALANCE ?? 0),
      0
    );
    this.totalPayment = this.data.reduce(
      (sum, item) => sum + (item.PAYAMT ?? 0),
      0
    );
    this.totalAdjustment = this.data.reduce(
      (sum, item) => sum + (item.ADJAMT ?? 0),
      0
    );
    this.totalBalance = this.data.reduce(
      (sum, item) => sum + (item.BALANCE ?? 0),
      0
    );
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredItems.slice(start, end);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
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

  referseData() {
    this.paymentFun();
  }
}

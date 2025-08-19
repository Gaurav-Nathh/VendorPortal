import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { PaymentServiceService } from '../../../../services/vendor-service/payment/payment-service.service';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UserService } from '../../../../services/shared/user-service/user.service';

export interface AccountTransaction {
  CODE: string;
  Date: string; // ISO date string, e.g., "2025-04-16T00:00:00"
  Vtype: string;
  'No.': string;
  Particular: string;
  Amount: number | null;
  Debit: number;
  Credit: number;
  Narration: string;
  'Trn. No.': string;
  'Trn. Date': string | null; // nullable
  DIFF: number;
  ROWNO: number;
  TYPE: string; // e.g., "TRN"
  BTPID: number;
  BTPCODE: string;
  BRNID: number;
  FYRID: number;
}

@Component({
  selector: 'app-payment-history',
  imports: [CommonModule, FormsModule, TooltipModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss',
})
export class PaymentHistoryComponent {
  @ViewChildren('tooltipRef') tooltips!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.tooltips.forEach((tooltipEl: ElementRef) => {
      new Tooltip(tooltipEl.nativeElement);
    });
  }

  constructor(
    public statementService: PaymentServiceService,
    private userService: UserService
  ) {}
  data: AccountTransaction[] = [];
  tble: any[] = [];

  searchText: string = '';
  filteredItems: AccountTransaction[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  acmName: string = '';
  UsrName: string = '';

  ngOnInit() {
    this.acmName = this.userService._user?.UsrLinkAcmName ?? '';
    this.UsrName = this.userService._user?.UsrName ?? '';
    this.AcntStament();
  }

  AcntStament() {
    this.statementService.accountStatement().subscribe({
      next: (response: any) => {
        this.data = response.ReportData.Table.reverse();
        this.tble = response.ReportData.Table1;
        this.filteredItems = [...this.data]; // initialize filtered data
      },
    });
  }

  applySearch() {
    const text = this.searchText.toLowerCase();
    this.filteredItems = this.data.filter(
      (item) =>
        item.Particular?.toLowerCase().includes(text) ||
        item['No.']?.toLowerCase().includes(text) ||
        item.Vtype?.toLowerCase().includes(text)
    );
    this.currentPage = 1;
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

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Account Statement');

    // Merge and Centered Heading Rows
    const heading = [
      ['Archies Test Company'],
      ['509-511 Gagandeep Building, Rajendra Place, New Delhi 110008 | 110008'],
      ['Dehradun'],
      [
        'Rajpur Rd, Opposite Osho, Chander Lok Colony, Hathibarkala Salwala | Uttarakhand | Dehradun',
      ],
      [`Ledger - ${this.acmName}`],
    ];

    heading.forEach((row, index) => {
      const headingRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);
      headingRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headingRow.font = { bold: true, size: 12 };
    });

    // Filters Row
    const today = new Date();
    const formattedDate = today.toDateString();
    const filterRow = worksheet.addRow([`${formattedDate} DETAIL | SINGLE`]);
    worksheet.mergeCells(`A6:I6`);
    filterRow.alignment = { vertical: 'middle', horizontal: 'center' };
    filterRow.font = { bold: true };

    // Table Header
    const header = [
      'Date',
      'Type',
      'No.',
      'Particular',
      'Debit',
      'Credit',
      'Narration',
      'Trn. No.',
      'Trn. Date',
    ];
    worksheet.addRow(header);
    const headerRow = worksheet.getRow(7);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    this.data.forEach((item: any) => {
      worksheet.addRow([
        item.Date,
        item.Vtype,
        item['No.'],
        item.Particular,
        item.Debit,
        item.Credit,
        item.Narration,
        item['Trn. No.'],
        item['Trn. Date'],
      ]);
    });

    // Summary rows from `tble[0]`
    worksheet.addRow([]);
    worksheet.addRow([
      'Opening Balance:',
      '',
      '',
      '',
      '',
      this.tble[0].OPCREDIT,
      '',
      '',
      '',
    ]);
    worksheet.addRow([
      'Current Total:',
      '',
      '',
      '',
      this.tble[0].DEBIT,
      this.tble[0].CREDIT,
      '',
      '',
      '',
    ]);
    worksheet.addRow([
      'Closing Balance:',
      '',
      '',
      '',
      '',
      this.tble[0].BALCREDIT,
      '',
      '',
      '',
    ]);

    // Apply center alignment for all cells
    worksheet.eachRow((row) => {
      row.alignment = { horizontal: 'center' };
    });

    // Auto width
    worksheet.columns.forEach((col: Partial<ExcelJS.Column>) => {
      let maxLength = 10; // Start with a reasonable minimum width

      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, value.length);
      });

      // Cap the width to avoid extremely wide columns
      col.width = Math.min(maxLength + 2, 30); // Adjust '30' as your max width
    });

    // Export logic
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `AccountStatement_Report.xlsx`);
    });
  }

  referseData() {
    this.AcntStament();
  }
}

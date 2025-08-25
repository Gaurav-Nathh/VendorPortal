import { Component } from '@angular/core';
import { ItemMappingService } from '../../../services/vendor-service/item-mapping/item-mapping.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportGenratedResponse } from '../../../Models/Common/generated-report.model';
import { ReportGeneratorService } from '../../../services/shared/report-generator/report-generator.service';
import { HttpClient } from '@angular/common/http';
import { ReportGeneratorComponent } from '../../../components/report-generator/report-generator.component';

export interface Item {
  ItmCode: string;
  ItmName: string;
  // Add more fields as needed
}
export class ItemMapping {
  itvPrdCode: string = '';
  itvPrdName: string = '';
}

export interface ItemMappingResponse {
  ItemList: Item[];
}

@Component({
  selector: 'app-item-mapping',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTooltipModule,
    ReportGeneratorComponent,
  ],
  templateUrl: './item-mapping.component.html',
  styleUrl: './item-mapping.component.scss',
})
export class ItemMappingComponent {
  searchTimeout: any;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  latestReportStatus: string | null = null;
  latestReport: ReportGenratedResponse | null = null;

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

  isNaN = isNaN;

  itemMapping: ItemMapping = new ItemMapping();
  constructor(
    private itemMappingService: ItemMappingService,
    private reportGeneratorService: ReportGeneratorService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.getData();
  }

  items: any[] = [];
  filteredItems: any[] = [];
  searchText: string = '';

  enableEditing(item: any) {
    this.items.forEach((i) => (i.isEditing = false)); // optional: allow only one at a time
    item.isEditing = true;
  }

  getData() {
    this.itemMappingService.getMappingItems().subscribe({
      next: (data: ItemMappingResponse) => {
        this.items = data.ItemList;
        this.filteredItems = [...this.items]; // Initialize filteredItems

        this.itemMapping.itvPrdCode = this.items[0]?.ItmItvPrdCode || '';
        this.itemMapping.itvPrdName = this.items[0]?.ItmItvPrdName || '';
      },
      error: (error) => {
        console.error('Error fetching mapping items:', error);
      },
    });
  }

  referseData() {
    this.getData();
  }

  saveItem(item: any) {
    item.isEditing = false;
    // Assign values from item to the service model
    this.itemMappingService.itemMapping.itvItmId = item.ItmId;
    this.itemMappingService.itemMapping.itvPrdCode = item.ItmItvPrdCode;
    this.itemMappingService.itemMapping.itvPrdName = item.ItmItvPrdName;

    this.itemMappingService.postMappingItems().subscribe({
      next: (res) => {
        // console.log('Item saved successfully:', res);
      },
      error: (err) => {
        console.error('Error saving item:', err);
      },
    });
  }

  onSearchChange(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applySearch();
    }, 500); // Delay in milliseconds
  }

  applySearch() {
    const text = this.searchText.toLowerCase().trim();
    this.filteredItems = this.items.filter(
      (item) =>
        item.ItmCode?.toLowerCase().includes(text) ||
        item.ItmName?.toLowerCase().includes(text)
    );
    this.currentPage = 1; // Reset to page 1 after search
  }

  /*  openFilterModal() {
    alert('Filter modal logic goes here');
  } */

  toggleMappingForm() {}

  editItem(item: any) {
    // console.log('Editing item:', item);
  }

  deleteItem(item: any) {
    this.filteredItems = this.filteredItems.filter((i) => i !== item);
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
}

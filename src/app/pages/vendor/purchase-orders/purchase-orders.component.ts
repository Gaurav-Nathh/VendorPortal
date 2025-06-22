
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoVendorServiceService } from '../../../services/vendor-service/po-vendor-service/po-vendor-service.service';







export interface Acm {
  ACMCODE: string;
  ACMNAME: string;
  TDS_ID: number;
  GSTTYPE: string;
  GSTID: number;
  PAN: string;
  STATUS: string;
  TDSCODE: string | null;
  TDSID: number;
  EXEMPTAMT: number;
  TDSRATE: number;
  CESSRATE: number;
  GSTINNO: string;
  HSNCODE: string;
  GST_CATEGORY: string | null;
  ACT_ID: number;
  CNTID: number;
  EMPID: number | null;
  EMPNAME: string;
  STAGSTCODE: string | null;
  STANAME: string | null;
  PAYMODE: string;
  SHPMETHOD: string;
  SHIPPER: string;
  SHIPPERID: number;
  GSTSTATUS: string;
}
export interface TDSResponse {
  ACM: Acm[];
  ISCOSTCENTER: boolean;
  PartyTds: any[];
  PartyTcs: any[];
  TdsDetail: any[];
}
interface TableItem {
  id: number;            // We'll assign index-based IDs
  orderNo: string;       // From PomVno
  date: string;          // From PomVdate
  itemCount: number;     // Sum of PodQty
  value: number;         // Sum of PodNetAmt
  status: string;        // From PomStatus
}





@Component({
  selector: 'app-purchase-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {

   
   status: string = '';
  searchTerm: string = '';
  
  statusArray: string[] = [
   'open',
   'Billed'
  ];

  // Sample data for demonstration
  sampleData: TableItem[] = []
    

  filteredData: TableItem[] = [];

  constructor(private poListService:PoVendorServiceService) { 
    this.status = this.statusArray[0];
  }

  ngOnInit(): void {
    this.filteredData = [...this.sampleData];
    this.getPoList();
  }

  statusfun(): void {
    console.log('Status changed to:', this.status);
    this.filterData();

  }

  onSearch(): void {
    console.log('Search term:', this.searchTerm);
    this.filterData();
  }

  refreshData(): void {
    console.log('Refreshing data...');
    
    // Reset filters
    this.searchTerm = '';
    this.status = this.statusArray[0];
    
    // Simulate data refresh
    this.loadData();
    
    // Show refresh feedback (optional)
    this.showRefreshFeedback();
  }

  private filterData(): void {
    let filtered = [...this.sampleData];

    // Filter by status
    if (this.status && this.status !== 'All Status') {
      filtered = filtered.filter(item => 
        item.status.toLowerCase() === this.status.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.orderNo.toLowerCase().includes(searchLower) ||
        item.date.includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        item.value.toString().includes(searchLower)
      );
    }

    this.filteredData = filtered;
    console.log('Filtered data:', this.filteredData);
  }

  private loadData(): void {
    // Simulate API call
    setTimeout(() => {
      this.filteredData = [...this.sampleData];
      console.log('Data loaded successfully');
    }, 500);
  }

  private showRefreshFeedback(): void {
    // Add visual feedback for refresh action
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
      refreshBtn.classList.add('loading');
      setTimeout(() => {
        refreshBtn.classList.remove('loading');
      }, 1000);
    }
  }

  // Helper methods for template
  getStatusClass(index: number): string {
    const statuses = ['status-active', 'status-pending', 'status-completed'];
    return statuses[index % statuses.length];
  }

 

  viewItems(item: TableItem): void {
    console.log('Viewing items for:', item.orderNo);
    // Implement view logic here
  }

  // Optional: Add sorting functionality
  sortBy(column: string): void {
    console.log('Sorting by:', column);
    // Implement sorting logic here
  }
  


getAlignment(value: any): string {
  return typeof value === 'number' ? 'text-end' : 'text-start';
}

/* getPoList(){
  this.poListService.vendorPoList().subscribe({
    next: (data) => {
      console.log('PO List:', data);
      // Process the data as needed
    },
    error: (error) => {
      console.error('Error fetching PO list:', error);
    }
  });
 
} */

  getPoList() {
  this.poListService.vendorPoList().subscribe({
    next: (data: any) => {
      console.log('PO List:', data);

      this.sampleData = data.POList.map((po: any, index: number) => {
        const totalQty = po.PoDetails?.reduce((sum: number, d: any) => sum + (d.PodQty || 0), 0) || 0;
        const totalNetAmt = po.PoDetails?.reduce((sum: number, d: any) => sum + (d.PodNetAmt || 0), 0) || 0;

        return {
          id: index + 1,
          orderNo: po.PomVno ?? 'N/A',
          date: (po.PomVdate ?? '').slice(0, 10),

          itemCount: totalQty,
          value: totalNetAmt,
          status: po.PomStatus ?? 'Unknown'
        };
      });

      // Now apply filters if needed
      this.filteredData = [...this.sampleData];
    },
    error: (error) => {
      console.error('Error fetching PO list:', error);
    }
  });
}

 


 

 
 
 






 

  
}

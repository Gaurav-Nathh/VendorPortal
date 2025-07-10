
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoVendorServiceService } from '../../../services/vendor-service/po-vendor-service/po-vendor-service.service';
import { PoListComponent } from "../../../components/vendor/po-list/po-list.component";













@Component({
  selector: 'app-purchase-orders',
  imports: [CommonModule, FormsModule, PoListComponent],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {

  fullData: any[] = [];
   //showModal: boolean = false;
  selectedPoItem: any = null; // or use a typed interface if you have one

   status: string = 'All';
  searchTerm: string = '';
   expandedMkey: string | null = null;
  
  currentPage: number = 1;
itemsPerPage: number = 10;


  statusArray: string[] = [
   'open',
   'Billed'
  ];


  constructor(private poListService:PoVendorServiceService) { 
   
  }
filteredData: any[]=[]


  ngOnInit(): void {
   this.getPoList()

  }

applyFilters() {
  const statusFilter = this.status.toLowerCase();
  const search = this.searchTerm.toLowerCase();

  this.filteredData = this.fullData.filter(item => {
    const itemStatus = item.PomStatus?.toLowerCase() || '';
    const itemVno = item.PomVno?.toLowerCase() || '';

    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
    const matchesSearch = search === '' || itemVno.includes(search);

    return matchesStatus && matchesSearch;
  });

  this.currentPage = 1; // Reset to first page after filtering
}

get paginatedData(){
  const start= (this.currentPage-1)*this.itemsPerPage;
  const end = start+ this.itemsPerPage;
  return this.filteredData.reverse().slice(start, end);
}
get totalPages(): number {
  return Math.ceil(this.filteredData.length / this.itemsPerPage);
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
 /*  this.searchTerm = '';
  this.status = 'All';
  this.currentPage = 1; */
  this.applyFilters();
}


  getPoList() {
  this.poListService.vendorPoList().subscribe((data: any) => {
    if (Array.isArray(data.POList)) {
      this.fullData = data.POList.map((item: any) => ({
        PomVno: item.PomVno,
        PomVdate: item.PomVdate,
        PomMkey: item.PomMkey,
        PomNetAmt: item.PomNetAmt,
        PomStatus: item.PomStatus,
        PomShpBrnName: item.PomShpBrnName,
        PomItems:item.PomItems
      }));
      this.applyFilters();
    } else {
      console.error('POList is not an array', data);
    }
  });
}

 


getPoDetails(item: any) {
  if (this.expandedMkey === item.PomMkey) {
    this.expandedMkey = null;
    this.selectedPoItem = null;
  // this.showModal = false;
  } else {
    this.expandedMkey = item.PomMkey;
    this.selectedPoItem = item;
   // this.showModal = true;
   // console.log('Fetching details for PO:', item.PomMkey);
  }
}


closeDropdown() {
  this.expandedMkey = null;
  this.selectedPoItem = null;
//  this.showModal = false;
}



  downloadPdf(data:string){

  }




getAlignment(value: any): string {
  return typeof value === 'number' ? 'text-end' : 'text-start';
}


openedRowIndex: number | null = null;

toggleRow(index: number) {
  this.openedRowIndex = this.openedRowIndex === index ? null : index;
}


  
}

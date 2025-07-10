import { Component } from '@angular/core';
import { ItemMappingService } from '../../../services/vendor-service/item-mapping/item-mapping.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Item {
  ItmCode: string;
  ItmName: string;
  // Add more fields as needed
}
export class ItemMapping{
  itvPrdCode: string = '';
  itvPrdName: string = '';
}

export interface ItemMappingResponse {
  ItemList: Item[];
  
}

@Component({
  selector: 'app-item-mapping',
  standalone: true,
  imports: [FormsModule,CommonModule,MatTooltipModule],
  templateUrl: './item-mapping.component.html',
  styleUrl: './item-mapping.component.scss',
})


export class ItemMappingComponent {
//variables
  searchTimeout: any; // To hold the timeout ID for search delay

   currentPage: number = 1;
itemsPerPage: number = 20;



get paginatedData(){
  const start= (this.currentPage-1)*this.itemsPerPage;
  const end = start+ this.itemsPerPage;
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

  isNaN = isNaN

  itemMapping: ItemMapping = new ItemMapping();
  constructor(private itemMappingService: ItemMappingService) {}
  ngOnInit() {
  this.getData();
  }

  items: any[] = [];
  filteredItems: any[] = [];
  searchText: string = '';

  enableEditing(item: any) {
  this.items.forEach(i => i.isEditing = false); // optional: allow only one at a time
  item.isEditing = true;
}

getData(){
this.itemMappingService.getMappingItems().subscribe({
    next: (data: ItemMappingResponse) => {
      this.items = data.ItemList;
      this.filteredItems = [...this.items]; // Initialize filteredItems

      
      this.itemMapping.itvPrdCode = this.items[0]?.ItmItvPrdCode || '';
      this.itemMapping.itvPrdName = this.items[0]?.ItmItvPrdName || '';
      console.log('Initial item mapping:', this.itemMapping);
       
    },
    error: (error) => {
      console.error('Error fetching mapping items:', error);
    },
  });
}


referseData(){
  this.getData();
}

saveItem(item: any) {
  item.isEditing = false;
  console.log('Saving item:', item);

  // Assign values from item to the service model
  this.itemMappingService.itemMapping.itvItmId = item.ItmId;
  this.itemMappingService.itemMapping.itvPrdCode = item.ItmItvPrdCode;
  this.itemMappingService.itemMapping.itvPrdName = item.ItmItvPrdName;

  this.itemMappingService.postMappingItems().subscribe({
    next: (res) => {
      console.log('Item saved successfully:', res);
    },
    error: (err) => {
      console.error('Error saving item:', err);
    }
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
  this.filteredItems = this.items.filter(item =>
    item.ItmCode?.toLowerCase().includes(text) ||
    item.ItmName?.toLowerCase().includes(text)
  );
  this.currentPage = 1; // Reset to page 1 after search
}

 /*  openFilterModal() {
    alert('Filter modal logic goes here');
  } */

  toggleMappingForm() {

  }

  editItem(item: any) {
    console.log('Editing item:', item);
  }

  deleteItem(item: any) {
    this.filteredItems = this.filteredItems.filter(i => i !== item);
  }
}

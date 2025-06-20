import { Component } from '@angular/core';
import { ItemMappingService } from '../../../services/vendor-service/item-mapping/item-mapping.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Item {
  ItmCode: string;
  ItmName: string;
  // Add more fields as needed
}
export interface ItemMappingResponse {
  ItemList: Item[];
}

@Component({
  selector: 'app-item-mapping',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './item-mapping.component.html',
  styleUrl: './item-mapping.component.scss',
})


export class ItemMappingComponent {
  constructor(private itemMappingService: ItemMappingService) {}
  ngOnInit() {
  this.itemMappingService.getMappingItems().subscribe({
    next: (data: ItemMappingResponse) => {
      this.items = data.ItemList;
      this.filteredItems = [...this.items]; // Initialize filteredItems

      console.log('ItmCode:', this.items[0]?.ItmCode);
      console.log('ItmName:', this.items[0]?.ItmName);
    },
    error: (error) => {
      console.error('Error fetching mapping items:', error);
    },
  });
  }

  items: any[] = [];
  filteredItems: any[] = [];
  searchText: string = '';

  enableEditing(item: any) {
  this.items.forEach(i => i.isEditing = false); // optional: allow only one at a time
  item.isEditing = true;
}

saveItem(item: any) {
  item.isEditing = false;
  console.log('Saving item:', item);
  // Optionally: call API to persist changes
}



  applySearch() {
   const text = this.searchText.toLowerCase();
  this.filteredItems = this.items.filter(item =>
    item.ItmCode?.toLowerCase().includes(text) ||
    item.ItmName?.toLowerCase().includes(text)
  );

  console.log('Filtered items:', this.filteredItems);

  }

  openFilterModal() {
    alert('Filter modal logic goes here');
  }

  toggleMappingForm() {

  }

  editItem(item: any) {
    console.log('Editing item:', item);
  }

  deleteItem(item: any) {
    this.filteredItems = this.filteredItems.filter(i => i !== item);
  }
}

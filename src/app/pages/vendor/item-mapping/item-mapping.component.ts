import { Component } from '@angular/core';
import { ItemMappingService } from '../../../services/vendor-service/item-mapping/item-mapping.service';

@Component({
  selector: 'app-item-mapping',
  imports: [],
  templateUrl: './item-mapping.component.html',
  styleUrl: './item-mapping.component.scss',
})
export class ItemMappingComponent {
  constructor(private itemMappingService: ItemMappingService) {}
  ngOnInit() {
    this.itemMappingService.getMappingItems().subscribe({
      next: (data) => {
        console.log('Mapping items:', data);
      },
      error: (error) => {
        console.error('Error fetching mapping items:', error);
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../../../../services/shared/shared.service';
import { ShoppingCartComponent } from '../../../../shopping-cart/shopping-cart.component';
import { ShoppingCartService } from '../../../../../services/shoppingCart-service/shopping-cart.service';

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-form-purchase-order',
  imports: [RouterModule, CommonModule, FormsModule, ShoppingCartComponent],
  templateUrl: './form-purchase-order.component.html',
  styleUrl: './form-purchase-order.component.scss',
})
export class FormPurchaseOrderComponent {
  isShopingCartOpen = false;
  tempCheckoutItems: any[] = [];
  editingIndex: number | null = null;

  constructor(
    private sharedService: SharedService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.sharedService.shoppingCartVisible$.subscribe((visible) => {
      this.isShopingCartOpen = visible;
    });
    this.shoppingCartService.checkoutItems$.subscribe((items) => {
      this.tempCheckoutItems = items.map((item) => ({
        ...item,
      }));
    });
  }
  toggleShoppingCart() {
    this.shoppingCartService.setBtpCode('PO');
    setTimeout(() => this.sharedService.toggleShoppingCartVisibility(true), 0);
  }
  form = {
    vendorName: '',
    orgType: '',
    deliveryAddress: '',
    poNumber: '',
    referenceNumber: '',
    date: '',
    deliveryDate: '',
    paymentTerms: '',
    shipmentPreference: '',
    customerNotes: '',
    terms: '',
    discount: 0,
  };

  items = [{ itemName: '', account: '', quantity: 0, rate: 0, amount: 0 }];

  addItem(): void {
    this.items.push({
      itemName: '',
      account: '',
      quantity: 0,
      rate: 0,
      amount: 0,
    });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  updateAmount(item: any): void {
    const qty = +item.quantity || 0;
    const rate = +item.rate || 0;
    item.amount = qty * rate;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted', this.form, this.items);
    } else {
      console.log('Form is invalid');
    }
  }

  attachedFiles: AttachedFile[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        // Check if already at max files (10)
        if (this.attachedFiles.length >= 10) {
          alert('Maximum 10 files allowed');
          break;
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds the 10MB size limit`);
          continue;
        }

        this.attachedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    }
  }

  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onEditItem(index: number) {
    this.editingIndex = index;
  }

  onSaveItem(index: number) {
    const updatedItem = this.tempCheckoutItems[index];
    updatedItem.Amount = updatedItem.Quantity * updatedItem.Rate;

    // Replace all checkout items in the service
    this.shoppingCartService.setCheckoutItems([...this.tempCheckoutItems]);

    this.editingIndex = null;
  }

  onDelete(index: number): void {
    this.tempCheckoutItems.splice(index, 1);
    this.shoppingCartService.setCheckoutItems([...this.tempCheckoutItems]);
  }
}

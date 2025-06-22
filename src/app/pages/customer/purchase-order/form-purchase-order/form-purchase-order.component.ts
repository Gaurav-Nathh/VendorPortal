import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from '../../../shopping-cart/shopping-cart.component';
import { SharedService } from '../../../../services/shared/shared.service';
import { ShoppingCartService } from '../../../../services/shoppingCart-service/shopping-cart.service';
import { debounceTime, Subject } from 'rxjs';
import { VendorServiceFileService } from '../../../../services/vendor-service/vendor-service-file.service';
import { SearchVendorModel } from '../../../../Models/data-structure/vendor.model';

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

interface Vendor {
  AcmId: number;
  AcmCode: string;
  AcmName: string;
  AcmMobileNo: string;
  AcmPinCode: string;
  AcmGstin: string;
  AcmPan: string;
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

  categories = [
    { state: 'All', value: 'All' },
    { state: 'Code', value: 'AcmCode' },
    { state: 'Name', value: 'AcmName' },
    { state: 'Pin code', value: 'AcmPinCode' },
    { state: 'GSTIN', value: 'AcmGstin' },
    { state: 'PAN', value: 'AcmPan' },
  ];
  pageSizeOptions = [10, 20, 50, 100];
  statuses = ['Contain', 'Start With', 'End With'];

  showVendorPopup = false;
  vendorList: Vendor[] = [];
  selectedVendor: Vendor | null = null;
  selectVenId: number | null = null;

  loading = false;
  errorMessage: string | null = null;
  searchTerm = '';
  filteredVendors: Vendor[] = [];
  selectedCategory = 'Contain';
  selectedStatus = 'All';
  searchText: string = '';
  acmName: string = '';
  aboutRecord:string = 'More Records';
  vendor:string = '';
page: number = 1;
pageSize: number = 10;
Math = Math; // For using Math functions in the template

  private searchTextChanged = new Subject<string>();
  constructor(
    private sharedService: SharedService,
    private shoppingCartService: ShoppingCartService,
    public poService: VendorServiceFileService
  ) {
    this.searchTextChanged
      .pipe(
        debounceTime(500) // wait 500ms after last keystroke
      )
      .subscribe((value) => {
        this.searchcat(value); // call your function here
      });
  }

  ngOnInit() {
    this.sharedService.shoppingCartVisible$.subscribe((visible) => {
      this.isShopingCartOpen = visible;
    });
    this.shoppingCartService.checkoutItems$.subscribe((items) => {
      console.log('Checkout items:', items); // Debug log
      this.tempCheckoutItems = items.map((item) => ({
        ...item,
      }));
    });
  }


get paginatedVendors() {
  const start = (this.page - 1) * this.pageSize;
  return this.vendorList.slice(start, start + this.pageSize);
}
get totalPages() {
  return Math.ceil(this.vendorList.length / this.pageSize);
}
goToPage(pageNum: number) {
  this.page = pageNum;
}


  toggleShoppingCart() {
    this.shoppingCartService.setBtpCode('PO');
    setTimeout(() => this.sharedService.toggleShoppingCartVisibility(true), 0);
  }

  onSearchChange(value: string) {
    this.searchTextChanged.next(value);
  }

  searchcat(value: string) {
    this.poService.poVendor.Search = value;
    this.dblClickVen();
  }

  filterVendors(data: any) {
    console.log(data);
    this.poService.poVendor.SearchType = data;
    this.dblClickVen();
  }
  filterType(data: any) {
    this.poService.poVendor.SearchColumn = data;
    this.dblClickVen();
    // this.selectedStatus = data; // not needed, already bound by ngModel
  }
  resetFilters() {
    this.poService.poVendor = new SearchVendorModel();
    this.dblClickVen();
  }

  dblClickVen() {
    this.loading = true;
    this.errorMessage = null;
    this.showVendorPopup = true;

    this.poService.getVendor(this.poService.poVendor).subscribe({
      next: (res: any) => {
        console.log('API Response:', res); // Debug log
        this.loading = false;
        this.processVendorResponse(res);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load vendors. Please try again.';
        console.error('Error fetching vendors', error);
      },
    });
  }

  private processVendorResponse(response: any): void {
    try {
      this.vendorList = [];

      // Handle array response
      if (Array.isArray(response)) {
        // If the array contains objects with AcmSearchList
        if (response.length > 0 && response[0].AcmSearchList) {
          this.vendorList = response.flatMap((item) => item.AcmSearchList);
        }
        // If the array contains vendor objects directly
        else {
          this.vendorList = response;
        }
      }
      // Handle single vendor object
      else if (response && typeof response === 'object') {
        if (response.AcmSearchList) {
          this.vendorList = response.AcmSearchList;
        } else {
          this.vendorList = [response];
        }
      }

      console.log('Processed Vendor List:', this.vendorList); // Debug log

      if (this.vendorList.length === 0) {
        this.errorMessage = 'No vendor data available';
      }
    } catch (e) {
      this.errorMessage = 'Error processing vendor data';
      this.vendorList = [];
      console.error('Data processing error', e);
    }
  }

  selectVendor(vendor: Vendor) {
   /*  this.selectVenId = vendor.AcmId;
    console.log('Selected AcmId:', this.selectVenId);

    // Format current date as yyyy-MM-dd
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // "2025-06-18"

    // Set Vdate before calling API
    this.poService.poTdsDetails.Vdate = formattedDate;

    this.poService.TDSDetails(vendor.AcmId).subscribe({
      next: (response: TDSResponse) => {
        console.log('TDS Details:', response);
        this.acmName = response.ACM[0]?.ACMNAME;
        console.log('inside fun', this.acmName);
        this.poService.poTdsDetails = response;
      },
      error: (err) => {
        console.error('Error fetching TDS details:', err);
      },
    });

    this.poService.AcmContactSearchList(vendor.AcmId).subscribe({
      next: (res) => {
        console.log('acm-contact-data', res);
        this.getAcm();
      },
      error: (err) => {
        console.error('error fetching acm-contac-data', err);
      },
    });

    this.closePopup();
    this.vendor = vendor.AcmName;
    console.log('Selected Vendor:', this.vendor);
  }

  getAcm() {
    console.log('acm data', this.acmName);
    this.poService.GetAcmByName(this.acmName).subscribe({
      next: (res) => {
        //  console.log("acm-name",res)
      },
      error: (err) => {
        console.error('error fetching acm-name', err);
      },
    }); */
  }

  closePopup() {
    this.showVendorPopup = false;
    this.vendorList = [];
    this.errorMessage = null;
  }
  onSubmit(form: any): void {
    if (form.valid) {
      // console.log('Form Submitted', this.form, this.items);
    } else {
      console.log('Form is invalid');
    }
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

  addEmptyRow(): void {
    const newItem = {
      ItmCode: '',
      ItmName: '',
      ItmPackUntCode: '',
      ItmQty: 0,
      Itemprices: [
        {
          MRP: 0,
          Costprice: 0,
          Stock: 0,
        },
      ],
    };

    this.tempCheckoutItems.push(newItem);
    this.editingIndex = this.tempCheckoutItems.length - 1; // start editing new row
  }
  moreRecord(){
    if(this.poService.poVendor.MaxRecord===100)
    {
      this.poService.poVendor.MaxRecord=200;
      this.aboutRecord = 'End Records';

    }
    else {
      this.poService.poVendor.MaxRecord=100;
      this.aboutRecord = 'More Records';
    }
    this.dblClickVen();
  }
}

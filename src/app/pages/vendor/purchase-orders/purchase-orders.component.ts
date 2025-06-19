import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/* import { PoServiceFileService } from '../../services/po-service/po-service-file.service'; */
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VendorServiceFileService } from '../../../services/vendor-service/vendor-service-file.service';
import { SearchVendorModel } from '../../../Models/data-structure/vendor.model';
/* import { SearchVendorModel } from '../../Models/data-structure/po.form.model';
 */



interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

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
  selector: 'app-purchase-orders',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {


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
    discount: 0
  };

  items = [
    { itemName: '', account: '', quantity: 0, rate: 0, amount: 0 }
  ];
  categories = [
    {state:'All',value:'All'},
     {state:"Code",value:"AcmCode"},
      {state:"Name",value:"AcmName"},
      {state:"Pin code",value:"AcmPinCode"},
      {state:"GSTIN",value:"AcmGstin"},
      {state:"PAN",value:"AcmPan"}
     ];
  statuses = ['Contain', 'Start With', 'End With'];

  showVendorPopup = false;
  vendorList: Vendor[] = [];
  selectedVendor: Vendor | null = null;
  selectVenId:number | null=null;
  
  loading = false;
  errorMessage: string | null = null;
  searchTerm = '';
   filteredVendors: Vendor[] = [];
   selectedCategory = 'Contain';
   selectedStatus = "All";
   searchText: string = '';
   acmName:string="";
private searchTextChanged = new Subject<string>();
    

 constructor(public poService:VendorServiceFileService) {
  this.searchTextChanged.pipe(
    debounceTime(500) // wait 500ms after last keystroke
  ).subscribe(value => {
    this.searchcat(value); // call your function here
  });

 }

 onSearchChange(value: string) {
  this.searchTextChanged.next(value);
}

 searchcat(value:string){
  this.poService.poVendor.Search= value;
  this.dblClickVen()
 }

 filterVendors(data:any){
 console.log(data)
 this.poService.poVendor.SearchType=data;
 this.dblClickVen();
 }
filterType(data: any) {
 
  this.poService.poVendor.SearchColumn=data; 
  this.dblClickVen()
  // this.selectedStatus = data; // not needed, already bound by ngModel
  
}
resetFilters(){
  this.poService.poVendor = new SearchVendorModel();
  this.dblClickVen();

}

  addItem(): void {
    this.items.push({ itemName: '', account: '', quantity: 0, rate: 0, amount: 0 });
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
          type: file.type
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

  PoaddForm(){
    console.log(this.poService.poForm);
   this.poService.postPoForm(this.poService.poForm).subscribe({
    next:(res:any)=>{
      console.log(res,"data")
    }
   })
  }

  getItemclick(){
    console.log("hii")
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
        console.error("Error fetching vendors", error);
      }
    });
  }

private processVendorResponse(response: any): void {
    try {
      this.vendorList = [];
      
      // Handle array response
      if (Array.isArray(response)) {
        // If the array contains objects with AcmSearchList
        if (response.length > 0 && response[0].AcmSearchList) {
          this.vendorList = response.flatMap(item => item.AcmSearchList);
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
  this.selectVenId = vendor.AcmId;
  console.log("Selected AcmId:", this.selectVenId);

  // Format current date as yyyy-MM-dd
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // "2025-06-18"

  // Set Vdate before calling API
  this.poService.poTdsDetails.Vdate = formattedDate;

  this.poService.TDSDetails(vendor.AcmId).subscribe({
    next: (response:TDSResponse) => {
      console.log("TDS Details:", response);
       this.acmName = response.ACM[0]?.ACMNAME;
      console.log("inside fun",this.acmName)
      this.poService.poTdsDetails = response;
      
    },
    error: (err) => {
      console.error("Error fetching TDS details:", err);
    }
  });

  this.poService.AcmContactSearchList(vendor.AcmId).subscribe({
    next:(res)=>{
      console.log("acm-contact-data",res)
      this.getAcm();

    },
    error:(err)=>{
      console.error("error fetching acm-contac-data",err)
    }
  })
  
  this.closePopup();
 
}

getAcm(){
   console.log("acm data",this.acmName)
  this.poService.GetAcmByName(this.acmName).subscribe({
    next:(res)=>{
     
  //  console.log("acm-name",res)
    },
    error:(err)=>{
      console.error("error fetching acm-name",err)


    }
  })
}


  closePopup() {
    this.showVendorPopup = false;
    this.vendorList = [];
    this.errorMessage = null;
  }

  
}

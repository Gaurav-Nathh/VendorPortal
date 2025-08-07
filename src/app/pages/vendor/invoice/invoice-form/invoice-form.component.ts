import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  InvoiceService,
  Branch,
} from '../../../../services/vendor-service/invoice/invoice.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DecimalLimitDirective } from '../../../../directives/decimal-limit.directive';
import { Pgrmain, Pgrdetail } from '../../../../Models/Invoice/invoice.model';

declare var bootstrap: any;

@Component({
  selector: 'app-invoice-form',
  imports: [NgFor, CommonModule, FormsModule, DecimalLimitDirective],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})
export class InvoiceFormComponent {
  branchList: Branch[] = [];
  selectedBranchId: string | null = null;
  generatedNumber: string = '';

  items: any[] = [];
  currentDate: string;
  mkey: string | null = null;
  isEditMode: boolean = false;
  defaultBranchId: number = 0;
  defaultBrn: string = '';

  createdBy: string = '';
  isDragOver: boolean = false;
  selectedFile: File | null = null;
  lastSelectedDocType: string = '';
  minDate: string = '';
  isLoading: boolean = false;

  lookupInputSubject: Subject<string> = new Subject<string>();
  poNumberInput$ = new Subject<string>();

  lookupQuery: string = '';
  lookupSuggestions: any[] = [];
  activeItemIndex: number = -1; // which row is being edited
  // formState: 'create' | 'submitted' = 'create';
  formState: 'create' | 'submitted' | 'edit' | 'cancel' = 'create';


  @ViewChild('itemLookupModal') itemLookupModal!: ElementRef;
  @ViewChild('excelImportModal') excelImportModal!: ElementRef;
  @ViewChild('invoiceForm') invoiceForm!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  invoiceModel: Pgrmain = {
    mKey: '',
    cmpId: 1,
    brnId: 0,
    vType: 'PGR',
    vNo: '',
    vNoSeq: 0,
    vNoPrefix: '',
    refNo: '',
    refDate: '',
    acmId: 0,
    netAmount: 0,
    remarks: '',
    statusCode: 1,
    addUser: '',
    addDate: '',
    modUser: '',
    modDate: '',
    for_BrnName: '',
    docNo: '',
    docType: 'manual',
    details: [],
  };

  private acmId = sessionStorage.getItem('UsrLinkAcmId') || '';

  constructor(
    private vendorInvoiceServie: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.currentDate = `${dd}/${mm}/${yyyy}`;

    this.poNumberInput$
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((poNumber: string) => {
        if (this.invoiceModel.docType === 'po' && poNumber.trim()) {
          this.loadPOData(poNumber.trim());
        }
      });
  }

  ngOnInit(): void {
    this.isLoading  = true;
    this.items = [this.createNewItem()];
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const acmId = 0;
    const type = 'MOBILEAPP';
    

    Promise.all([
    this.vendorInvoiceServie.getBranches(acmId, type).toPromise().then((res) => {
      this.branchList = res?.BranchList || [];
      if (!this.isEditMode) {
        const defaultBranch = this.branchList.find(
          (b) => b.Text.toUpperCase() === 'DELHI'
        );
        if (defaultBranch) {
          this.defaultBrn = defaultBranch.Text;
          this.invoiceModel.for_BrnName = defaultBranch.Text;
        }
      }
    }),
    this.initMkeyOrLoadInvoice(), 
  ])
    .finally(() => {
      this.isLoading = false; 
    });


    this.lookupInputSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.performLookupSearch(query);
      });
  }

  initMkeyOrLoadInvoice(): Promise<void> {
  this.mkey = this.vendorInvoiceServie.getMKey();
  this.isEditMode = !!this.mkey;

  if (this.isEditMode && this.mkey) {
    return this.loadInvoice(this.mkey); 
  } else {
    return this.generateNewVnoAndMKey(); 
  }
}


  async loadInvoice(mkey: string): Promise<void> {
    try {
      const res = await this.vendorInvoiceServie
        .getInvoiceByMKey(mkey)
        .toPromise();
      if (!res) {
        throw new Error('Invoice response is undefined');
      }
      this.invoiceModel = res;

      // Format date
      if (res.refDate) {
        const dateObj = new Date(res.refDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        this.invoiceModel.refDate = `${yyyy}-${mm}-${dd}`;
      }

      this.items = await Promise.all(
        res.details.map(async (d) => {
          let vendorItems: any[] = [];
          try {
            const result = await this.vendorInvoiceServie
              .searchVendorItems(d.itemCode, this.acmId)
              .toPromise();
            vendorItems = result ?? [];
          } catch {
            vendorItems = [];
          }

          const matched = vendorItems.find(
            (item: any) => item.vendorItemCode === d.itemCode
          );

          if (!matched) {
            alert(`Item "${d.itemCode}" is not mapped`);
            return this.createNewItem();
          }

          const itemDetails = await this.vendorInvoiceServie
            .getItemDetails(matched.itmId, this.acmId)
            .toPromise()
            .catch(() => null);

          return {
            rowNo: d.rowNo,
            itemId: d.itemId,
            myItemCode: d.itemCode,
            myItemName: matched.vendorItemName,
            itemCode: itemDetails?.itemCode || '',
            itemName: itemDetails?.itemName || '',
            barcode: d.barcode,
            mrp: d.mrp,
            qty: d.quantity,
            rate: d.rate,
            discount: d.discountAmount,
            gstAmount: d.gstAmount || 0,
            showDropdown: false,
            suggestions: [],
          };
        })
      );
    } catch (err) {
      console.error('Error loading invoice:', err);
      alert('Failed to load invoice');
      this.router.navigate(['/view-invoice']);
    }
  }



  addItem() {
    this.items.push(this.createNewItem());
  }

  

  private generateNewVnoAndMKey(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.vendorInvoiceServie.generateVno(this.invoiceModel.vType).subscribe({
      next: (data) => {
        this.generatedNumber = data.vNo;
        this.invoiceModel.vNo = data.vNo;
        this.invoiceModel.vNoSeq = data.vNoSeq;
        this.invoiceModel.vNoPrefix = data.vNoPrefix;
        this.invoiceModel.mKey = data.mKey;
        this.mkey = data.mKey;

        resolve(); 
      },
      error: (err) => {
        console.error('Error generating VNo', err);
        Swal.fire('Error', 'Failed to generate new invoice number', 'error');
        reject(err);
      }
    });
  });
}


  onCreatedByChange() {
    if (this.invoiceModel.docType === 'excel') {
      const modalEl = this.excelImportModal.nativeElement;
      new bootstrap.Modal(modalEl).show();
    }
  }

  onPoNoInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const poNo = input.value;
    this.poNumberInput$.next(poNo);
  }

  loadPOData(poNo: string) {
    const acmId = Number(this.acmId);

    this.vendorInvoiceServie.getPODetail(acmId, poNo).subscribe({
      next: async (res) => {
        console.log('PO API Response:', res);

        const poDetails = res?.model?.PoDetails;

        console.log('PODetail ', poDetails);

        if (!Array.isArray(poDetails)) {
          Swal.fire('No Data', 'No PO details found', 'warning');
          return;
        }

        const mappedItems = [];

        for (const d of poDetails) {
          if (!d.PodMyItmCode) {
            Swal.fire(
              'Mapping Missing',
              `Item name "${d.PodItmName}" is not mapped with My Item Code.`,
              'warning'
            );
            continue;
          }

          mappedItems.push({
            myItemCode: d.PodMyItmCode,
            myItemName: d.PodMyItmName,
            itemCode: d.PodItmCode,
            itemName: d.PodItmName,
            barcode: '',
            mrp: d.PodMrp || 0,
            qty: d.PodQty || 0,
            rate: d.PodRate || 0,
            discount: 0,
            gstAmount: 0,
            itemId: d.PodItmId,
          });
        }

        if (mappedItems.length === 0) {
          Swal.fire('Warning', 'No valid items found in PO', 'warning');
          this.items = [this.createNewItem()];
        } else {
          this.items = mappedItems;
        }
      },
      error: (err) => {
        console.error('Error fetching PO:', err);
        Swal.fire('Error', 'Failed to load PO details', 'error');
      },
    });
  }

  openItemLookupModal(index: number) {
    this.activeItemIndex = index;
    this.lookupQuery = '';
    this.lookupSuggestions = [];
    const modalEl = this.itemLookupModal.nativeElement;
    new bootstrap.Modal(modalEl).show();
  }

  closeItemLookupModal() {
    const modalEl = this.itemLookupModal.nativeElement;
    bootstrap.Modal.getInstance(modalEl)?.hide();
    this.lookupQuery = '';
    this.lookupSuggestions = [];
    this.activeItemIndex = -1;
  }

  onLookupInput(): void {
    this.lookupInputSubject.next(this.lookupQuery.trim());
    // console.log('onloohup');
  }

  performLookupSearch(query: string) {
    if (!query) {
      this.lookupSuggestions = [];
      return;
    }
    console.log('query perform', query);

    this.vendorInvoiceServie
      .searchVendorItems(query, this.acmId)
      .subscribe((res) => {
        this.lookupSuggestions = res;
      });
  }

  selectVendorItemFromModal(selected: any) {
    const index = this.activeItemIndex;
    if (index === -1) return;

    this.items[index].myItemCode = selected.vendorItemCode;
    this.items[index].myItemName = selected.vendorItemName;
    this.items[index].itemId = selected.itmId;

    this.vendorInvoiceServie
      .getItemDetails(selected.itmId, this.acmId)
      .subscribe((itemDetail) => {
        this.items[index].itemCode = itemDetail.itemCode;
        this.items[index].itemName = itemDetail.itemName;
      });

    this.closeItemLookupModal();
  }

  deleteItem(index: number): void {
    if (this.items.length === 1) {
      Swal.fire('Warning', 'At least one item must be present', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.items.splice(index, 1);
        Swal.fire('Deleted!', 'Item has been removed.', 'success');
      }
    });
  }

  closeExcelModal() {
    const modalEl = this.excelImportModal.nativeElement;
    bootstrap.Modal.getInstance(modalEl)?.hide();

    // Clear selected file and reset input
    this.resetExcelUpload();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  uploadExcel() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const processedItems: any[] = [];

      for (const row of rows) {
        const myItemCode = row['My Item Code']?.toString().trim();

        if (!myItemCode) continue;

        // Use existing searchVendorItems()
        let vendorItems: any[] = [];

        try {
          const res = await this.vendorInvoiceServie
            .searchVendorItems(myItemCode, this.acmId)
            .toPromise();
          vendorItems = res ?? [];
        } catch (error) {
          vendorItems = [];
        }

        const matched = vendorItems.find(
          (item: any) => item.vendorItemCode === myItemCode
        );

        if (!matched) {
          alert(`Item "${myItemCode}" is not mapped`);
          this.items = [this.createNewItem()];
          return;
        }

        // Now get item details using existing getItemDetails
        let itemDetails: any = null;
        try {
          itemDetails = await this.vendorInvoiceServie
            .getItemDetails(matched.itmId, this.acmId)
            .toPromise();
        } catch (error) {
          itemDetails = null;
        }

        if (!itemDetails) {
          alert(`Details for item "${myItemCode}" not found`);
          this.items = [this.createNewItem()];
          return;
        }

        processedItems.push({
          myItemCode: myItemCode,
          myItemName: matched.vendorItemName,
          itemId: matched.itmId,
          itemCode: itemDetails.itemCode,
          itemName: itemDetails.itemName,
          barcode: row['Barcode']?.toString().trim() || '',
          mrp: parseFloat(row['MRP']) || 0,
          qty: parseFloat(row['Qty']) || 0,
          rate: parseFloat(row['Rate']) || 0,
          discount: parseFloat(row['Discount Amt']) || 0,
          gstAmount: parseFloat(row['GST Amt']) || 0,
        });
      }

      this.items = processedItems;
      this.closeExcelModal();

      //reset selectedFile
      this.resetExcelUpload();
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  downloadSampleExcel() {
    const ws = XLSX.utils.aoa_to_sheet([
      [
        'My Item Code',
        'Barcode',
        'MRP',
        'Qty',
        'Rate',
        'Discount Amt',
        'GST Amt',
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SampleItems');
    XLSX.writeFile(wb, 'Sample_Invoice_Template.xlsx');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.selectedFile = file;
      // this.uploadExcel();
    } else {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
    }
  }

  resetFormAfterSubmit() {
    this.invoiceForm.resetForm({
      for_BrnId: this.defaultBranchId,
      docType: 'manual',
    });
    this.items = [this.createNewItem()];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.currentDate = `${dd}/${mm}/${yyyy}`;

    this.generateNewVnoAndMKey();

  }

  resetExcelUpload() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  resetInvoiceForm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel the form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No',
    }).then((res) => {
      if(res.isConfirmed) {
      this.isLoading = true;
      setTimeout(() => {
      if (this.isEditMode) {
        this.formState = 'submitted';
        this.isEditMode = false;
        this.isLoading = false;
        return;
      } else {
        

        this.vendorInvoiceServie.clearMKey();


        this.invoiceForm.resetForm();

        // this.invoiceForm.form.patchValue({
        //   for_BrnName: this.defaultBrn,
        //   docType: 'manual',
        // });

        this.resetInvoiceModel();

        this.items = [this.createNewItem()];
        this.selectedFile = null;
        this.resetExcelUpload();
        this.generatedNumber = '';
        this.createdBy = '';
        this.mkey = null;


        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        this.currentDate = `${dd}/${mm}/${yyyy}`;
        this.formState = 'cancel';
        this.isLoading = false;
        
      }
      this.isLoading =false;
      },300)}
    });
  }

  getTotalNetAmount(): number {
    return this.items.reduce((total, item) => {
      const qty = item.qty || 0;
      const rate = item.rate || 0;
      const discount = item.discount || 0;
      const gst = item.gstAmount || 0;
      const net = qty * rate - discount + gst;
      return total + net;
    }, 0);
  }

  startNewInvoice(): void {
    this.isLoading = true;
    setTimeout(() => {
    this.formState = 'create';
    this.isEditMode = false;
    this.createdBy = '';
    this.generatedNumber = '';
    this.mkey = null;

    // Reset invoice model first
    this.resetInvoiceModel();

   
    this.invoiceForm.resetForm();

       this.invoiceForm.form.patchValue({
          for_BrnName: this.defaultBrn,
          docType: 'manual',
        });
      

      this.invoiceForm.form.markAsPristine();
      this.invoiceForm.form.markAsUntouched();
      this.items = [this.createNewItem()];

   

    this.generateNewVnoAndMKey();
    this.isLoading = false;
    },300);
    console.log('invoiceModel after reset', this.invoiceModel);
  }

  goToList(): void {
    this.isEditMode = false;
    this.vendorInvoiceServie.clearMKey();
    this.router.navigate(['/vendor/invoice']);
  }

  enableEditMode(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.mkey = this.invoiceModel.mKey;
      this.formState = 'edit';
      this.isEditMode = true;
      this.isLoading = false;
    }, 250)
  }

  createNewItem() {
    return {
      myItemCode: '',
      myItemName: '',
      barcode: '',
      itemCode: '',
      itemName: '',
      mrp: 0,
      qty: 0,
      rate: 0,
      discount: 0,
      grossAmount: 0,
      net: 0,
      showDropdown: false,
      suggestions: [],
    };
  }

  private resetInvoiceModel(): void {
    Object.assign(this.invoiceModel, {
      mKey: '',
      cmpId: 1,
      brnId: 0,
      vType: 'PGR',
      refNo: '',
      refDate: '',
      acmId: 0,
      netAmount: 0,
      remarks: '',
      statusCode: 1,
      addUser: '',
      addDate: '',
      modUser: '',
      modDate: '',
      for_BrnName: this.defaultBrn,
      docNo: '',
      docType: 'manual',
      details: [],
    });
  }


  submitInvoice() {
    this.isLoading = true;

    this.invoiceForm.onSubmit(new Event('submit'));

    if (!this.invoiceForm.valid) {
      Object.values(this.invoiceForm.controls).forEach((control) => {
        control.markAsTouched();
      });

      // Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
      return;
    }

    const hasInvalidItem = this.items.some(
      (item) =>
        !item.myItemCode ||
        item.mrp == null ||
        item.mrp <= 0 ||
        item.qty == null ||
        item.qty <= 0 ||
        item.rate == null ||
        item.rate < 0
    );

    if (hasInvalidItem) {
      return;
    }

    const now = new Date().toISOString();

    // Set from session
    const cmpId = Number(sessionStorage.getItem('UsrCtrlCmpId') || '0');
    const brnId = Number(sessionStorage.getItem('UsrBrnId') || '0');
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId') || '0');
    const user = sessionStorage.getItem('UsrAddUser') || '';

    const details: Pgrdetail[] = this.items.map((item, index) => {
      const gross = item.qty * item.rate;
      const discount = item.discount || 0;
      const gst = item.gstAmount || 0;
      const net = gross - discount + gst;

      return {
        rowNo: item.rowNo || index + 1,
        itemId: item.itemId || 0,
        mrp: item.mrp,
        rate: item.rate || 0,
        quantity: item.qty,
        grossAmount: gross,
        discountAmount: discount,
        gstAmount: gst,
        barcode: item.barcode || '',
        itemCode: item.myItemCode || '',
        itemName: item.myItemName || '',
        net: net,
      };
    });

    // Final invoice model
    this.invoiceModel.cmpId = cmpId;
    this.invoiceModel.brnId = brnId;
    this.invoiceModel.acmId = acmId;
    this.invoiceModel.addUser = user;
    this.invoiceModel.modUser = '';
    this.invoiceModel.addDate = now;
    this.invoiceModel.modDate = now;
    this.invoiceModel.statusCode = 1;
    this.invoiceModel.details = details;

    if (this.invoiceModel.refDate && this.invoiceModel.refDate.includes('/')) {
      const [dd, mm, yyyy] = this.invoiceModel.refDate.split('/');
      this.invoiceModel.refDate = `${yyyy}-${mm}-${dd}`; // Convert to ISO format
    }

    // Net amount
    this.invoiceModel.netAmount = details.reduce(
      (sum, d) =>
        sum + (d.grossAmount - (d.discountAmount || 0) + (d.gstAmount || 0)),
      0
    );

    console.log('model', this.invoiceModel);

    if (this.isEditMode && this.mkey) {
      this.invoiceModel.mKey = this.mkey;

      this.vendorInvoiceServie.updateInvoice(this.invoiceModel).subscribe({
        next: (res) => {
          Swal.fire('Updated!', 'Invoice updated successfully!', 'success');
          this.formState = 'submitted';
          this.isEditMode = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          Swal.fire('Error!', 'Failed to update invoice', 'error');
        },
      });
    } else {
      this.vendorInvoiceServie.createInvoice(this.invoiceModel).subscribe({
        next: (res) => {
          this.vendorInvoiceServie.clearMKey();
          Swal.fire('Success!', 'Invoice created successfully!', 'success');
          this.formState = 'submitted';
          this.isEditMode = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          Swal.fire('Error!', 'Failed to create invoice', 'error');
        },
      });
    }
  }
}

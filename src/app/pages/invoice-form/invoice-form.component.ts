import { Component } from '@angular/core';
import {
  InvoiceService,
  Branch,
} from '../../services/vendor-service/invoice/invoice.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-invoice-form',
  imports: [NgFor],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})
export class InvoiceFormComponent {
  branchList: Branch[] = [];
  selectedBranchId: string | null = null;
  constructor(private vendorInvoiceServie: InvoiceService) {}

  ngOnInit(): void {
    const acmId = 0;
    const type = 'MOBILEAPP';
    this.vendorInvoiceServie.getBranches(acmId, type).subscribe((res) => {
      this.branchList = res.BranchList;
    });
  }

  onBranchSelect(event: Event) {
    this.selectedBranchId = (event.target as HTMLSelectElement).value;
    console.log(this.selectedBranchId);
  }
}

import { Component, OnInit } from '@angular/core';
import { MyOrdersService } from '../../../services/customer-service/my-orders/my-orders.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesOrder } from '../../../Models/interface/SalesOrder.interface';
import { SaleOrderDetail } from '../../../Models/interface/SaleOrderDetail.interface';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  soList: SalesOrder[] = [];
  fetchedDetails = new Map<number, SaleOrderDetail[]>();
  openIndexes = new Set<number>();

  constructor(private myOrdersService: MyOrdersService) {}

  ngOnInit(): void {
    this.getPortalSOList();
  }

  getPortalSOList() {
    const amcId: number = Number(sessionStorage.getItem('UsrLinkAcmId'));
    this.myOrdersService.getPortalSOList(amcId).subscribe({
      next: (response) => {
        this.soList = response.SOList;
      },
      error: (err) => {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error getting records.',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
    });
  }

  toggleDetails(index: number): void {
    if (this.openIndexes.has(index)) {
      this.openIndexes.delete(index);
    } else {
      const row = this.soList[index];
      if (!this.fetchedDetails.has(index)) {
        this.myOrdersService.getPortalSODetail(row.SomAcmId, row.SomMkey).subscribe({
          next: (response) => {
            this.fetchedDetails.set(
              index,
              response?.PortalItemDetailListSO ?? []
            );
          },
          error: (err) => {
            console.error('Error fetching details', err);
          },
        });
      }
      this.openIndexes.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }
}

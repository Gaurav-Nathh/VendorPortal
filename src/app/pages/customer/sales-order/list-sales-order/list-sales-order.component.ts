import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingCartService } from '../../../../services/shoppingCart-service/shopping-cart.service';
import { SalesOrderService } from '../../../../services/customer-service/sales-order/sales-order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-sales-order',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-sales-order.component.html',
  styleUrl: './list-sales-order.component.scss',
})
export class ListSalesOrderComponent implements OnInit {
  viewOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'Billed', value: 'billed' },
    { label: 'Open', value: 'open' },
  ];

  currentView = 'all';
  orders: any[] = [];
  filteredOrders: any[] = [];
  editableItems: any[] = [];
  openCollapseIndex: number | null = null;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private salesOrderService: SalesOrderService
  ) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  toggleDetails(index: number): void {
    this.openCollapseIndex = this.openCollapseIndex === index ? null : index;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  createSO() {
    this.shoppingCartService.disableEditing();
    this.router.navigate(['/customer/shopping-cart']);
  }

  editSO(so: any) {
    // const itemsCode = so.psoItems.map((item: any) => ({
    //   code: item.itmCode,
    //   brnId: Number(sessionStorage.getItem('UsrBrnId')),
    // }));

    // this.salesOrderService.getItemsDetail(itemsCode).subscribe({
    //   next: (response) => {
    //     this.editableItems = response;
    //     this.editableItems.forEach((item: any) => {
    //       const matched = so.psoItems.find(
    //         (itm: any) => itm.itmId === item.itemdetail.ItmId
    //       );
    //       if (matched) {
    //         item.itemdetail.ItmQty = matched.qty;
    //       }
    //     });
    //     this.salesOrderService.setEditableItemIds(this.editableItems);

    // this.shoppingCart.enableEditing();
    // this.router.navigate(['/customer/shopping-cart']);
    //   },
    // });
    this.shoppingCartService.enableEditing();
    this.salesOrderService.setEditableItemIds(so);
    this.router.navigate(['/customer/shopping-cart']);
  }

  deleteSO(so: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this sales order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesOrderService.deleteSalesOrder(so.mkey).subscribe({
          next: (res) => {
            this.getOrderList();
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Deleted',
              // text: 'Please add items to the cart before proceeding.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          },
          error: (err) => {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: 'Error deleting the order.',
              // text: 'Please add items to the cart before proceeding.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          },
        });
      }
    });
  }

  getTotalQty(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }

  getTotalRate(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.rate || 0), 0);
  }

  getTotalAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + Number(item.netamount || 0), 0);
  }

  getOrderList() {
    const acmId = Number(sessionStorage.getItem('UsrLinkAcmId'));
    this.salesOrderService.getOrderList(acmId).subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {},
    });
  }

  updateView(view: string): void {
    // this.currentView = view;
    // this.filteredOrders = this.orders.filter((po) =>
    //   view === 'all' ? true : po.status.toLowerCase() === view
    // );
  }
}

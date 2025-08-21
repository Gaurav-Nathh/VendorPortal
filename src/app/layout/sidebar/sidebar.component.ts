import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared/shared.service';
import { filter } from 'rxjs/operators';
import { ShoppingCartService } from '../../services/shoppingCart-service/shopping-cart.service';
import { SalesOrderService } from '../../services/customer-service/sales-order/sales-order.service';
import { UserService } from '../../services/shared/user-service/user.service';
interface MenuItem {
  text: string;
  icon: string;
  route?: string;
  isSubmenuOpen?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  currentMenu: MenuItem[] = [];
  sidebarShrinkStyle: boolean = true;
  sidebarVisibility: boolean = true;
  commonMenu: { text: string; icon: string; route: string }[] = [];
  constructor(
    private router: Router,
    private sidebarService: SharedService,
    private authService: AuthService,
    private userService: UserService,
    private sharedService: SharedService,
    private shoppingCartService: ShoppingCartService,
    private salesOrderService: SalesOrderService
  ) {}

  isOpen = false;
  userType!: string;

  ngOnInit() {
    this.userType = (this.userService._user?.UsrType ?? '').toLowerCase();
    this.buildMenu();
    this.currentMenu =
      this.userType === 'vendor' ? this.vendorMenu : this.customerMenu;
    this.sidebarService.sidebarStyle$.subscribe((style) => {
      this.sidebarShrinkStyle = style === 'overlay' ? true : false;
    });

    this.sidebarService.sidebarVisible$.subscribe((visible) => {
      this.sidebarVisibility = visible;
    });
  }

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  toggleSubmenu(item: MenuItem, event: Event) {
    this.handleCartMode(item.text);
    if (item.submenu) {
      item.isSubmenuOpen = !item.isSubmenuOpen;
      event.preventDefault();
    }
  }

  handleCartMode(text: string): void {
    this.shoppingCartService.disableEditing();
    this.salesOrderService.clearEditableItem();
    if (text.toLowerCase().includes('order by catalouge')) {
      this.sharedService.setCartMode('catalouge');
    } else if (text.toLowerCase().includes('order by items')) {
      this.sharedService.setCartMode('items');
    }
  }

  logout() {
    this.authService.logout();
  }

  vendorMenu: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'bi bi-grid-1x2-fill',
      route: '/',
    },

    {
      text: 'Item Mapping',
      icon: 'fa fa-box sidebar-icon',
      route: '/item-mapping',
    },

    {
      text: 'Purchase Orders',
      icon: 'fa-solid fa-rectangle-list',
      route: '/purchase-orders',
    },
    {
      text: 'Invoice',
      icon: 'fa-solid fa-file-lines',
      route: '/invoices',
    },
    {
      text: 'Goods Receipts',
      icon: 'fa-solid fa-receipt',
      route: '/page-under-construction',
    },
    {
      text: 'Payment',
      icon: 'bi bi-credit-card-2-back-fill',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Pending Payment',
          icon: 'fa-solid fa-hourglass-half',
          route: '/payment-pending',
        },
        {
          text: 'Account Statement',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/payment-history',
        },
      ],
    },
    {
      text: 'Statements',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/page-under-construction',
    },
  ];

  customerMenu: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'bi bi-grid-1x2-fill',
      route: '/',
    },
    {
      text: 'Orders',
      icon: 'bi bi-file-earmark-check-fill',
      route: '/all-orders',
    },
    // {
    //   text: 'Create Order',
    //   icon: 'fa-solid fa-cart-shopping',
    //   isSubmenuOpen: false,
    //   submenu: [
    //     {
    //       text: 'Items',
    //       icon: 'fa-solid fa-cubes',
    //       route: '/customer/items/create-order',
    //     },
    //     {
    //       text: 'Catalogue',
    //       icon: 'fa-solid fa-box',
    //       route: '/customer/catalouge/create-order',
    //     },
    //   ],
    // },
    {
      text: 'Order by Items',
      icon: 'fa-solid fa-cubes',
      route: '/items/create-order',
    },
    {
      text: 'Order by Catalouge',
      icon: 'fa-solid fa-box',
      route: '/catalouge/create-order',
    },
    {
      text: 'My Orders',
      icon: 'bi bi-file-earmark-check-fill',
      route: '/my-orders',
    },
    {
      text: 'Invoice',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/invoice',
    },
    {
      text: 'Payment',
      icon: 'bi bi-credit-card-2-back-fill',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Pending Payment',
          icon: 'fa-solid fa-hourglass-half',
          route: '/payment-pending',
        },
        {
          text: 'Account Statement',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/payment-history',
        },
      ],
    },
    {
      text: 'Statements',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/page-under-construction',
    },
  ];

  private buildMenu() {
    this.commonMenu = [
      {
        text: 'My Profile',
        icon: 'fa-solid fa-circle-user',
        route: '/profile',
      },
      {
        text: 'Password',
        icon: 'fa-solid fa-lock',
        route: '/update-password',
      },
    ];
  }
}

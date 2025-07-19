import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared/shared.service';
import { filter } from 'rxjs/operators';
import { ShoppingCartService } from '../../services/shoppingCart-service/shopping-cart.service';
import { SalesOrderService } from '../../services/customer-service/sales-order/sales-order.service';
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
    this.userType = this.userService.getUserType().toLowerCase();
    this.buildMenu();
    this.currentMenu =
      this.userType === 'vendor' ? this.vendorMenu : this.customerMenu;
    this.sidebarService.sidebarStyle$.subscribe((style) => {
      this.sidebarShrinkStyle = style === 'overlay' ? true : false;
    });

    this.sidebarService.sidebarVisible$.subscribe((visible) => {
      this.sidebarVisibility = visible;
    });

    // Open submenu when page is reloded
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;

        this.currentMenu.forEach((menuItem) => {
          if (menuItem.submenu) {
            menuItem.isSubmenuOpen = menuItem.submenu.some(
              (sub) => sub.route && currentRoute.startsWith(sub.route)
            );

            menuItem.submenu.forEach((sub) => {
              if (sub.submenu) {
                sub.isSubmenuOpen = sub.submenu.some(
                  (s) => s.route && currentRoute.startsWith(s.route)
                );
              }
            });
          }
        });
      });
  }

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  toggleSubmenu(item: MenuItem, event: Event) {
    if (item.submenu) {
      item.isSubmenuOpen = !item.isSubmenuOpen;
      event.preventDefault();
    }
  }

  handleCartMode(text: string): void {
    this.shoppingCartService.disableEditing();
    this.salesOrderService.clearEditableItem();
    if (text.toLowerCase().includes('catalogue')) {
      this.sharedService.setCartMode('catalouge');
    } else if (text.toLowerCase().includes('item')) {
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
      route: '/vendor/',
    },

    {
      text: 'Item Mapping',
      icon: 'fa fa-box sidebar-icon',
      route: '/vendor/item-mapping',
    },

    {
      text: 'Purchase Orders',
      icon: 'fa-solid fa-rectangle-list',
      route: '/vendor/purchase-orders',
    },
    {
      text: 'Invoice',
      icon: 'fa-solid fa-file-lines',
      route: '/vendor/invoice',
    },
    {
      text: 'Goods Receipts',
      icon: 'fa-solid fa-receipt',
      route: '/vendor/page-under-construction',
    },
    {
      text: 'Payment',
      icon: 'bi bi-credit-card-2-back-fill',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Pending Payment',
          icon: 'fa-solid fa-hourglass-half',
          route: '/vendor/payment-pending',
        },
        {
          text: 'Account Statement',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/vendor/payment-history',
        },
      ],
    },
    {
      text: 'Statements',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/vendor/page-under-construction',
    },
  ];

  customerMenu: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'bi bi-grid-1x2-fill',
      route: '/customer/',
    },
    {
      text: 'Orders',
      icon: 'bi bi-file-earmark-check-fill',
      route: '/customer/all-orders',
    },
    {
      text: 'Create Order',
      icon: 'fa-solid fa-cart-shopping',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Items',
          icon: 'fa-solid fa-cubes',
          route: '/customer/items/create-order',
        },
        {
          text: 'Catalogue',
          icon: 'fa-solid fa-box',
          route: '/customer/catalouge/create-order',
        },
      ],
    },
    {
      text: 'My Orders',
      icon: 'bi bi-file-earmark-check-fill',
      route: '/customer/my-orders',
    },
    {
      text: 'Invoice',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/customer/invoice',
    },
    {
      text: 'Payment',
      icon: 'bi bi-credit-card-2-back-fill',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Pending Payment',
          icon: 'fa-solid fa-hourglass-half',
          route: '/customer/payment-pending',
        },
        {
          text: 'Account Statement',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/customer/payment-history',
        },
      ],
    },
    {
      text: 'Statements',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/vendor/page-under-construction',
    },
  ];

  private buildMenu() {
    this.commonMenu = [
      {
        text: 'My Profile',
        icon: 'fa-solid fa-circle-user',
        route: `/${this.userType}/update-profile`,
      },
      {
        text: 'Password',
        icon: 'fa-solid fa-lock',
        route: `/${this.userType}/update-password`,
      },
    ];
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared/shared.service';
interface MenuItem {
  text: string;
  icon: string;
  route?: string;
  isSubmenuOpen?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NgbTooltipModule],
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
    private userService: UserService
  ) {}

  isOpen = false;
  userType!: string;

  ngOnInit() {
    this.userType = this.userService.getUserType().toLowerCase();
    this.buildMenu();
    this.currentMenu =
      this.userType === 'vendor' ? this.vendorMenu : this.customerMenu;
    switch (this.userType) {
      case 'customer':
        this.currentMenu = this.customerMenu;
        break;
      case 'vendor':
        this.currentMenu = this.vendorMenu;
        break;
      case 'system':
        this.currentMenu = this.masterMenu;
        break;
    }

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
    if (item.submenu) {
      item.isSubmenuOpen = !item.isSubmenuOpen;
      event.preventDefault();
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
          text: 'Pending',
          icon: 'fa-solid fa-hourglass-half',
          route: '/vendor/page-under-construction',
        },
        {
          text: 'History',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/vendor/page-under-construction',
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
      text: 'Sales Order',
      icon: 'fa-solid fa-cart-shopping',
      route: '/customer/sales-order',
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
          text: 'Pending',
          icon: 'fa-solid fa-hourglass-half',
          route: '/vendor/page-under-construction',
        },
        {
          text: 'History',
          icon: 'fa-solid fa-clock-rotate-left',
          route: '/vendor/page-under-construction',
        },
      ],
    },
    {
      text: 'Statements',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/vendor/page-under-construction',
    },
  ];

  masterMenu: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'bi bi-grid-1x2-fill',
      route: '/master/',
    },
    {
      text: 'Sales',
      icon: 'fa-solid fa-cart-shopping',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Customers',
          icon: 'fa-solid fa-users',
          route: '/master/sales/customers',
        },
        {
          text: 'Sales Orders',
          icon: 'bi bi-file-text-fill',
          route: '/master/sales/sales-order',
        },
        {
          text: 'Invoices',
          icon: 'bi bi-file-text-fill',
          route: '/master/users/vendors',
        },
      ],
    },
    {
      text: 'Purchases',
      icon: 'fa-solid fa-bag-shopping',
      isSubmenuOpen: false,
      submenu: [
        {
          text: 'Vendors',
          icon: 'fa-solid fa-users',
          route: '/master/purchase/vendors',
        },
        {
          text: 'Purchase Orders',
          icon: 'bi bi-file-text-fill',
          route: '/master/purchase/purchase-order',
        },
      ],
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

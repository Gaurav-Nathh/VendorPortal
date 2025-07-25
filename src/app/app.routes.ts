import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/common/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },
  {
    path: 'vendor',
    loadComponent: () =>
      import('./pages/user/user.component').then((c) => c.UserComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/common/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'item-mapping',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/vendor/item-mapping/item-mapping.component').then(
            (c) => c.ItemMappingComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'purchase-orders',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/vendor/purchase-orders/purchase-orders.component'
          ).then((c) => c.PurchaseOrdersComponent),
        canActivate: [authGuard],
      },
      {
        path: 'invoice',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/vendor/invoice/view-invoice/view-invoice.component'
          ).then((c) => c.ViewInvoiceComponent),
        canActivate: [authGuard],
      },
      {
        path: 'invoice-form',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/vendor/invoice/invoice-form/invoice-form.component'
          ).then((c) => c.InvoiceFormComponent),
        canActivate: [authGuard],
      },
      {
        path: 'update-password',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/update-password/update-password.component').then(
            (c) => c.UpdatePasswordComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-profile',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/update-profile/update-profile.component').then(
            (c) => c.UpdateProfileComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'page-under-construction',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/vendor/goods-receipts/goods-receipts.component').then(
            (c) => c.GoodsReceiptsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'payment-pending',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/shared/payment/payment-pending/payment-pending.component'
          ).then((c) => c.PaymentPendingComponent),
        canActivate: [authGuard],
      },
      {
        path: 'payment-history',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/shared/payment/payment-history/payment-history.component'
          ).then((c) => c.PaymentHistoryComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'customer',
    loadComponent: () =>
      import('./pages/user/user.component').then((c) => c.UserComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/common/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-profile',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/update-profile/update-profile.component').then(
            (c) => c.UpdateProfileComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-password',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/update-password/update-password.component').then(
            (c) => c.UpdatePasswordComponent
          ),
        canActivate: [authGuard],
      },

      {
        path: 'all-orders',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/customer/sales-order/list-sales-order/list-sales-order.component'
          ).then((c) => c.ListSalesOrderComponent),
        canActivate: [authGuard],
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart.component').then(
            (c) => c.ShoppingCartComponent
          ),
        canActivate: [authGuard],
        children: [
          {
            path: 'create-order',
            loadComponent: () =>
              import('./pages/shopping-cart/shopping-cart.component').then(
                (c) => c.ShoppingCartComponent
              ),
            canActivate: [authGuard],
          },
        ],
      },
      {
        path: 'catalouge',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart.component').then(
            (c) => c.ShoppingCartComponent
          ),
        canActivate: [authGuard],
        children: [
          {
            path: 'create-order',
            loadComponent: () =>
              import('./pages/shopping-cart/shopping-cart.component').then(
                (c) => c.ShoppingCartComponent
              ),
            canActivate: [authGuard],
          },
        ],
      },
      {
        path: 'catalouge',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart.component').then(
            (c) => c.ShoppingCartComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'my-orders',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/customer/my-orders/my-orders.component').then(
            (c) => c.MyOrdersComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'invoice',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/customer/sales-invoice/sales-invoice.component').then(
            (c) => c.SalesInvoiceComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'payment-pending',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/shared/payment/payment-pending/payment-pending.component'
          ).then((c) => c.PaymentPendingComponent),
        canActivate: [authGuard],
      },
      {
        path: 'payment-history',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/shared/payment/payment-history/payment-history.component'
          ).then((c) => c.PaymentHistoryComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/no-page-exist/no-page-exist.component').then(
        (c) => c.NoPageExistComponent
      ),
  },
];

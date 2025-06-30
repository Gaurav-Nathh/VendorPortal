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
      import('./pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
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
          import(
            './pages/vendor/dashboard-vendor/dashboard-vendor.component'
          ).then((c) => c.DashboardVendorComponent),
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
          import('./pages/under-work/under-work.component').then(
            (c) => c.UnderWorkComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-password',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/update-password/update-password.component').then(
            (c) => c.UpdatePasswordComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-profile',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/update-profile/update-profile.component').then(
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
          import(
            './pages/customer/dashboard-customer/dashboard-customer.component'
          ).then((c) => c.DashboardCustomerComponent),
        canActivate: [authGuard],
      },
      {
        path: 'update-profile',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/update-profile/update-profile.component').then(
            (c) => c.UpdateProfileComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'update-password',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/update-password/update-password.component').then(
            (c) => c.UpdatePasswordComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'shopping-cart',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart.component').then(
            (c) => c.ShoppingCartComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'purchase-order',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import(
                './pages/customer/purchase-order/list-purchase-order/list-purchase-order.component'
              ).then((c) => c.ListPurchaseOrderComponent),
            canActivate: [authGuard],
          },
          {
            path: 'create',
            pathMatch: 'full',
            loadComponent: () =>
              import(
                './pages/customer/purchase-order/form-purchase-order/form-purchase-order.component'
              ).then((c) => c.FormPurchaseOrderComponent),
            canActivate: [authGuard],
          },
        ],
      },
      {
        path: 'page-under-construction',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/under-work/under-work.component').then(
            (c) => c.UnderWorkComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'master',
    loadComponent: () =>
      import('./pages/user/user.component').then((c) => c.UserComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './pages/master/dashboard-master/dashboard-master.component'
          ).then((c) => c.DashboardMasterComponent),
        canActivate: [authGuard],
      },
      {
        path: 'sales',
        children: [
          {
            path: 'customers',
            canActivate: [authGuard],
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/sales/customers/dashbard-customer/dashbard-customer.component'
                  ).then((c) => c.DashbardCustomerComponent),
                canActivate: [authGuard],
              },
              {
                path: 'create',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/sales/customers/create-customer/create-customer.component'
                  ).then((c) => c.CreateCustomerComponent),
              },
            ],
          },
          {
            path: 'sales-order',
            canActivate: [authGuard],
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/sales/sales-order/dashboard-sales-order/dashboard-sales-order.component'
                  ).then((c) => c.DashboardSalesOrderComponent),
              },
              {
                path: 'create',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/sales/sales-order/form-sales-order/form-sales-order.component'
                  ).then((c) => c.FormSalesOrderComponent),
              },
            ],
          },
          // {
          //   path: 'vendors',
          //   children: [
          //     {
          //       path: '',
          //       pathMatch: 'full',
          //       loadComponent: () =>
          //         import(
          //           './pages/vendor-dashboard/vendor-dashboard.component'
          //         ).then((c) => c.VendorDashboardComponent),
          //       canActivate: [authGuard],
          //     },
          //     {
          //       path: 'create',
          //       pathMatch: 'full',
          //       loadComponent: () =>
          //         import(
          //           './components/create-vendor-form/create-vendor-form.component'
          //         ).then((c) => c.CreateVendorFormComponent),
          //       canActivate: [authGuard],
          //     },
          //   ],
          // },
        ],
      },
      {
        path: 'purchase',
        children: [
          {
            path: 'vendors',
            canActivate: [authGuard],
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/purchase/vendors/dashboard-vendors/dashboard-vendors.component'
                  ).then((c) => c.DashboardVendorsComponent),
              },
              {
                path: 'create',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/purchase/vendors/create-vendors/create-vendors.component'
                  ).then((c) => c.CreateVendorsComponent),
              },
            ],
          },
          {
            path: 'purchase-order',
            canActivate: [authGuard],
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/purchase/purchase-order/dashboard-purchase-order/dashboard-purchase-order.component'
                  ).then((c) => c.DashboardPurchaseOrderComponent),
              },
              // {
              //   path: 'create',
              //   pathMatch: 'full',
              //   loadComponent: () =>
              //     import(
              //       './pages/master/purchase/purchase-order/create-purchase-order/create-purchase-order.component'
              //     ).then((c) => c.CreatePurchaseOrderComponent),
              // },
              {
                path: 'create',
                pathMatch: 'full',
                loadComponent: () =>
                  import(
                    './pages/master/purchase/purchase-order/form-purchase-order/form-purchase-order.component'
                  ).then((c) => c.FormPurchaseOrderComponent),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/no-page-exist/no-page-exist.component').then(
        (c) => c.NoPageExistComponent
      ),
  },
];

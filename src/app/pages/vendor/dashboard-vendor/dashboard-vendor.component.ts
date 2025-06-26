import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-vendor',
  imports: [],
  templateUrl: './dashboard-vendor.component.html',
  styleUrl: './dashboard-vendor.component.scss'
})
export class DashboardVendorComponent {

    pendingPayment = 9999.99;
  lastPaymentAmount = 99999.99;
  lastPaymentDate = '12th June 2025';

  recentPurchases = [
    { date: '10-Jun-2025', invoiceNo: 'INV1001', amount: 5000 },
    { date: '05-Jun-2025', invoiceNo: 'INV1000', amount: 3000 },
    { date: '28-May-2025', invoiceNo: 'INV0999', amount: 4200 },
    { date: '18-May-2025', invoiceNo: 'INV0998', amount: 3800 },
    { date: '10-May-2025', invoiceNo: 'INV0997', amount: 6100 }
  ];

  profile = {
    name: 'Ayush Panwar',
    gstin: '29ABCDE1234F2Z5',
    phone: '+91-9876543210',
    email: 'ayush@example.com',
    billingAddress: '123 Main Road, Delhi, India',
    shippingAddress: 'Warehouse 21, Sector 45, Noida, UP',
    bank: {
      accountNo: '123456789012',
      name: 'HDFC Bank',
      ifsc: 'HDFC0001234'
    }
  };

}

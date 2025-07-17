import { Component, ViewChild, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { DashboardServiceService } from '../../../services/shared/dashboard-service/dashboard-service.service';

@Component({
  selector: 'app-dashboard-vendor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-vendor.component.html',
  styleUrls: ['./dashboard-vendor.component.scss'],
})
export class DashboardVendorComponent {
  @ViewChild('salesChart') salesChartRef: any;

  currentDate = new Date();

  recentSales = [
    {
      date: new Date('2025-06-20'),
      invoiceNo: 'INV-2025-0620',
      amount: 12500.0,
      status: 'Paid',
    },
    {
      date: new Date('2025-06-15'),
      invoiceNo: 'INV-2025-0615',
      amount: 8500.5,
      status: 'Paid',
    },
    {
      date: new Date('2025-06-10'),
      invoiceNo: 'INV-2025-0610',
      amount: 15000.0,
      status: 'Pending',
    },
    {
      date: new Date('2025-06-05'),
      invoiceNo: 'INV-2025-0605',
      amount: 7500.75,
      status: 'Paid',
    },
    {
      date: new Date('2025-05-28'),
      invoiceNo: 'INV-2025-0528',
      amount: 22000.0,
      status: 'Overdue',
    },
  ];

  constructor(public dashService: DashboardServiceService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initialization logic
    this.getDetails();
    this.getDetailOtSnd();
  }

  ngAfterViewInit(): void {
    this.initSalesChart();
  }

  pendAmt!: number;

  initSalesChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales Value',
            data: [120000, 190000, 150000, 180000, 220000, 195000],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'Number of Invoices',
            data: [12, 19, 15, 18, 22, 19],
            backgroundColor: '#93c5fd',
            borderRadius: 6,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 0) {
                  label += '₹' + context.parsed.y.toLocaleString();
                } else {
                  label += context.parsed.y;
                }
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Sales Value (₹)',
            },
            ticks: {
              callback: function (value) {
                return '₹' + value.toLocaleString();
              },
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Number of Invoices',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  getDetails() {
    this.dashService.getDshbrd().subscribe({
      next: (data: any) => {
        console.log(data);
        this.fillDetails(data.Acm);
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        // Optionally show user-friendly error or alert
        alert('Something went wrong while fetching data. Please try again.');
      },
    });
  }

  getDetailOtSnd() {
    this.dashService.getDashbrdOtsnd().subscribe({
      next: (data: any) => {
        console.log(data);
        this.pendAmt = data.OUTSTANDINGAMT;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      },
    });
  }

  fillDetails(data: any) {
    this.dashService.userDetails.Name = data.AcmName;
    this.dashService.userDetails.email = data.AcmEmail;
    this.dashService.userDetails.gstin = data.AcmGstin;
    this.dashService.userDetails.phone = data.AcmMobileNo;
    this.dashService.userDetails.bank = data.AcmBanks;
    this.dashService.userDetails.AcmAddress1 = data.AcmAddress1;
    this.dashService.userDetails.AcmAddress2 = data.AcmAddress2;
    this.dashService.userDetails.AclLocation = data.AcmLocations[0].AclLocation;
    this.dashService.userDetails.AclAddress1 = data.AcmLocations[0].AclAddress1;
    this.dashService.userDetails.AclAddress2 = data.AcmLocations[0].AclAddress2;
    this.dashService.userDetails.AclPinCode = data.AcmLocations[0].AclPinCode;

    console.log(this.dashService.userDetails.bank);
  }


  
}

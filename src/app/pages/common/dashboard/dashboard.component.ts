import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../services/shared/dashboard-service/dashboard.service';


interface RecentSale {
  vdate: Date;
  Vno: string;
  Amount: number;
}



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  userType: string = '';

  @ViewChild('salesChart') salesChartRef: any;

  currentDate = new Date();



recentSales: RecentSale[] = [];
fixedSalesRows: RecentSale[] = [];

  lastCredit: number | null = null;
  lastDate: string | null = null;





  constructor(public dashboradService: DashboardService) {
    Chart.register(...registerables);
    
  }

  ngOnInit(): void {
    this.userType = (sessionStorage.getItem('userType') || '').toLowerCase();
    console.log(this.userType);
    this.getDetails();
    this.getDetailOtSnd();
    this.getDashbodTable();
    this. getLastCreditAndDate();
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
    this.dashboradService.getDshbrd().subscribe({
      next: (data: any) => {
        this.fillDetails(data.Acm);
      },
      error: (err) => {
        // Optionally show user-friendly error or alert
        alert('Something went wrong while fetching data. Please try again.');
      },
    });
  }


getDashbodTable() {
  this.dashboradService.getDashbodTable().subscribe({
    next: (response: any) => {
      const portalData = response?.PortalDashboardAPI || [];

      const sales = portalData.map((item: any): RecentSale => ({
        vdate: new Date(item.Vdate),
        Vno: item.Vno,
        Amount: item.Amount,
      }));

      // Fill up to 5 rows
      while (sales.length < 5) {
        sales.push({
          vdate: null as any,
          Vno: '',
          Amount: undefined as any,
        });
      }

      this.fixedSalesRows = sales.slice(0, 5);

      console.log('Fixed sales rows:', this.fixedSalesRows);
    },
    error: (err) => {
      console.error('Error fetching dashboard table data:', err);
    },
  });
}


 getLastCreditAndDate(): void {
    this.dashboradService.accountStatement().subscribe(
      (response: any) => {
        const table = response?.ReportData?.Table;
        if (Array.isArray(table) && table.length > 0) {
          const last = table[table.length - 1];
          this.lastCredit = last?.Credit ?? 0;
          this.lastDate = last?.Date ?? null;
          console.log('Credit:', this.lastCredit);
          console.log('Date:', this.lastDate);
        } else {
          console.warn('No records found in Table');
        }
      },
      (error) => {
        console.error('Error fetching account statement', error);
      }
    );
  }




  getDetailOtSnd() {
    this.dashboradService.getDashbrdOtsnd().subscribe({
      next: (data: any) => {
        this.pendAmt = data.OUTSTANDINGAMT;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      },
    });
  }

  fillDetails(data: any) {
    this.dashboradService.userDetails.Name = data.AcmName;
    this.dashboradService.userDetails.email = data.AcmEmail;
    this.dashboradService.userDetails.gstin = data.AcmGstin;
    this.dashboradService.userDetails.phone = data.AcmMobileNo;
    this.dashboradService.userDetails.bank = data.AcmBanks;
    this.dashboradService.userDetails.AcmAddress1 = data.AcmAddress1;
    this.dashboradService.userDetails.AcmAddress2 = data.AcmAddress2;
    this.dashboradService.userDetails.AclLocation =
      data.AcmLocations[0].AclLocation;
    this.dashboradService.userDetails.AclAddress1 =
      data.AcmLocations[0].AclAddress1;
    this.dashboradService.userDetails.AclAddress2 =
      data.AcmLocations[0].AclAddress2;
    this.dashboradService.userDetails.AclPinCode =
      data.AcmLocations[0].AclPinCode;
  }
}

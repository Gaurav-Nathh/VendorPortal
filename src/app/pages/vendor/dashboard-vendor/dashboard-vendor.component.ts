import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-vendor',
  imports: [CommonModule],
    standalone: true,
  templateUrl: './dashboard-vendor.component.html',
  styleUrl: './dashboard-vendor.component.scss'
})
export class DashboardVendorComponent {

  @ViewChild('salesChart') salesChartRef: any;
  
  currentDate = new Date();
  
  recentSales = [
    { date: new Date('2025-06-20'), invoiceNo: 'INV-2025-0620', amount: 12500.00, status: 'Paid' },
    { date: new Date('2025-06-15'), invoiceNo: 'INV-2025-0615', amount: 8500.50, status: 'Paid' },
    { date: new Date('2025-06-10'), invoiceNo: 'INV-2025-0610', amount: 15000.00, status: 'Pending' },
    { date: new Date('2025-06-05'), invoiceNo: 'INV-2025-0605', amount: 7500.75, status: 'Paid' },
    { date: new Date('2025-05-28'), invoiceNo: 'INV-2025-0528', amount: 22000.00, status: 'Overdue' }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initialization logic
  }

  ngAfterViewInit(): void {
    this.initSalesChart();
  }

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
            yAxisID: 'y'
          },
          {
            label: 'Number of Invoices',
            data: [12, 19, 15, 18, 22, 19],
            backgroundColor: '#93c5fd',
            borderRadius: 6,
            yAxisID: 'y1'
          }
        ]
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
              label: function(context) {
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
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Sales Value (₹)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + value.toLocaleString();
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Number of Invoices'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
}

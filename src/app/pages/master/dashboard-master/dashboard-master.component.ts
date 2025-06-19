import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {

  Chart as ChartJS,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler
);




@Component({
  selector: 'app-dashboard-master',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-master.component.html',
  styleUrl: './dashboard-master.component.scss'
})
export class DashboardMasterComponent {

  public cashFlowChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Mar2025', 'Apr2025', 'May2025', 'Jun2025', 'Jul2025', 'Aug2025',
      'Sep2025', 'Oct2025', 'Nov2025', 'Dec2025', 'Jan2026', 'Feb2026', 'Mar2026'
    ],
    datasets: [{
      label: 'Cash Flow',
      data: [0, 1000, 2500, 3000, 4500, 5000, 4000, 3000, 2000, 1000, 0, 1000, 2000],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };

  public cashFlowChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value) => `${Number(value) / 1000} K`
        },
        beginAtZero: true,
        min: 0,
        max: 5000
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };


}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
import { ThemeService } from '../../services/theme.service';
import { DashboardService } from '../../services/shared/dashboard-service/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDshbrd().subscribe({
      next: (data: any) => {},
      error: (err) => {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch dashboard data. Please try again later.',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      },
    });
  }

  get userDetails() {
    return this.dashboardService.userDetails;
  }
}

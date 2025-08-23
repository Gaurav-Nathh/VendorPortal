import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/shared/user-service/user.service';
import { ReportGeneratorService } from '../../services/shared/report-generator/report-generator.service';
import Swal from 'sweetalert2';
import { ReportGenratedResponse } from '../../Models/Common/generated-report.model';

@Component({
  selector: 'app-report-generator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss',
})
export class ReportGeneratorComponent {
  @Input() listType: string = '';

  isOpen: boolean = false;
  form: FormGroup;
  loading: boolean = false;

  reports: ReportGenratedResponse[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private reportGeneratorService: ReportGeneratorService
  ) {
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.fetchReports();
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.valid && this.listType) {
      this.loading = true;
      const request = {
        acmId: this.userService._user?.UsrLinkAcmId || 0,
        listType: this.listType,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
      };

      this.reportGeneratorService.generateReport(request).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Your report is being generated.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          this.fetchReports();
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            toast: true,
            icon: 'error',
            text: 'Failed to generate report. Please try again later.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        },
      });
    }
  }

  fetchReports() {
    this.loading = true;
    this.reportGeneratorService
      .getReports(this.userService._user?.UsrLinkAcmId || 0, this.listType)
      .subscribe({
        next: (res) => {
          this.reports = res;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            toast: true,
            icon: 'error',
            text: 'Failed to fetch reports. Please try again later.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        },
      });
  }
}

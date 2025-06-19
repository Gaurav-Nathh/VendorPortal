import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashbard-customer',
  imports: [RouterModule, CommonModule],
  templateUrl: './dashbard-customer.component.html',
  styleUrl: './dashbard-customer.component.scss',
})
export class DashbardCustomerComponent {}

import { Injectable } from '@angular/core';
import { Customer } from '../../Models/interface/Customer.interface';
import { CustomerFormData } from '../../Models/data-structure/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customer: Customer = new CustomerFormData();

  customers: Customer[] = [];

  constructor() {}

  addCustomer() {
    this.customers.push(this.customer);
  }
}

import { Injectable } from '@angular/core';
import { VendorFormData } from '../../Models/data-structure/vendor.model';
import { Vendor } from '../../Models/interface/Vendor.interface';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceFileService {
  
 vendor:Vendor=new VendorFormData();


vendors:Vendor[]=[];


  constructor() { }

  addVendor() {
    this.vendors.push(this.vendor);
    
   
  }

  
  
}





 /* vendors = [
  {
    name: 'John Doe',
    vendorNumber: 'VND001',
    companyName: 'ABC Pvt Ltd',
    email: 'john.doe@example.com',
    workPhone: '+91-9876543210',
    payables: 50000,
  },
  {
    name: 'Jane Smith',
    vendorNumber: 'VND002',
    companyName: 'XYZ Ltd',
    email: 'jane.smith@example.com',
    workPhone: '+91-8765432109',
    payables: 75000,
  },
  {
    name: 'Alice Johnson',
    vendorNumber: 'VND003',
    companyName: 'LMN Corp',
    email: 'alice.johnson@example.com',
    workPhone: '+91-7654321098',
    payables: 60000,
  },
]; */
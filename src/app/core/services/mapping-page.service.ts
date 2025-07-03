import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MappingformData } from '../../Models/MappingForm.model';

@Injectable({
  providedIn: 'root'
})
export class MappingPageService {
  MappingData:MappingformData=new MappingformData();


  listMappingData = [
    {
      customerItemCode: 'C001',
      customerItemName: 'Sugar',
      vendorItemCode: 'V101',
      vendorItemName: 'Sweet White',
      product: 'Food'
    },
    {
      customerItemCode: 'C002',
      customerItemName: 'Salt',
      vendorItemCode: 'V102',
      vendorItemName: 'SaltyRock',
      product: 'Food'
    }
  ];


  constructor() { }

  private formVisbilitySubject = new BehaviorSubject<boolean>(false);
  formVisibility$ = this.formVisbilitySubject.asObservable();

  openForm() {
    this.formVisbilitySubject.next(true);
  }
  
  closeForm(){
    this.formVisbilitySubject.next(false);
  }

  toggleForm() {
    const currentState = this.formVisbilitySubject.value;
    this.formVisbilitySubject.next(!currentState); // Toggle the current state
  }
}

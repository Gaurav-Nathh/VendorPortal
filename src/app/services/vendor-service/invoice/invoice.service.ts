import { Injectable } from '@angular/core';

export interface Branch {
  Id: string;
  Text: string;
  Value: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

}

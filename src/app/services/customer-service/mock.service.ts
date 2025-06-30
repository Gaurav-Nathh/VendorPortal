import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  private posSubject = new BehaviorSubject<any[]>([]);
  pos$: Observable<any[]> = this.posSubject.asObservable();
  constructor() {}
  private buildPO(branchName: string, inputItems: any[]): any {
    const orderNumber = `PO-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const date = new Date();
    const status = 'Created';

    const value = inputItems.reduce((total, item) => {
      const firstMRP = item.Itemprices?.[0]?.MRP || 0;
      const qty = item.ItmQty || 1;
      return total + firstMRP * qty;
    }, 0);

    return {
      branch: branchName,
      orderNumber,
      date,
      qty: inputItems.length,
      value: +value.toFixed(2),
      status,
      items: inputItems,
    };
  }

  buildAndAddPO(branchName: string, inputItems: any[]): any {
    const newPO = this.buildPO(branchName, inputItems);
    const updatedList = [...this.posSubject.value, newPO];
    this.posSubject.next(updatedList);
    return newPO;
  }

  clearPOs(): void {
    this.posSubject.next([]);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private initialSidebarStyle =
    sessionStorage.getItem('sidebarStyle') || 'shrink';
  sidebarStyle = new BehaviorSubject<string>(this.initialSidebarStyle);
  sidebarVisible = new BehaviorSubject<boolean>(true);
  shoppingCartVisible = new BehaviorSubject<boolean>(false);

  sidebarStyle$ = this.sidebarStyle.asObservable();
  sidebarVisible$ = this.sidebarVisible.asObservable();
  shoppingCartVisible$ = this.shoppingCartVisible.asObservable();

  getCurrentSidebarStyle() {
    return this.sidebarStyle.value;
  }

  setSidebarStyle(style: string) {
    this.sidebarStyle.next(style);
    sessionStorage.setItem('sidebarStyle', style);
  }

  toggleSidebarVisibility() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }

  getSidebarVisibility() {
    return this.sidebarVisible.value;
  }

  toggleShoppingCartVisibility(value: boolean) {
    this.shoppingCartVisible.next(value);
  }

  getShoppingCartVisibility() {
    return this.shoppingCartVisible.value;
  }
}

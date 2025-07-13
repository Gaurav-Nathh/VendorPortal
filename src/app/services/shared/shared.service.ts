import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const CART_MODE_KEY = 'cartMode';
type CartMode = 'catalouge' | 'items';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private initialSidebarStyle =
    sessionStorage.getItem('sidebarStyle') || 'shrink';
  sidebarStyle = new BehaviorSubject<string>(this.initialSidebarStyle);
  sidebarVisible = new BehaviorSubject<boolean>(true);
  shoppingCartVisible = new BehaviorSubject<boolean>(false);

  private cartModeSubject: BehaviorSubject<CartMode>;
  public cartMode$: Observable<CartMode>;

  sidebarStyle$ = this.sidebarStyle.asObservable();
  sidebarVisible$ = this.sidebarVisible.asObservable();
  shoppingCartVisible$ = this.shoppingCartVisible.asObservable();

  constructor() {
    const saveMode = sessionStorage.getItem(CART_MODE_KEY) as CartMode;
    const initialMode: CartMode = saveMode === 'items' ? 'items' : 'catalouge';

    this.cartModeSubject = new BehaviorSubject<CartMode>(initialMode);
    this.cartMode$ = this.cartModeSubject.asObservable();
  }

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

  setCartMode(mode: CartMode): void {
    this.cartModeSubject.next(mode);
    sessionStorage.setItem(CART_MODE_KEY, mode);
  }

  getCartMode(): CartMode {
    return this.cartModeSubject.getValue();
  }
}

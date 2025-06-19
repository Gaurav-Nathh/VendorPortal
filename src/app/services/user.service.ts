import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private userType: string = 'vendor';
  private userType: string = 'customer';

  constructor() {
    // const storedType = localStorage.getItem('userType');
    const storedType = sessionStorage.getItem('userType');
    if (storedType) this.userType = storedType;
  }

  setUserType(type: string) {
    this.userType = type;
    // localStorage.setItem('userType', type);
    sessionStorage.setItem('userType', type);
  }

  getUserType(): string {
    // return localStorage.getItem('userType') || this.userType;
    return sessionStorage.getItem('userType') || this.userType;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../../../Models/Common/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public _user: User | null = null;
  private _userSubject = new BehaviorSubject<User | null>(null);
  user$ = this._userSubject.asObservable();

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  get user(): User | null {
    return this._userSubject.value;
  }

  setUser(user: User | null): void {
    this._user = user;
    // console.log('user service  ', this._user)
  }
  fetchUser(userId: number): Observable<User> {
    const headers = this.config.getHeader();
    return this.http
      .get<{ User: User }>(`${this.config.getApiUrl()}/Users/${userId}`, {
        headers,
      })

      .pipe(
        map((response) => response.User),
        tap((user) => this.setUser(user))
      );
  }
}

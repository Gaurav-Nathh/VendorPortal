import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { from, of, switchMap, throwError, map } from 'rxjs';
import { LoadingService } from './shared/loading.service';
import { SessionServiceService } from './session-service.service';
import { ApiConfigService } from './api-config/api-config.service';

interface LoginPayload {
  userName: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentYearShort = new Date().getFullYear().toString().slice(-2);

  constructor(
    private router: Router,
    private http: HttpClient,
    private config: ApiConfigService,
    private userService: UserService,
    private loaderAuthService: LoadingService,
    private sessionService: SessionServiceService
  ) {}

  login(payload: LoginPayload): Observable<any> {
    const headers = this.config.getHeader();
    this.loaderAuthService.show();
    return this.http
      .post(`${this.config.getApiUrl()}/Login/Authenticate`, payload, {
        headers,
      })
      .pipe(
        switchMap((response: any) => {
          const userDetails = response.UserDetails;
          if (response.IsLogin === true) {
            this.loaderAuthService.hide();
            return from(
              Swal.fire({
                title: 'Active session detected',
                text: 'Do you want to logout the other session?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
              })
            ).pipe(
              switchMap((result) => {
                if (result.isConfirmed) {
                  const params = new HttpParams()
                    .set('LogHisID', parseInt(userDetails.UsrLghId, 10))
                    .set('IsAuto', false);
                  this.loaderAuthService.show();
                  return this.http
                    .get(`${this.config.getApiUrl()}/Login/LogOut`, {
                      headers,
                      params,
                    })
                    .pipe(
                      switchMap((logoutRes: any) => {
                        if (logoutRes?.IsSuccessfullyLogOUt === true) {
                          return this.login(payload);
                        } else {
                          Swal.fire(
                            'Failed',
                            'Unable to logout other session.',
                            'error'
                          );
                          throw new Error('Failed to logout other session');
                        }
                      })
                    );
                } else {
                  return of({
                    success: false,
                    message: 'User cancelled session logout',
                  });
                }
              })
            );
          } else {
            // localStorage.setItem('isAuthenticated', 'true');
            // localStorage.setItem(
            //   'userId',
            //   userDetails?.UsrId?.toString() || ''
            // );
            // localStorage.setItem(
            //   'UsrLghId',
            //   userDetails?.UsrLghId?.toString() || ''
            // );
            // localStorage.setItem('UsrBrnId', userDetails?.UsrBrnId || 0);
            // this.userService.setUserType(userDetails?.UsrType?.toString());
            // return of({ success: true });
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem(
              'userId',
              userDetails?.UsrId?.toString() || ''
            );
            sessionStorage.setItem(
              'UsrName',
              userDetails?.UsrName?.toString() || ''
            );
            sessionStorage.setItem(
              'UsrLghId',
              userDetails?.UsrLghId?.toString() || ''
            );
            sessionStorage.setItem(
              'UsrCtrlCmpId',
              response.UserCtrlCmpId.toString()
            );
            sessionStorage.setItem(
              'UsrLinkAcmId',
              userDetails?.UsrLinkAcmId || ''
            );
            sessionStorage.setItem('UsrAddUser', userDetails?.UsrAddUser);
            sessionStorage.setItem('fryId', this.currentYearShort);

            sessionStorage.setItem(
              'UsrLinkAcmName',
              userDetails?.UsrLinkAcmName?.toString() || ''
            );
            sessionStorage.setItem('UsrBrnId', userDetails?.UsrBrnId || 0);
            sessionStorage.setItem('UsrCode', userDetails?.UsrCode || '');

            // If userService.setUserType stores internally or in another storage, update accordingly
            this.userService.setUserType(userDetails?.UsrType?.toString());

            return of({ success: true });
          }
        }),
        catchError((error) => {
          Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top-end',
            title: error.error?.Message || error.message || 'Login failed',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'swal-toast',
              icon: 'no-border',
              title: 'swal-title',
            },
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.loaderAuthService.hide();
        })
      );
  }

  logout() {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // const userId = localStorage.getItem('userId');
        // const usrLghId = localStorage.getItem('UsrLghId') || '';
        const userId = sessionStorage.getItem('userId');
        const usrLghId = sessionStorage.getItem('UsrLghId') || '';
        const headers = this.config.getHeader();
        const params = new HttpParams()
          .set('LogHisID', parseInt(usrLghId, 10))
          .set('IsAuto', false);

        this.http
          .get(`${this.config.getApiUrl()}/Login/LogOut`, { headers, params })
          .subscribe((response: any) => {
            if (response?.IsSuccessfullyLogOUt === true) {
              Swal.fire({
                toast: true,
                icon: 'success',
                position: 'top-end',
                title: 'Logged out successfully',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                  popup: 'swal-toast',
                  icon: 'no-border',
                  title: 'swal-title',
                },
              });
              this.sessionService.stopSession();
              this.clearSession();
            } else {
              Swal.fire({
                toast: true,
                icon: 'error',
                position: 'top-end',
                title: 'Logout failed',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                  popup: 'swal-toast',
                  icon: 'no-border',
                  title: 'swal-title',
                },
              });
            }
          });
        if (!userId) {
          this.clearSession();
          return;
        }
      }
    });
  }

  private clearSession() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }
}

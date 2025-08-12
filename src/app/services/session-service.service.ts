import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { interval, takeUntil, Subject, switchMap } from 'rxjs';
import { ApiConfigService } from './api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class SessionServiceService {
  private stopPolling$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private config: ApiConfigService
  ) {}
  startSession() {
    const headers = this.config.getHeader();
    interval(3000)
      .pipe(
        takeUntil(this.stopPolling$),
        switchMap(() => {
          const lghId = sessionStorage.getItem('UsrLghId') || '0';

          return this.http.get(
            `${this.config.getApiUrl()}/Login/LoginAuthenticate`,
            {
              headers,
              params: {
                LghId: lghId.toString(),
              },
            }
          );
        })
      )
      .subscribe((response: any) => {
        if (response?.IsLogin === false) {
          this.stopSession();
          Swal.fire({
            title: 'Session Expired',
            text: 'You will be logged out in 3 seconds.',
            icon: 'warning',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            this.logoutUser();
          });
        }
      });
  }
  logoutUser() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  stopSession() {
    this.stopPolling$.next();
    this.stopPolling$.complete();
    this.stopPolling$ = new Subject<void>();
  }
}

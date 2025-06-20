import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { interval, takeUntil, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionServiceService {
  private apiUrl = 'https://efactoapidevelopment.efacto.cloud/api';
  private apiKey = '140-9299-524-TEST';
  private stopPolling$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}
  startSession() {
    const headers = new HttpHeaders({
      Code: this.apiKey,
    });
    interval(3000)
      .pipe(
        takeUntil(this.stopPolling$),
        switchMap(() => {
          // const lghIdStr = localStorage.getItem('UsrLghId') || '0';
          const lghId = sessionStorage.getItem('UsrLghId') || '0';
          // const lghId = parseInt(lghIdStr, 10);

          return this.http.get(`${this.apiUrl}/Login/LoginAuthenticate`, {
            headers,
            params: {
              LghId: lghId.toString(),
            },
          });
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

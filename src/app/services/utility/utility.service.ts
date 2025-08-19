import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private http: HttpClient) {}

  getIp(): Observable<string> {
    return this.http
      .get<{ ip: string }>('https://api.ipify.org?format=json')
      .pipe(
        map((res) => res.ip),
        catchError((err) => throwError(() => err))
      );
  }

  getLocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      }
    });
  }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    return this.http.get(url).pipe(catchError((err) => throwError(() => err)));
  }

  getBrowserName(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
      return 'Chrome';
    } else if (ua.includes('Firefox')) {
      return 'Firefox';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      return 'Safari';
    } else if (ua.includes('Edg')) {
      return 'Edge';
    } else if (ua.includes('OPR')) {
      return 'Opera';
    } else {
      return 'Unknown';
    }
  }

  getOSName(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Windows')) {
      return 'Windows';
    } else if (ua.includes('Mac OS')) {
      return 'MacOS';
    } else if (ua.includes('Linux')) {
      return 'Linux';
    } else if (/Android/i.test(ua)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      return 'iOS';
    } else {
      return 'Unknown';
    }
  }
}

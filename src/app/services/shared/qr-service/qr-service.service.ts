import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class QrServiceService {
  private apiUrl = 'https://localhost:7133/api/QR';

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  sendScannedData(scannedData: any): void {
    const headers = this.config.getHeader();
    if (scannedData) {
      this.http.post(`${this.apiUrl}/ReceiveScan`, scannedData).subscribe({
        next: (response) => {
          console.log('Data sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending data:', error);
        },
      });
    }
  }
}

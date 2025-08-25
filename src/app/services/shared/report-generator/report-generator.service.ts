import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../api-config/api-config.service';
import {
  ReportRequest,
  ReportGenratedResponse,
} from '../../../Models/Common/generated-report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportGeneratorService {
  private apiUrl = 'https://localhost:7133/api/PortalReport/ReportGenration';

  constructor(private http: HttpClient, private config: ApiConfigService) {}

  generateReport(request: ReportRequest): Observable<any> {
    console.log('Generating report with request:', request);
    const headers = this.config.getHeader();
    return this.http.post<any>(`${this.apiUrl}/GenerateExcelReport`, request, {
      headers,
    });
  }

  getReports(
    acmId: number,
    listType: string
  ): Observable<ReportGenratedResponse[]> {
    return this.http.get<ReportGenratedResponse[]>(
      `${this.apiUrl}/GetReport?acmId=${acmId}&listType=${listType}`
    );
  }

  markAsDownloaded(acmId: number, reqId: number) {
    this.http
      .put(`${this.apiUrl}/mark-downloaded/${acmId}/${reqId}`, {})
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Failed to mark report as downloaded:', error);
        },
      });
  }
}

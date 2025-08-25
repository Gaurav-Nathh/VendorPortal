export interface ReportRequest {
  acmId: number;
  listType: string;
  startDate: string;
  endDate: string;
}

export interface ReportGenratedResponse {
  acmId: number;
  reqId: number;
  reqDate: string;
  listType: string;
  startDate: string;
  endDate: string;
  fileUrl?: string;
  fileGenrationDate?: string;
  status: string;
  fileName?: string;
  isDownloaded: boolean;
}

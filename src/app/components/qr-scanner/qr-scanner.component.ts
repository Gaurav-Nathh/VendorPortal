import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { NgIf } from '@angular/common';
import { QrServiceService } from '../../services/shared/qr-service/qr-service.service';
@Component({
  selector: 'app-qr-scanner',
  imports: [ZXingScannerModule, NgIf],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
})
export class QrScannerComponent {
  scannerEnabled: boolean = false;
  qrResult: any = null;
  scannedData: any = null;
  errorMessage: string = '';

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];

  constructor(private qrService: QrServiceService) {}

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    // if (devices.length > 0) {
    //   this.selectedDevice = devices[0];
    // }
    if (devices && devices.length > 0) {
      const backCam = devices.find((d) =>
        /back|rear|environment/gi.test(d.label)
      );
      this.selectedDevice = backCam || devices[0];
    } else {
      this.errorMessage = 'No cameras found';
    }
  }

  onScanSuccess(result: string): void {
    this.qrResult = result;
    this.scannerEnabled = false;

    try {
      this.scannedData = JSON.parse(result);
      this.errorMessage = '';
      this.qrService.sendScannedData(this.scannedData);
    } catch (error) {
      this.errorMessage = 'Invalid QR code format';
      this.scannedData = null;
    }
  }

  onScanError(error: any): void {
    console.error('Scan error:', error);
    this.errorMessage = error?.message || 'Scanning error occurred';
  }

  startScanner(): void {
    this.scannerEnabled = true;
    this.qrResult = null;
    this.scannedData = null;
    this.errorMessage = '';
  }

  stopScanner(): void {
    this.scannerEnabled = false;
  }

  clearResult(): void {
    this.qrResult = null;
    this.scannedData = null;
    this.errorMessage = '';
  }
}

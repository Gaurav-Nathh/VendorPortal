import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { NgIf } from '@angular/common';
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

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    if (devices.length > 0) {
      this.selectedDevice = devices[0];
    }
  }

  onScanSuccess(result: string): void {
    this.qrResult = result;
    this.scannerEnabled = false;

    try {
      this.scannedData = JSON.parse(result);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Invalid QR code format';
      this.scannedData = null;
    }
  }

  onScanError(error: any): void {
    console.error('Scan error:', error);
    this.errorMessage = 'Scanning error occurred';
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

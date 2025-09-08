import { Component } from '@angular/core';
import { QrGeneratorComponent } from '../../../components/qr-generator/qr-generator.component';
import { QrScannerComponent } from '../../../components/qr-scanner/qr-scanner.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-qr',
  imports: [QrGeneratorComponent, QrScannerComponent, NgIf],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss',
})
export class QrComponent {
  currentView: string = 'generator';
}

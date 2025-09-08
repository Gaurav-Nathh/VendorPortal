import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ReportGeneratorComponent,
    QrGeneratorComponent,
    QrScannerComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [],
})
export class LayoutModule {}

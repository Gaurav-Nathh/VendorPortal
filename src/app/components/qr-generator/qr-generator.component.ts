import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';

interface QrFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

@Component({
  selector: 'app-qr-generator',
  imports: [FormsModule, NgIf],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
})
export class QrGeneratorComponent {
  formData: QrFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  };

  qrCodeDataUrl: string = '';
  isGenerated: boolean = false;

  currentCharCount: number = 0;
  maxCharLimit: number = 2953;
  charCountWarning: number = 2500;
  isOverLimit: boolean = false;

  updateCharCount() {
    const jsonData = JSON.stringify(this.formData);
    this.currentCharCount = jsonData.length;
    this.isOverLimit = this.currentCharCount > this.maxCharLimit;
  }

  getFieldCharCount(field: keyof QrFormData): number {
    return this.formData[field]?.length || 0;
  }

  getProgressPercentage(): number {
    return Math.min((this.currentCharCount / this.maxCharLimit) * 100, 100);
  }

  getProgressBarColor(): string {
    const percentage = this.getProgressPercentage();
    if (percentage >= 100) return '#dc3545';
    if (percentage >= 80) return '#ffc107';
    return '#28a745'; // Green - safe
  }

  async generateQRCode() {
    if (this.isOverLimit) {
      alert(
        `QR code data exceeds the maximum limit of ${this.maxCharLimit} characters. Please reduce your input.`
      );
      return;
    }

    try {
      const jsonData = JSON.stringify(this.formData);

      this.qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      this.isGenerated = true;
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    };
    this.qrCodeDataUrl = '';
    this.isGenerated = false;
    this.currentCharCount = 0;
    this.isOverLimit = false;
  }

  downloadQRCode() {
    if (this.qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = this.qrCodeDataUrl;
      link.download = 'information-qr.png';
      link.click();
    }
  }
}

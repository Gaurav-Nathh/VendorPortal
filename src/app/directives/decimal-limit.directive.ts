import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimalLimit]'
})
export class DecimalLimitDirective {

  @Input('appDecimalLimit')
  set decimalLimitInput(value: string | number) {
    this.decimalLimit = Number(value);
  }
  private decimalLimit = 2;

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const initialValue = input.value;

    // Allow only up to X decimal places
    if (!this.isValidDecimal(initialValue)) {
      input.value = initialValue.slice(0, -1); // remove last char
    }
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value) {
      input.value = parseFloat(input.value).toFixed(this.decimalLimit);
    }
  }

  private isValidDecimal(value: string): boolean {
    const parts = value.split('.');
    if (parts.length === 2 && parts[1].length > this.decimalLimit) {
      return false;
    }
    return true;
  }
}

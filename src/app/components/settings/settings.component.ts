import { Component } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  enablePortal: boolean = false;
  enableProfileEditing: boolean = false;
  enablePurchaseOrderCreation: boolean = false;
  enableManualInvoiceGeneration: boolean = false;
  sideNavStyle: string = '';
  selectedTheme: string = '';

  constructor(
    private sidebarService: SharedService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarStyle$.subscribe((style) => {
      this.sideNavStyle = style;
    });
    this.themeService.theme$.subscribe((theme) => {
      this.selectedTheme = theme;
    });
  }

  onSubmit(form: NgForm) {
    this.sidebarService.setSidebarStyle(this.sideNavStyle);
    this.themeService.setTheme(this.selectedTheme);
  }
}

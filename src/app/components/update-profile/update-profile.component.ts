import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
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

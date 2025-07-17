import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark-theme';
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const selectedTheme = this.isDarkMode ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(selectedTheme);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeClass = 'dark-theme';
  private lightThemeClass = 'light-theme';

  private themeSubject = new BehaviorSubject<string>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();
  constructor() {
    this.setTheme(this.themeSubject.value);
  }
  private getInitialTheme(): string {
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? this.darkThemeClass : this.lightThemeClass;
  }

  setTheme(theme: string): void {
    document.body.classList.remove(this.darkThemeClass, this.lightThemeClass);
    document.body.classList.add(theme);
    sessionStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    const next =
      current === this.darkThemeClass
        ? this.lightThemeClass
        : this.darkThemeClass;
    this.setTheme(next);
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }
}

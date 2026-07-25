import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private darkClass = 'dark';

  isDark(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }

  toggleTheme(): void {
    document.documentElement.classList.toggle(this.darkClass);

    const isDark = this.isDark();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadTheme(): void {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      document.documentElement.classList.add(this.darkClass);
    }
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>(this.getStoredTheme());
  currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    this.applyTheme(this.currentTheme.value);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }

  private storeTheme(theme: Theme): void {
    localStorage.setItem('finmind-theme', theme);
  }

  private getStoredTheme(): Theme {
    return (localStorage.getItem('finmind-theme') as Theme) || 'light';
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}
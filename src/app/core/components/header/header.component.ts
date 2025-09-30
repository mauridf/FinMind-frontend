import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  
  currentUser: User | null = null;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showSuccess('Logout realizado com sucesso!');
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.showError('Erro ao fazer logout');
      }
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    return this.themeService.getCurrentTheme() === 'light' ? 'dark_mode' : 'light_mode';
  }

  getThemeTooltip(): string {
    return this.themeService.getCurrentTheme() === 'light' ? 'Modo Escuro' : 'Modo Claro';
  }
}
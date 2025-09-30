import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/transaction', icon: 'receipt', label: 'Transações' },
    { path: '/categories', icon: 'category', label: 'Categorias' },
    { path: '/budgets', icon: 'savings', label: 'Orçamentos' },
    { path: '/goals', icon: 'flag', label: 'Metas' },
    { path: '/reports', icon: 'analytics', label: 'Relatórios' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  onNavigate(path: string): void {
    this.router.navigate([path]);
    this.closeSidenav.emit();
  }
}
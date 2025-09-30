import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FinMind - Gestão Financeira Pessoal';
  showSidenav = false;

  constructor(public authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleSidenav(): void {
    this.showSidenav = !this.showSidenav;
  }

  closeSidenav(): void {
    this.showSidenav = false;
  }
}
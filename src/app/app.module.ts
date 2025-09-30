import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { HeaderComponent } from './core/components/header/header.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';

// Services and Interceptors
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { ApiService } from './core/services/api.service';
import { TransactionService } from './core/services/transaction.service';
import { CategoryService } from './core/services/category.service';
import { ThemeService } from './core/services/theme.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthGuard } from './core/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    
    // Angular Material - TODOS necessários
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,        // ← ESSENCIAL para o sidenav
    MatDividerModule,     // ← Para o divider no menu
    MatMenuModule,        // ← Para menus dropdown
    MatSnackBarModule,     // ← Para notificações
    MatTooltipModule
  ],
  providers: [
    AuthService,
    UserService,
    ApiService,
    TransactionService,
    CategoryService,
    ThemeService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
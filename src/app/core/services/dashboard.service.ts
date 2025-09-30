import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  DashboardSummary, 
  SpendingByCategory, 
  MonthlySummary,
  CashFlowProjection,
  GoalProgress,
  BudgetStatus,
  FinancialHealth,
  QuickStats
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly dashboardEndpoint = 'dashboard';

  constructor(private apiService: ApiService) { }

  getSummary(): Observable<DashboardSummary> {
    return this.apiService.get<DashboardSummary>(`${this.dashboardEndpoint}/summary`);
  }

  getSpendingByCategory(startDate?: Date, endDate?: Date): Observable<SpendingByCategory[]> {
    let params: any = {};
    
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.apiService.get<SpendingByCategory[]>(
      `${this.dashboardEndpoint}/spending-by-category`, 
      params
    );
  }

  getMonthlySummary(monthsBack?: number): Observable<MonthlySummary[]> {
    let params: any = {};
    
    if (monthsBack) params.monthsBack = monthsBack;

    return this.apiService.get<MonthlySummary[]>(
      `${this.dashboardEndpoint}/monthly-summary`, 
      params
    );
  }

  getCashFlowProjection(daysAhead?: number): Observable<CashFlowProjection[]> {
    let params: any = {};
    
    if (daysAhead) params.daysAhead = daysAhead;

    return this.apiService.get<CashFlowProjection[]>(
      `${this.dashboardEndpoint}/cash-flow-projection`, 
      params
    );
  }

  getGoalsProgress(): Observable<GoalProgress[]> {
    return this.apiService.get<GoalProgress[]>(`${this.dashboardEndpoint}/goals-progress`);
  }

  getBudgetStatus(): Observable<BudgetStatus[]> {
    return this.apiService.get<BudgetStatus[]>(`${this.dashboardEndpoint}/budget-status`);
  }

  getFinancialHealth(): Observable<FinancialHealth> {
    return this.apiService.get<FinancialHealth>(`${this.dashboardEndpoint}/financial-health`);
  }

  getQuickStats(): Observable<QuickStats> {
    return this.apiService.get<QuickStats>(`${this.dashboardEndpoint}/quick-stats`);
  }
}
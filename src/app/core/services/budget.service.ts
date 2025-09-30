import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Budget, 
  CreateBudgetRequest, 
  UpdateBudgetRequest 
} from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly budgetsEndpoint = 'budgets';

  constructor(private apiService: ApiService) { }

  getBudgetsByUser(userId: string): Observable<Budget[]> {
    return this.apiService.get<Budget[]>(`${this.budgetsEndpoint}/user/${userId}`);
  }

  getActiveBudgetsByUser(userId: string): Observable<Budget[]> {
    return this.apiService.get<Budget[]>(`${this.budgetsEndpoint}/user/${userId}/active`);
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.apiService.get<Budget>(`${this.budgetsEndpoint}/${id}`);
  }

  createBudget(userId: string, budget: CreateBudgetRequest): Observable<Budget> {
    return this.apiService.post<Budget>(`${this.budgetsEndpoint}/user/${userId}`, budget);
  }

  updateBudget(id: string, budget: UpdateBudgetRequest): Observable<Budget> {
    return this.apiService.put<Budget>(`${this.budgetsEndpoint}/${id}`, budget);
  }

  deleteBudget(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.budgetsEndpoint}/${id}`);
  }

  getBudgetUsage(id: string): Observable<number> {
    return this.apiService.get<number>(`${this.budgetsEndpoint}/${id}/usage`);
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Goal, 
  CreateGoalRequest, 
  UpdateGoalRequest,
  UpdateProgressRequest 
} from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private readonly goalsEndpoint = 'goals';

  constructor(private apiService: ApiService) { }

  getGoalsByUser(userId: string): Observable<Goal[]> {
    return this.apiService.get<Goal[]>(`${this.goalsEndpoint}/user/${userId}`);
  }

  getActiveGoalsByUser(userId: string): Observable<Goal[]> {
    return this.apiService.get<Goal[]>(`${this.goalsEndpoint}/user/${userId}/active`);
  }

  getCompletedGoalsByUser(userId: string): Observable<Goal[]> {
    return this.apiService.get<Goal[]>(`${this.goalsEndpoint}/user/${userId}/completed`);
  }

  getGoalById(id: string): Observable<Goal> {
    return this.apiService.get<Goal>(`${this.goalsEndpoint}/${id}`);
  }

  createGoal(userId: string, goal: CreateGoalRequest): Observable<Goal> {
    return this.apiService.post<Goal>(`${this.goalsEndpoint}/user/${userId}`, goal);
  }

  updateGoal(id: string, goal: UpdateGoalRequest): Observable<Goal> {
    return this.apiService.put<Goal>(`${this.goalsEndpoint}/${id}`, goal);
  }

  updateGoalProgress(id: string, progress: UpdateProgressRequest): Observable<Goal> {
    return this.apiService.put<Goal>(`${this.goalsEndpoint}/${id}/progress`, progress);
  }

  completeGoal(id: string): Observable<Goal> {
    return this.apiService.put<Goal>(`${this.goalsEndpoint}/${id}/complete`, {});
  }

  deleteGoal(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.goalsEndpoint}/${id}`);
  }
}
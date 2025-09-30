import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest,
  SpendingByCategory 
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly transactionsEndpoint = 'transactions';

  constructor(private apiService: ApiService) { }

  getTransactionsByUser(userId: string, startDate?: Date, endDate?: Date): Observable<Transaction[]> {
    let params: any = {};
    
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.apiService.get<Transaction[]>(`${this.transactionsEndpoint}/user/${userId}`, params);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.apiService.get<Transaction>(`${this.transactionsEndpoint}/${id}`);
  }

  createTransaction(userId: string, transaction: CreateTransactionRequest): Observable<Transaction> {
    return this.apiService.post<Transaction>(`${this.transactionsEndpoint}/user/${userId}`, transaction);
  }

  updateTransaction(id: string, transaction: UpdateTransactionRequest): Observable<Transaction> {
    return this.apiService.put<Transaction>(`${this.transactionsEndpoint}/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.transactionsEndpoint}/${id}`);
  }

  getUserBalance(userId: string): Observable<number> {
    return this.apiService.get<number>(`${this.transactionsEndpoint}/user/${userId}/balance`);
  }

  getSpendingByCategory(userId: string, startDate?: Date, endDate?: Date): Observable<SpendingByCategory> {
    let params: any = {};
    
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.apiService.get<SpendingByCategory>(
      `${this.transactionsEndpoint}/user/${userId}/spending-by-category`, 
      params
    );
  }
}
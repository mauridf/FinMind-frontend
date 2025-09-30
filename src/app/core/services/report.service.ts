import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // usa o ApiService do projeto

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<any> {
    return this.api.get('dashboard/summary');
  }

  getSpendingByCategory(userId: string, from?: string, to?: string): Observable<any[]> {
    const qs = [
      userId ? `userId=${userId}` : '',
      from ? `from=${encodeURIComponent(from)}` : '',
      to ? `to=${encodeURIComponent(to)}` : ''
    ].filter(Boolean).join('&');
    const url = `dashboard/spending-by-category${qs ? '?' + qs : ''}`;
    return this.api.get(url);
  }

  getTransactions(userId: string, from?: string, to?: string): Observable<any[]> {
    const qs = [
      from ? `from=${encodeURIComponent(from)}` : '',
      to ? `to=${encodeURIComponent(to)}` : ''
    ].filter(Boolean).join('&');
    const url = `transactions/user/${userId}${qs ? '?' + qs : ''}`;
    return this.api.get(url);
  }
}

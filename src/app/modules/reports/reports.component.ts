import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  filterForm: FormGroup;
  doughnutData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  lineData: any = { labels: [], datasets: [] }; // use types se quiser
  transactions: any[] = [];
  loading = false;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.filterForm = this.fb.group({
      start: [null],
      end: [null],
      category: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitial();
  }

  private getUserId(): string {
    // Adapte para pegar do seu AuthService / user.service
    const raw = localStorage.getItem('user'); // exemplo
    try { return raw ? JSON.parse(raw).id : ''; } catch { return ''; }
  }

  loadInitial() {
    const userId = this.getUserId();
    this.loading = true;
    this.reportService.getSpendingByCategory(userId).subscribe(rows => {
      this.doughnutData.labels = rows.map((r: any) => r.category || r.categoryName || '—');
      this.doughnutData.datasets[0].data = rows.map((r: any) => r.total || r.amount || 0);
      this.loading = false;
    }, () => this.loading = false);
  }

  applyFilters() {
    const { start, end, category } = this.filterForm.value;
    const userId = this.getUserId();
    this.loading = true;
    const from = start ? new Date(start).toISOString() : undefined;
    const to = end ? new Date(end).toISOString() : undefined;

    this.reportService.getSpendingByCategory(userId, from, to).subscribe(rows => {
      this.doughnutData.labels = rows.map((r: any) => r.category || r.categoryName);
      this.doughnutData.datasets[0].data = rows.map((r: any) => r.total || 0);
      this.loading = false;
    }, () => this.loading = false);

    // carregar transações para tabela
    this.reportService.getTransactions(userId, from, to).subscribe(tx => this.transactions = tx);
  }
}

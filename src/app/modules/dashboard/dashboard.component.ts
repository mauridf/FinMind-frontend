import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { 
  DashboardSummary, 
  SpendingByCategory, 
  MonthlySummary,
  CashFlowProjection,
  GoalProgress,
  BudgetStatus,
  FinancialHealth,
  QuickStats
} from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Dados
  summary: DashboardSummary | null = null;
  spendingByCategory: SpendingByCategory[] = [];
  monthlySummary: MonthlySummary[] = [];
  cashFlowProjection: CashFlowProjection[] = [];
  goalsProgress: GoalProgress[] = [];
  budgetStatus: BudgetStatus[] = [];
  financialHealth: FinancialHealth | null = null;
  quickStats: QuickStats | null = null;

  // Estados de loading
  loading = {
    summary: true,
    spending: true,
    monthly: true,
    cashFlow: true,
    goals: true,
    budget: true,
    health: true,
    stats: true
  };

  // Configurações
  monthsBack = 6;
  daysAhead = 30;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {}

  loadAllData(): void {
    this.loadSummary();
    this.loadSpendingByCategory();
    this.loadMonthlySummary();
    this.loadCashFlowProjection();
    this.loadGoalsProgress();
    this.loadBudgetStatus();
    this.loadFinancialHealth();
    this.loadQuickStats();
  }

  loadSummary(): void {
    this.loading.summary = true;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading.summary = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.summary = this.getDefaultSummary(); // ← AGORA CHAMANDO O MÉTODO
        this.loading.summary = false;
      }
    });
  }

  loadSpendingByCategory(): void {
    this.loading.spending = true;
    this.dashboardService.getSpendingByCategory().subscribe({
      next: (data) => {
        this.spendingByCategory = data;
        this.loading.spending = false;
      },
      error: (error) => {
        console.error('Erro ao carregar gastos por categoria:', error);
        this.loading.spending = false;
      }
    });
  }

  loadMonthlySummary(): void {
    this.loading.monthly = true;
    this.dashboardService.getMonthlySummary(this.monthsBack).subscribe({
      next: (data) => {
        this.monthlySummary = data;
        this.loading.monthly = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo mensal:', error);
        this.loading.monthly = false;
      }
    });
  }

  loadCashFlowProjection(): void {
    this.loading.cashFlow = true;
    this.dashboardService.getCashFlowProjection(this.daysAhead).subscribe({
      next: (data) => {
        this.cashFlowProjection = data;
        this.loading.cashFlow = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projeção de fluxo:', error);
        this.loading.cashFlow = false;
      }
    });
  }

  loadGoalsProgress(): void {
    this.loading.goals = true;
    this.dashboardService.getGoalsProgress().subscribe({
      next: (data) => {
        this.goalsProgress = data;
        this.loading.goals = false;
      },
      error: (error) => {
        console.error('Erro ao carregar progresso de metas:', error);
        this.loading.goals = false;
      }
    });
  }

  loadBudgetStatus(): void {
    this.loading.budget = true;
    this.dashboardService.getBudgetStatus().subscribe({
      next: (data) => {
        this.budgetStatus = data;
        this.loading.budget = false;
      },
      error: (error) => {
        console.error('Erro ao carregar status de orçamentos:', error);
        this.loading.budget = false;
      }
    });
  }

  loadFinancialHealth(): void {
    this.loading.health = true;
    this.dashboardService.getFinancialHealth().subscribe({
      next: (data) => {
        this.financialHealth = data;
        this.loading.health = false;
      },
      error: (error) => {
        console.error('Erro ao carregar saúde financeira:', error);
        this.loading.health = false;
      }
    });
  }

  loadQuickStats(): void {
    this.loading.stats = true;
    this.dashboardService.getQuickStats().subscribe({
      next: (data) => {
        this.quickStats = data;
        this.loading.stats = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas rápidas:', error);
        this.loading.stats = false;
      }
    });
  }

  // Método para criar um summary padrão em caso de erro
  private getDefaultSummary(): DashboardSummary {
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthlyBudget: 0,
      budgetUsagePercentage: 0,
      totalTransactions: 0,
      activeGoals: 0,
      completedGoals: 0
    };
  }
  
  // Métodos auxiliares
  formatCurrency(value: number | undefined | null): string {
    if (value == null || isNaN(value)) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatPercentage(value: number | undefined | null): string {
    if (value == null || isNaN(value)) {
      return '0%';
    }
    return `${value.toFixed(1)}%`;
  }

  getMonthName(month: number | undefined | null): string {
    if (month == null || month < 1 || month > 12) {
      return '';
    }
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return months[month - 1] || '';
  }

  getProgressColor(percentage: number | undefined | null): string {
    if (percentage == null || isNaN(percentage)) {
      return 'primary';
    }
    if (percentage >= 90) return 'warn';
    if (percentage >= 75) return 'accent';
    return 'primary';
  }

  getHealthScoreColor(score: number | undefined | null): string {
    if (score == null || isNaN(score)) {
      return 'primary';
    }
    if (score >= 80) return 'primary';
    if (score >= 60) return 'accent';
    return 'warn';
  }

  getHealthScoreLabel(score: number | undefined | null): string {
    if (score == null || isNaN(score)) {
      return 'Indisponível';
    }
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Precisa de atenção';
  }

  refreshData(): void {
    this.loadAllData();
  }
}
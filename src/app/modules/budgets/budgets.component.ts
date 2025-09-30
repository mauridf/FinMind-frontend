import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Budget, BudgetPeriod, BUDGET_PERIODS } from '../../core/models/budget.model';
import { Category } from '../../core/models/category.model';
import { ColumnDefinition } from '../../shared/components/data-table/data-table.component';
import { BudgetFormComponent } from './budget-form/budget-form.component';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  activeBudgets: Budget[] = [];
  categories: Category[] = [];
  loading = false;
  selectedTab = 0; // 0 = Todos, 1 = Ativos

  // Propriedades computadas para as estatísticas
  get nearLimitCount(): number {
    return this.budgets.filter(b => b.usagePercentage !== undefined && b.usagePercentage >= 80).length;
  }

  get exceededCount(): number {
    return this.budgets.filter(b => b.usagePercentage !== undefined && b.usagePercentage >= 100).length;
  }

  // Definição das colunas para a tabela
  columns: ColumnDefinition[] = [
    { key: 'categoryName', header: 'Categoria', type: 'text', sortable: true },
    { key: 'amount', header: 'Valor', type: 'currency', sortable: true, width: '120px' },
    { key: 'period', header: 'Período', type: 'text', width: '100px' },
    { key: 'dateRange', header: 'Período Vigente', type: 'text', width: '180px' },
    { key: 'usage', header: 'Uso', type: 'custom', width: '150px' },
    { key: 'status', header: 'Status', type: 'custom', width: '100px' }
  ];

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserCategories();
    this.loadBudgets();
  }

  loadUserCategories(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.categoryService.getCategoriesByUser(currentUser.id).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  loadBudgets(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.budgetService.getBudgetsByUser(currentUser.id).subscribe({
      next: (budgets) => {
        this.budgets = this.enrichBudgetsWithUsage(budgets);
        this.activeBudgets = this.budgets.filter(budget => budget.isActive);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar orçamentos:', error);
        this.loading = false;
      }
    });
  }

  // Enriquecer orçamentos com dados de uso
  private enrichBudgetsWithUsage(budgets: Budget[]): Budget[] {
    return budgets.map(budget => {
      // Em uma implementação real, buscaríamos o uso atual da API
      // Por enquanto, simulamos um valor aleatório para demonstração
      const currentSpending = Math.random() * budget.amount;
      const usagePercentage = (currentSpending / budget.amount) * 100;
      
      return {
        ...budget,
        currentSpending,
        usagePercentage
      };
    });
  }

  onAddBudget(): void {
    const dialogRef = this.dialog.open(BudgetFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { 
        budget: null,
        categories: this.categories 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBudgets();
        this.showSuccess('Orçamento criado com sucesso!');
      }
    });
  }

  onEditBudget(budget: Budget): void {
    const dialogRef = this.dialog.open(BudgetFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { 
        budget: budget,
        categories: this.categories 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBudgets();
        this.showSuccess('Orçamento atualizado com sucesso!');
      }
    });
  }

  onDeleteBudget(budget: Budget): void {
    if (confirm(`Tem certeza que deseja excluir o orçamento para "${budget.categoryName}"?`)) {
      this.budgetService.deleteBudget(budget.id).subscribe({
        next: () => {
          this.loadBudgets();
          this.showSuccess('Orçamento excluído com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir orçamento:', error);
          this.showError('Erro ao excluir orçamento');
        }
      });
    }
  }

  onViewBudget(budget: Budget): void {
    // Implementar visualização detalhada se necessário
    console.log('Visualizar orçamento:', budget);
  }

  getDisplayedBudgets(): Budget[] {
    return this.selectedTab === 0 ? this.budgets : this.activeBudgets;
  }

  getPeriodLabel(period: BudgetPeriod): string {
    const periodObj = BUDGET_PERIODS.find(p => p.value === period);
    return periodObj ? periodObj.label : 'Desconhecido';
  }

  getUsageColor(percentage: number): string {
    if (percentage >= 100) return 'warn';
    if (percentage >= 80) return 'accent';
    return 'primary';
  }

  getStatusColor(budget: Budget): string {
    if (!budget.isActive) return '';
    if (budget.usagePercentage && budget.usagePercentage >= 100) return 'warn';
    if (budget.usagePercentage && budget.usagePercentage >= 80) return 'accent';
    return 'primary';
  }

  getStatusText(budget: Budget): string {
    if (!budget.isActive) return 'Inativo';
    if (budget.usagePercentage && budget.usagePercentage >= 100) return 'Estourado';
    if (budget.usagePercentage && budget.usagePercentage >= 80) return 'Próximo do limite';
    return 'Dentro do limite';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatDateRange(startDate: Date, endDate: Date): string {
    return `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`;
  }

  refreshData(): void {
    this.loadBudgets();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
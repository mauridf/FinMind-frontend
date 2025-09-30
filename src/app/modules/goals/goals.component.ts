import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GoalService } from '../../core/services/goal.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  Goal, 
  GoalType, 
  PriorityLevel, 
  GOAL_TYPES, 
  PRIORITY_LEVELS 
} from '../../core/models/goal.model';
import { ColumnDefinition } from '../../shared/components/data-table/data-table.component';
import { GoalFormComponent } from './goal-form/goal-form.component';
import { GoalProgressDialogComponent } from './goal-progress-dialog/goal-progress-dialog.component';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  activeGoals: Goal[] = [];
  completedGoals: Goal[] = [];
  loading = false;
  selectedTab = 0; // 0 = Todas, 1 = Ativas, 2 = Concluídas

  // Propriedades computadas para estatísticas
  get totalGoalsCount(): number {
    return this.goals.length;
  }

  get activeGoalsCount(): number {
    return this.activeGoals.length;
  }

  get completedGoalsCount(): number {
    return this.completedGoals.length;
  }

  get nearDueDateCount(): number {
    return this.goals.filter(goal => goal.isNearDueDate && !goal.isCompleted).length;
  }

  // Definição das colunas para a tabela
  columns: ColumnDefinition[] = [
    { key: 'name', header: 'Meta', type: 'text', sortable: true },
    { key: 'type', header: 'Tipo', type: 'custom', width: '120px' },
    { key: 'targetAmount', header: 'Valor Meta', type: 'currency', width: '120px' },
    { key: 'progress', header: 'Progresso', type: 'custom', width: '200px' },
    { key: 'targetDate', header: 'Prazo', type: 'date', width: '100px' },
    { key: 'priority', header: 'Prioridade', type: 'custom', width: '100px' },
    { key: 'status', header: 'Status', type: 'custom', width: '100px' }
  ];

  constructor(
    private goalService: GoalService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.goalService.getGoalsByUser(currentUser.id).subscribe({
      next: (goals) => {
        this.goals = goals;
        this.activeGoals = goals.filter(goal => !goal.isCompleted);
        this.completedGoals = goals.filter(goal => goal.isCompleted);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar metas:', error);
        this.loading = false;
      }
    });
  }

  onAddGoal(): void {
    const dialogRef = this.dialog.open(GoalFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { goal: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGoals();
        this.showSuccess('Meta criada com sucesso!');
      }
    });
  }

  onEditGoal(goal: Goal): void {
    const dialogRef = this.dialog.open(GoalFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { goal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGoals();
        this.showSuccess('Meta atualizada com sucesso!');
      }
    });
  }

  onUpdateProgress(goal: Goal): void {
    const dialogRef = this.dialog.open(GoalProgressDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: { goal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGoals();
        this.showSuccess('Progresso atualizado com sucesso!');
      }
    });
  }

  onCompleteGoal(goal: Goal): void {
    if (confirm(`Marcar a meta "${goal.name}" como concluída?`)) {
      this.goalService.completeGoal(goal.id).subscribe({
        next: () => {
          this.loadGoals();
          this.showSuccess('Meta marcada como concluída!');
        },
        error: (error) => {
          console.error('Erro ao concluir meta:', error);
          this.showError('Erro ao concluir meta');
        }
      });
    }
  }

  onDeleteGoal(goal: Goal): void {
    if (confirm(`Tem certeza que deseja excluir a meta "${goal.name}"?`)) {
      this.goalService.deleteGoal(goal.id).subscribe({
        next: () => {
          this.loadGoals();
          this.showSuccess('Meta excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir meta:', error);
          this.showError('Erro ao excluir meta');
        }
      });
    }
  }

  onViewGoal(goal: Goal): void {
    // Implementar visualização detalhada se necessário
    console.log('Visualizar meta:', goal);
  }

  getDisplayedGoals(): Goal[] {
    switch (this.selectedTab) {
      case 0: return this.goals;
      case 1: return this.activeGoals;
      case 2: return this.completedGoals;
      default: return this.goals;
    }
  }

  getGoalTypeLabel(type: GoalType): string {
    const typeObj = GOAL_TYPES.find(t => t.value === type);
    return typeObj ? typeObj.label : 'Desconhecido';
  }

  getGoalTypeIcon(type: GoalType): string {
    const typeObj = GOAL_TYPES.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'flag';
  }

  getGoalTypeColor(type: GoalType): string {
    const typeObj = GOAL_TYPES.find(t => t.value === type);
    return typeObj ? typeObj.color : '#666';
  }

  getPriorityLabel(priority: PriorityLevel): string {
    const priorityObj = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : 'Desconhecida';
  }

  getPriorityColor(priority: PriorityLevel): string {
    const priorityObj = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#666';
  }

  getPriorityIcon(priority: PriorityLevel): string {
    const priorityObj = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityObj ? priorityObj.icon : 'circle';
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return 'primary';
    if (progress >= 75) return 'accent';
    if (progress >= 50) return '';
    return 'warn';
  }

  getStatusColor(goal: Goal): string {
    if (goal.isCompleted) return 'primary';
    if (goal.isNearDueDate) return 'warn';
    return '';
  }

  getStatusText(goal: Goal): string {
    if (goal.isCompleted) return 'Concluída';
    if (goal.isNearDueDate) return 'Próximo do prazo';
    return 'Em andamento';
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  refreshData(): void {
    this.loadGoals();
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
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetService } from '../../../core/services/budget.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  Budget, 
  CreateBudgetRequest, 
  UpdateBudgetRequest, 
  BudgetPeriod,
  BUDGET_PERIODS,
  calculateEndDate,
  AlertSettings 
} from '../../../core/models/budget.model';
import { Category } from '../../../core/models/category.model';

export interface BudgetFormData {
  budget: Budget | null;
  categories: Category[];
}

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  isEdit = false;
  loading = false;

  budgetPeriods = BUDGET_PERIODS;
  expenseCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<BudgetFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: BudgetFormData
  ) {
    this.isEdit = !!data.budget;
    
    // Filtrar apenas categorias de despesa
    this.expenseCategories = data.categories.filter(cat => cat.type === 2);
    
    this.budgetForm = this.fb.group({
      categoryId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      period: [BudgetPeriod.Monthly, Validators.required],
      startDate: [new Date(), Validators.required],
      alertsEnabled: [true],
      alertThreshold: [80, [Validators.min(1), Validators.max(100)]]
    });

    if (this.isEdit && data.budget) {
      this.populateForm(data.budget);
    }

    // Calcular data final quando período ou data inicial mudar
    this.budgetForm.get('period')?.valueChanges.subscribe(() => this.calculateEndDate());
    this.budgetForm.get('startDate')?.valueChanges.subscribe(() => this.calculateEndDate());
  }

  ngOnInit(): void {
    this.calculateEndDate();
  }

  populateForm(budget: Budget): void {
    this.budgetForm.patchValue({
      categoryId: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      startDate: new Date(budget.startDate),
      alertsEnabled: budget.alerts.enabled,
      alertThreshold: budget.alerts.threshold
    });
  }

  calculateEndDate(): void {
    const period = this.budgetForm.get('period')?.value;
    const startDate = this.budgetForm.get('startDate')?.value;
    
    if (period && startDate) {
      const endDate = calculateEndDate(new Date(startDate), period);
      // Não atualizamos o form diretamente, apenas mostramos visualmente
    }
  }

  getCalculatedEndDate(): Date {
    const period = this.budgetForm.get('period')?.value;
    const startDate = this.budgetForm.get('startDate')?.value;
    
    if (period && startDate) {
      return calculateEndDate(new Date(startDate), period);
    }
    
    return new Date();
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.showError('Usuário não autenticado');
        this.loading = false;
        return;
      }

      const formValue = this.budgetForm.value;
      const endDate = this.getCalculatedEndDate();

      const alertSettings: AlertSettings = {
        enabled: formValue.alertsEnabled,
        threshold: formValue.alertThreshold,
        notified: false
      };

      if (this.isEdit && this.data.budget) {
        const updateRequest: UpdateBudgetRequest = {
          amount: formValue.amount,
          alerts: alertSettings
        };

        this.budgetService.updateBudget(this.data.budget.id, updateRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao atualizar orçamento:', error);
              this.showError('Erro ao atualizar orçamento');
              this.loading = false;
            }
          });
      } else {
        const createRequest: CreateBudgetRequest = {
          categoryId: formValue.categoryId,
          amount: formValue.amount,
          period: formValue.period,
          startDate: new Date(formValue.startDate),
          endDate: endDate,
          alerts: alertSettings
        };

        this.budgetService.createBudget(currentUser.id, createRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao criar orçamento:', error);
              this.showError('Erro ao criar orçamento');
              this.loading = false;
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getCategoryName(categoryId: string): string {
    const category = this.expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  }

  getPeriodDescription(period: BudgetPeriod): string {
    const periodObj = this.budgetPeriods.find(p => p.value === period);
    return periodObj ? periodObj.description : '';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
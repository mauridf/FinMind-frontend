import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GoalService } from '../../../core/services/goal.service';
import { Goal, UpdateProgressRequest } from '../../../core/models/goal.model';

export interface GoalProgressDialogData {
  goal: Goal;
}

@Component({
  selector: 'app-goal-progress-dialog',
  templateUrl: './goal-progress-dialog.component.html',
  styleUrls: ['./goal-progress-dialog.component.scss']
})
export class GoalProgressDialogComponent {
  progressForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private dialogRef: MatDialogRef<GoalProgressDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: GoalProgressDialogData
  ) {
    this.progressForm = this.fb.group({
      amount: [data.goal.currentAmount, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.progressForm.valid) {
      this.loading = true;
      const amount = this.progressForm.get('amount')?.value;

      const progressRequest: UpdateProgressRequest = {
        amount: amount
      };

      this.goalService.updateGoalProgress(this.data.goal.id, progressRequest)
        .subscribe({
          next: () => {
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erro ao atualizar progresso:', error);
            this.showError('Erro ao atualizar progresso');
            this.loading = false;
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getMaxAmount(): number {
    return this.data.goal.targetAmount;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
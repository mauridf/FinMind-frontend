import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GoalService } from '../../../core/services/goal.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  Goal, 
  CreateGoalRequest, 
  UpdateGoalRequest, 
  GoalType,
  PriorityLevel,
  GOAL_TYPES,
  PRIORITY_LEVELS 
} from '../../../core/models/goal.model';

export interface GoalFormData {
  goal: Goal | null;
}

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.scss']
})
export class GoalFormComponent implements OnInit {
  goalForm: FormGroup;
  isEdit = false;
  loading = false;

  goalTypes = GOAL_TYPES;
  priorityLevels = PRIORITY_LEVELS;

  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<GoalFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: GoalFormData
  ) {
    this.isEdit = !!data.goal;
    
    this.goalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      targetAmount: [0, [Validators.required, Validators.min(0.01)]],
      targetDate: [new Date(), Validators.required],
      type: [GoalType.Savings, Validators.required],
      priority: [PriorityLevel.Medium, Validators.required]
    });

    if (this.isEdit && data.goal) {
      this.populateForm(data.goal);
    }
  }

  ngOnInit(): void {}

  populateForm(goal: Goal): void {
    this.goalForm.patchValue({
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetDate: new Date(goal.targetDate),
      type: goal.type,
      priority: goal.priority
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.showError('Usuário não autenticado');
        this.loading = false;
        return;
      }

      const formValue = this.goalForm.value;

      if (this.isEdit && this.data.goal) {
        const updateRequest: UpdateGoalRequest = {
          name: formValue.name,
          targetAmount: formValue.targetAmount,
          targetDate: new Date(formValue.targetDate),
          priority: formValue.priority
        };

        this.goalService.updateGoal(this.data.goal.id, updateRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao atualizar meta:', error);
              this.showError('Erro ao atualizar meta');
              this.loading = false;
            }
          });
      } else {
        const createRequest: CreateGoalRequest = {
          name: formValue.name,
          targetAmount: formValue.targetAmount,
          targetDate: new Date(formValue.targetDate),
          type: formValue.type,
          priority: formValue.priority
        };

        this.goalService.createGoal(currentUser.id, createRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao criar meta:', error);
              this.showError('Erro ao criar meta');
              this.loading = false;
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Corrigir os tipos dos parâmetros para number
  getGoalTypeLabel(type: GoalType): string {
    const typeObj = this.goalTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : '';
  }

  getGoalTypeIcon(type: GoalType): string {
    const typeObj = this.goalTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'flag';
  }

  getGoalTypeColor(type: GoalType): string {
    const typeObj = this.goalTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : '#666';
  }

  getPriorityLabel(priority: PriorityLevel): string {
    const priorityObj = this.priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : '';
  }

  getPriorityIcon(priority: PriorityLevel): string {
    const priorityObj = this.priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.icon : 'circle';
  }

  getPriorityColor(priority: PriorityLevel): string {
    const priorityObj = this.priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#666';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
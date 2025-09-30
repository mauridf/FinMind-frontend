import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  TransactionType,
  AVAILABLE_ICONS,
  AVAILABLE_COLORS 
} from '../../../core/models/category.model';

export interface CategoryFormData {
  category: Category | null;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEdit = false;
  loading = false;

  transactionTypes = [
    { value: TransactionType.Income, label: 'Receita' },
    { value: TransactionType.Expense, label: 'Despesa' }
  ];

  availableIcons = AVAILABLE_ICONS;
  availableColors = AVAILABLE_COLORS;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormData
  ) {
    this.isEdit = !!data.category;
    
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: [TransactionType.Expense, Validators.required],
      color: ['#2196F3', Validators.required],
      icon: ['category', Validators.required],
      budgetLimit: [null]
    });

    if (this.isEdit && data.category) {
      this.populateForm(data.category);
    }
  }

  ngOnInit(): void {}

  populateForm(category: Category): void {
    this.categoryForm.patchValue({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      budgetLimit: category.budgetLimit || null
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.showError('Usuário não autenticado');
        this.loading = false;
        return;
      }

      const formValue = this.categoryForm.value;

      if (this.isEdit && this.data.category) {
        const updateRequest: UpdateCategoryRequest = {
          name: formValue.name,
          color: formValue.color,
          icon: formValue.icon,
          budgetLimit: formValue.budgetLimit || undefined
        };

        this.categoryService.updateCategory(this.data.category.id, updateRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao atualizar categoria:', error);
              this.showError('Erro ao atualizar categoria');
              this.loading = false;
            }
          });
      } else {
        const createRequest: CreateCategoryRequest = {
          name: formValue.name,
          type: formValue.type,
          color: formValue.color,
          icon: formValue.icon,
          budgetLimit: formValue.budgetLimit || undefined
        };

        this.categoryService.createCategory(currentUser.id, createRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao criar categoria:', error);
              this.showError('Erro ao criar categoria');
              this.loading = false;
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
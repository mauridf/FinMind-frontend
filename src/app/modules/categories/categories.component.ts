import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Category, TransactionType, DEFAULT_CATEGORIES } from '../../core/models/category.model';
import { ColumnDefinition } from '../../shared/components/data-table/data-table.component';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  defaultCategories: Category[] = DEFAULT_CATEGORIES;
  loading = false;
  selectedTab = 0; // 0 = Minhas Categorias, 1 = Categorias Padrão

  // Definição das colunas para a tabela
  columns: ColumnDefinition[] = [
    { key: 'icon', header: 'Ícone', type: 'custom', width: '60px' },
    { key: 'name', header: 'Nome', type: 'text', sortable: true },
    { key: 'type', header: 'Tipo', type: 'text', width: '100px' },
    { key: 'color', header: 'Cor', type: 'custom', width: '80px' },
    { key: 'budgetLimit', header: 'Limite Orçamento', type: 'currency', width: '140px' },
    { key: 'isDefault', header: 'Padrão', type: 'boolean', width: '80px' }
  ];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserCategories();
  }

  loadUserCategories(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.categoryService.getCategoriesByUser(currentUser.id).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.showError('Erro ao carregar categorias');
        this.loading = false;
      }
    });
  }

  onAddCategory(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserCategories();
        this.showSuccess('Categoria criada com sucesso!');
      }
    });
  }

  onEditCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserCategories();
        this.showSuccess('Categoria atualizada com sucesso!');
      }
    });
  }

  onDeleteCategory(category: Category): void {
    if (category.isDefault) {
      this.showError('Categorias padrão do sistema não podem ser excluídas');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadUserCategories();
          this.showSuccess('Categoria excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
          this.showError('Erro ao excluir categoria');
        }
      });
    }
  }

  onViewCategory(category: Category): void {
    // Implementar visualização detalhada se necessário
    console.log('Visualizar categoria:', category);
  }

  getTransactionTypeLabel(type: TransactionType): string {
    return type === TransactionType.Income ? 'Receita' : 'Despesa';
  }

  getTransactionTypeColor(type: TransactionType): string {
    return type === TransactionType.Income ? 'primary' : 'warn';
  }

  getDisplayedCategories(): Category[] {
    return this.selectedTab === 0 ? this.categories : this.defaultCategories;
  }

  canEditCategory(category: Category): boolean {
    return !category.isDefault;
  }

  canDeleteCategory(category: Category): boolean {
    return !category.isDefault;
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
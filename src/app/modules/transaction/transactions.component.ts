import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { Transaction, TransactionType, DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../../core/models/transaction.model';
import { ColumnDefinition } from '../../shared/components/data-table/data-table.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  @ViewChild('dataTable') dataTable: any;

  transactions: Transaction[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  // Filtros - corrigir tipagem
  filterType: TransactionType | null = null;
  filterCategory = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Definição das colunas para a tabela
  columns: ColumnDefinition[] = [
    { key: 'date', header: 'Data', type: 'date', sortable: true, width: '120px' },
    { key: 'description', header: 'Descrição', type: 'text', sortable: true },
    { key: 'category', header: 'Categoria', type: 'text', sortable: true, width: '150px' },
    { key: 'paymentMethod', header: 'Método Pag.', type: 'text', width: '140px' },
    { 
      key: 'amount', 
      header: 'Valor', 
      type: 'currency', 
      sortable: true, 
      width: '120px' 
    },
    { key: 'type', header: 'Tipo', type: 'text', width: '100px' }
  ];

  categories = DEFAULT_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.transactionService.getTransactionsByUser(
      currentUser.id,
      this.startDate || undefined,
      this.endDate || undefined
    ).subscribe({
      next: (transactions) => {
        // Aplicar filtros locais
        let filteredTransactions = transactions;
        
        if (this.filterType) {
          filteredTransactions = filteredTransactions.filter(t => t.type === this.filterType);
        }
        
        if (this.filterCategory) {
          filteredTransactions = filteredTransactions.filter(t => 
            t.category.toLowerCase().includes(this.filterCategory.toLowerCase())
          );
        }

        this.transactions = filteredTransactions;
        this.totalItems = filteredTransactions.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.showError('Erro ao carregar transações');
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAddTransaction(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { transaction: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
        this.showSuccess('Transação criada com sucesso!');
      }
    });
  }

  onEditTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
        this.showSuccess('Transação atualizada com sucesso!');
      }
    });
  }

  onDeleteTransaction(transaction: Transaction): void {
    if (confirm(`Tem certeza que deseja excluir a transação "${transaction.description}"?`)) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          this.loadTransactions();
          this.showSuccess('Transação excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir transação:', error);
          this.showError('Erro ao excluir transação');
        }
      });
    }
  }

  onViewTransaction(transaction: Transaction): void {
    // Implementar visualização detalhada se necessário
    console.log('Visualizar transação:', transaction);
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filterType = null;
    this.filterCategory = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  get paginatedTransactions(): Transaction[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.transactions.slice(startIndex, startIndex + this.pageSize);
  }

  getTransactionTypeLabel(type: TransactionType): string {
    return type === TransactionType.Income ? 'Receita' : 'Despesa';
  }

  getTransactionTypeColor(type: TransactionType): string {
    return type === TransactionType.Income ? 'primary' : 'warn';
  }

  // Métodos auxiliares para os datepickers
  onStartDateChange(event: any): void {
    this.startDate = event.value;
  }

  onEndDateChange(event: any): void {
    this.endDate = event.value;
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
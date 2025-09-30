import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest,
  TransactionType,
  DEFAULT_CATEGORIES,
  PAYMENT_METHODS 
} from '../../../core/models/transaction.model';

export interface TransactionFormData {
  transaction: Transaction | null;
}

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isEdit = false;
  loading = false;

  transactionTypes = [
    { value: TransactionType.Income, label: 'Receita', icon: 'trending_up' },
    { value: TransactionType.Expense, label: 'Despesa', icon: 'trending_down' }
  ];

  categories = DEFAULT_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<TransactionFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: TransactionFormData
  ) {
    this.isEdit = !!data.transaction;
    
    this.transactionForm = this.fb.group({
      type: [TransactionType.Expense, Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      subcategory: [''],
      paymentMethod: ['', Validators.required],
      date: [new Date(), Validators.required],
      isRecurring: [false],
      recurringFrequency: [null]
    });

    if (this.isEdit && data.transaction) {
      this.populateForm(data.transaction);
    }
  }

  ngOnInit(): void {}

  populateForm(transaction: Transaction): void {
    this.transactionForm.patchValue({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      subcategory: transaction.subcategory || '',
      paymentMethod: transaction.paymentMethod,
      date: transaction.date,
      isRecurring: transaction.isRecurring || false,
      recurringFrequency: transaction.recurringFrequency || null
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.showError('Usuário não autenticado');
        this.loading = false;
        return;
      }

      const formValue = this.transactionForm.value;

      if (this.isEdit && this.data.transaction) {
        const updateRequest: UpdateTransactionRequest = {
          description: formValue.description,
          category: formValue.category,
          amount: formValue.amount,
          subcategory: formValue.subcategory || undefined,
          paymentMethod: formValue.paymentMethod,
          date: formValue.date
        };

        this.transactionService.updateTransaction(this.data.transaction.id, updateRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao atualizar transação:', error);
              this.showError('Erro ao atualizar transação');
              this.loading = false;
            }
          });
      } else {
        const createRequest: CreateTransactionRequest = {
          type: formValue.type,
          amount: formValue.amount,
          description: formValue.description,
          category: formValue.category,
          subcategory: formValue.subcategory || undefined,
          paymentMethod: formValue.paymentMethod,
          date: formValue.date,
          isRecurring: formValue.isRecurring,
          recurringFrequency: formValue.recurringFrequency || undefined
        };

        this.transactionService.createTransaction(currentUser.id, createRequest)
          .subscribe({
            next: () => {
              this.loading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Erro ao criar transação:', error);
              this.showError('Erro ao criar transação');
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
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  paymentMethod: string;
  date: Date;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  tags?: string[];
  location?: LocationInfo;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  paymentMethod: string;
  date: Date;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  tags?: string[];
  location?: LocationInfo;
}

export interface UpdateTransactionRequest {
  description: string;
  category: string;
  amount: number;
  subcategory?: string;
  paymentMethod?: string;
  date?: Date;
}

export interface LocationInfo {
  merchant: string;
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface SpendingByCategory {
  [category: string]: number;
}

export enum TransactionType {
  Income = 1,
  Expense = 2
}

export enum RecurringFrequency {
  Weekly = 1,
  Monthly = 2,
  Yearly = 3
}

export enum TransactionStatus {
  Pending = 1,
  Completed = 2,
  Cancelled = 3
}

// Para uso nos selects
export const TRANSACTION_TYPES = [
  { value: TransactionType.Income, label: 'Receita', icon: 'trending_up', color: 'primary' },
  { value: TransactionType.Expense, label: 'Despesa', icon: 'trending_down', color: 'warn' }
];

export const PAYMENT_METHODS = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência Bancária',
  'Boleto',
  'Outro'
];

export const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Salário',
  'Investimentos',
  'Outros'
];
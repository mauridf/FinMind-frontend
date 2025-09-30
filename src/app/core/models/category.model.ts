export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  parentCategoryId?: string;
  budgetLimit?: number;
  isDefault: boolean;
  createdAt: Date;
  isParentCategory?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  parentCategoryId?: string;
  budgetLimit?: number;
}

export interface UpdateCategoryRequest {
  name: string;
  color: string;
  icon: string;
  budgetLimit?: number;
}

export enum TransactionType {
  Income = 1,
  Expense = 2
}

// Categorias padrão do sistema
export const DEFAULT_CATEGORIES: Category[] = [
  // Receitas
  { id: '1', userId: 'system', name: 'Salário', type: TransactionType.Income, color: '#4CAF50', icon: 'work', isDefault: true, createdAt: new Date() },
  { id: '2', userId: 'system', name: 'Freelance', type: TransactionType.Income, color: '#8BC34A', icon: 'computer', isDefault: true, createdAt: new Date() },
  { id: '3', userId: 'system', name: 'Investimentos', type: TransactionType.Income, color: '#CDDC39', icon: 'trending_up', isDefault: true, createdAt: new Date() },
  { id: '4', userId: 'system', name: 'Presentes', type: TransactionType.Income, color: '#FFEB3B', icon: 'card_giftcard', isDefault: true, createdAt: new Date() },
  
  // Despesas
  { id: '5', userId: 'system', name: 'Alimentação', type: TransactionType.Expense, color: '#F44336', icon: 'restaurant', isDefault: true, createdAt: new Date() },
  { id: '6', userId: 'system', name: 'Transporte', type: TransactionType.Expense, color: '#E91E63', icon: 'directions_car', isDefault: true, createdAt: new Date() },
  { id: '7', userId: 'system', name: 'Moradia', type: TransactionType.Expense, color: '#9C27B0', icon: 'home', isDefault: true, createdAt: new Date() },
  { id: '8', userId: 'system', name: 'Saúde', type: TransactionType.Expense, color: '#673AB7', icon: 'local_hospital', isDefault: true, createdAt: new Date() },
  { id: '9', userId: 'system', name: 'Educação', type: TransactionType.Expense, color: '#3F51B5', icon: 'school', isDefault: true, createdAt: new Date() },
  { id: '10', userId: 'system', name: 'Lazer', type: TransactionType.Expense, color: '#2196F3', icon: 'sports_esports', isDefault: true, createdAt: new Date() },
  { id: '11', userId: 'system', name: 'Compras', type: TransactionType.Expense, color: '#03A9F4', icon: 'shopping_cart', isDefault: true, createdAt: new Date() },
  { id: '12', userId: 'system', name: 'Outros', type: TransactionType.Expense, color: '#607D8B', icon: 'category', isDefault: true, createdAt: new Date() }
];

// Ícones disponíveis para categorias
export const AVAILABLE_ICONS = [
  'home', 'work', 'restaurant', 'directions_car', 'local_hospital', 'school',
  'shopping_cart', 'sports_esports', 'flight', 'local_gas_station', 'wifi',
  'electric_bolt', 'water_drop', 'phone', 'tv', 'computer', 'book', 'fitness_center',
  'music_note', 'movie', 'beach_access', 'cake', 'card_giftcard', 'attach_money',
  'account_balance', 'trending_up', 'savings', 'payments', 'receipt'
];

// Cores disponíveis para categorias
export const AVAILABLE_COLORS = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#607D8B'
];
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  type: GoalType;
  priority: PriorityLevel;
  progress: number;
  isCompleted: boolean;
  isNearDueDate: boolean;
  daysRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  targetDate: Date;
  type: GoalType;
  priority: PriorityLevel;
}

export interface UpdateGoalRequest {
  name: string;
  targetAmount: number;
  targetDate: Date;
  priority: PriorityLevel;
}

export interface UpdateProgressRequest {
  amount: number;
}

export enum GoalType {
  Savings = 1,
  Investment = 2,
  DebtReduction = 3,
  Purchase = 4,
  Education = 5
}

export enum PriorityLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

// Para uso nos selects
export const GOAL_TYPES = [
  { value: GoalType.Savings, label: 'Poupança', icon: 'savings', color: '#4CAF50' },
  { value: GoalType.Investment, label: 'Investimento', icon: 'trending_up', color: '#2196F3' },
  { value: GoalType.DebtReduction, label: 'Redução de Dívidas', icon: 'money_off', color: '#FF9800' },
  { value: GoalType.Purchase, label: 'Compra', icon: 'shopping_cart', color: '#9C27B0' },
  { value: GoalType.Education, label: 'Educação', icon: 'school', color: '#3F51B5' }
];

export const PRIORITY_LEVELS = [
  { value: PriorityLevel.Low, label: 'Baixa', color: '#4CAF50', icon: 'low_priority' },
  { value: PriorityLevel.Medium, label: 'Média', color: '#FFC107', icon: 'priority' },
  { value: PriorityLevel.High, label: 'Alta', color: '#FF9800', icon: 'warning' },
  { value: PriorityLevel.Critical, label: 'Crítica', color: '#F44336', icon: 'error' }
];

// Helper para calcular dias restantes
export function calculateDaysRemaining(targetDate: Date): number {
  const today = new Date();
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Helper para verificar se está próximo do vencimento
export function isNearDueDate(targetDate: Date, threshold: number = 30): boolean {
  const daysRemaining = calculateDaysRemaining(targetDate);
  return daysRemaining <= threshold && daysRemaining > 0;
}
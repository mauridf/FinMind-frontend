export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  alerts: AlertSettings;
  createdAt: Date;
  isActive: boolean;
  currentSpending?: number; // Para uso interno no frontend
  usagePercentage?: number; // Para uso interno no frontend
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  alerts: AlertSettings;
}

export interface UpdateBudgetRequest {
  amount: number;
  alerts: AlertSettings;
}

export interface AlertSettings {
  enabled: boolean;
  threshold: number; // Porcentagem
  notified: boolean;
}

export enum BudgetPeriod {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Quarterly = 4,
  Yearly = 5
}

// Para uso nos selects
export const BUDGET_PERIODS = [
  { value: BudgetPeriod.Daily, label: 'Diário', description: 'Renova todo dia' },
  { value: BudgetPeriod.Weekly, label: 'Semanal', description: 'Renova toda semana' },
  { value: BudgetPeriod.Monthly, label: 'Mensal', description: 'Renova todo mês' },
  { value: BudgetPeriod.Quarterly, label: 'Trimestral', description: 'Renova a cada 3 meses' },
  { value: BudgetPeriod.Yearly, label: 'Anual', description: 'Renova todo ano' }
];

// Helper para calcular data final baseada no período
export function calculateEndDate(startDate: Date, period: BudgetPeriod): Date {
  const endDate = new Date(startDate);
  
  switch (period) {
    case BudgetPeriod.Daily:
      endDate.setDate(endDate.getDate() + 1);
      break;
    case BudgetPeriod.Weekly:
      endDate.setDate(endDate.getDate() + 7);
      break;
    case BudgetPeriod.Monthly:
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case BudgetPeriod.Quarterly:
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case BudgetPeriod.Yearly:
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
  }
  
  return endDate;
}
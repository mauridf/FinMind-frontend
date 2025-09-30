export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBudget: number;
  budgetUsagePercentage: number;
  totalTransactions: number;
  activeGoals: number;
  completedGoals: number;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface CashFlowProjection {
  date: Date;
  projectedBalance: number;
  expectedIncome: number;
  expectedExpenses: number;
}

export interface GoalProgress {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  daysRemaining: number;
  isOnTrack: boolean;
}

export interface BudgetStatus {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
}

export interface FinancialHealth {
  savingsRate: number;
  debtToIncome: number;
  emergencyFund: number;
  investmentRatio: number;
  overallScore: number;
}

export interface QuickStats {
  averageMonthlySpending: number;
  largestExpense: number;
  mostUsedCategory: string;
  transactionsThisMonth: number;
}
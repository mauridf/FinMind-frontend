export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserDetail {
  id: string;
  email: string;
  personalInfo: PersonalInfo;
  financialSettings: FinancialSettings;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface PersonalInfo {
  name: string;
  cpf: string;
  phone: string;
  birthDate?: Date;
}

export interface FinancialSettings {
  defaultCurrency: string;
  monthlyIncome: number;
  financialGoals: string[];
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  theme: string;
  timeZone: string;
}

// Auth Models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  cpf: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
}
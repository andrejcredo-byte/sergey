export type ProjectStatus = 
  | 'new'
  | 'negotiation'
  | 'agreed'
  | 'waiting_payment'
  | 'in_progress'
  | 'partially_completed'
  | 'completed'
  | 'paid'
  | 'frozen'
  | 'cancelled';

export interface ProjectStage {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: number;
  url: string;
}

export interface Project {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  description: string;
  clientName: string;
  clientPhone: string;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  progress: number; // 0-100
  estimatedBudget: number;
  totalIncome: number;
  totalExpense: number;
  createdAt: string;
  teamIds: string[]; // List of assigned users/workers
  stages: ProjectStage[];
  documents: ProjectDocument[];
}

export type TransactionType = 'income' | 'expense';
export type ExpenseCategory = 'salary' | 'materials' | 'partner' | 'logistics' | 'equipment' | 'other';

export interface Transaction {
  id: string;
  projectId: string;
  ownerId?: string;
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory;
  date: string;
  description: string;
  workerId?: string; // which worker was paid
}

export interface Material {
  id: string;
  projectId: string;
  ownerId?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit?: number;
  totalPrice?: number;
  status: 'to_buy' | 'ordered' | 'partial' | 'bought' | 'delivering' | 'delivered';
  supplier?: string;
  purchaseDate?: string;
  buyerId?: string;
}

export interface User {
  id: string;
  ownerId?: string;
  name: string;
  role: 'owner' | 'admin' | 'manager' | 'accountant' | 'partner' | 'worker';
  email?: string;
  phone?: string;
  avatar?: string;
  specialization?: string;
}

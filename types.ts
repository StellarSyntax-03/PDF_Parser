export interface Transaction {
  date: string;
  description: string;
  amount: number;
}

export interface StatementData {
  issuerName: string;
  cardVariant: string;
  cardLast4: string;
  billingCycle: string;
  dueDate: string;
  totalBalance: number;
  transactions: Transaction[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface CobrancaResponse {
  id: string;
  customerId: string;
  dateCreated: string;
  dueDate: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  description: string;
  canBePaidAfterDueDate: boolean;
  invoiceUrl: string;
  invoiceNumber: string;
  deleted: boolean;

  }
  
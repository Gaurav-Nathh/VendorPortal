export interface Invoice {
    no: string;
    date: Date;
    value: number;
    balance: number;
    status: 'Paid' | 'Partially Paid' | 'Unpaid';
    dueDate: Date;
  }
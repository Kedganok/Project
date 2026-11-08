export type NavTab = 'dashboard' | 'transfers' | 'requests' | 'pay-cycles' | 'reports';

export interface TransferItem {
  id: string;
  date: string;
  refNo: string;
  recipient: string;
  channel: string;
  amount: number;
  status: 'pending' | 'approved';
}

export interface PaymentRequestItem {
  id: string;
  empId: string;
  empName: string;
  amount: number;
  status: 'paid';
  dueDate: string;
}

export interface ChannelReportItem {
  channel: string;
  count: number;
  preTaxAmount: number;
  whtAmount: number;
  vatAmount: number;
  netAmount: number;
}
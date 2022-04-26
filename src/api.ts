import axios from "axios";

const request = axios.create({
  timeout: 15000,
  headers: {},
  baseURL: "http://0.0.0.0:50420"
});

export interface DaySummary {
  /** Day of month */
  day: number;
  /** Total value of all transactions of the day */
  value: number;
}

export interface Month {
  /** Month ID */
  _id: number;
  /** Year */
  year: number;
  /** Month */
  month: number;
  /** Month start date */
  dateFrom: Date;
  /** Month end date */
  dateTo: Date;
  /** Opening balance in cent */
  openingBalance: number;
  /** Monetary value in cent */
  closingBalance: number;
  /** Total value of all transactions of the month */
  value: number;
  /** Days */
  days: DaySummary[];
}

export interface Transaction {
  /** Transaction ID */
  _id?: number;
  /** Monetary value in cent. */
  value: number;
  /** Transaction text label. */
  label?: string;
  /** Transaction confirmed? */
  confirmed?: Boolean;
  /** Category */
  category?: number;
  /** Transaction date. */
  transactionDate: Date,
  /** Custom description. */
  description?: string;
  /** Book ID */
  book?: number;
}

/**
 * Get a month summary.
 * @param year 1900 - 2199
 * @param month 1 - 12
 */
export async function getMonth(year: number, month: number) {
  const monthString = month < 10? `0${month}` : String(month);
  const yearMonthString = `${year}-${monthString}`;
  const url = `/months/${yearMonthString}`;
  return request.get<Month>(url);
}

/** Get all transactions by date */
export async function getTransactionsByDate(date: Date) {
  return request.get<Transaction[]>(`/transactions`, {params: {day: date}});
}

/** Get one transaction */
export async function getTransaction(id: number) {
  return request.get<Transaction>(`/transactions/${id}`);
}

/** Post a new transaction */
export async function postTransaction(data: Transaction) {
  return request.post(`/transactions`, data);
}

/** Update a transaciton */
export async function patchTransaction(id: number, data: Transaction) {
  return request.patch(`/transactions/${id}`, data);
}

/** Delete a transaction */
export async function deleteTransaction(id: number) {
  return request.delete(`/transactions/${id}`);
}
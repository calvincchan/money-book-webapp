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
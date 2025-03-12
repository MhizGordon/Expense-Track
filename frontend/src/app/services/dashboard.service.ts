import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/v1'; // Your API base URL

  constructor(private http: HttpClient) {}

  getIncomeData(months: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/income?months=${months}`);
  }

  getExpenseData(months: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expense?months=${months}`);
  }

  getSavingsData(months: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/savings?months=${months}`);
  }
}

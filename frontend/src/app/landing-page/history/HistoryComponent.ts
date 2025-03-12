import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';
import { HistoryService } from '../../services/history.service';
import { IncomeService } from '../../services/income.service';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, FormsModule, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [IncomeService, ExpenseService]
})
export class HistoryComponent implements OnInit {
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  incomes: any[] = [];
  expenses: any[] = [];
  filteredTransactions: any[] = [];
  selectedMonth: string = '';
  totalIncome = 0;
  totalExpenses = 0;
  transactionChart: Chart | undefined;
  categories: { [key: string]: number; } = {};

  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private historyService: HistoryService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  // Fetch incomes and expenses from the backend
  fetchTransactions(): void {
    this.incomeService.getIncomes().subscribe({
      next: (incomes) => {
        this.incomes = Array.isArray(incomes) ? incomes : []; // Ensure it's an array
        this.expenseService.getExpenses().subscribe({
          next: (expenses) => {
            this.expenses = Array.isArray(expenses) ? expenses : []; // Ensure it's an array
            this.onMonthChange(); // Filter transactions for the current month
          },
          error: (error) => {
            console.error('Error fetching expenses:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching incomes:', error);
      }
    });
  }

  // Filter transactions by selected month
  onMonthChange(): void {
    const selectedMonthIndex = this.months.indexOf(this.selectedMonth); // Get the index of the selected month
    const filteredIncomes = this.incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === selectedMonthIndex;
    });
    const filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === selectedMonthIndex;
    });

    // Combine incomes and expenses
    this.filteredTransactions = [...filteredIncomes, ...filteredExpenses];

    // Remove duplicates based on date, type, and amount
    this.filteredTransactions = this.removeDuplicates(this.filteredTransactions);

    this.calculateTotals(); // Recalculate totals for the selected month
    this.calculateCategories(); // Recalculate categories for the selected month
    this.renderChart(); // Re-render the chart for the selected month
  }

  // Remove duplicate transactions
  removeDuplicates(transactions: any[]): any[] {
    const uniqueTransactions = transactions.reduce((acc, current) => {
      const duplicate = acc.find(
        (item: any) => item.date === current.date &&
          (item.source === current.source || item.expenseType === current.expenseType) &&
          (item.amount === current.amount || item.expenseAmount === current.expenseAmount)
      );
      if (!duplicate) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueTransactions;
  }

  // Calculate total income and expenses
  calculateTotals(): void {
    this.totalIncome = this.filteredTransactions
      .filter(transaction => transaction.source) // Filter incomes
      .reduce((sum, income) => sum + income.amount, 0);

    this.totalExpenses = this.filteredTransactions
      .filter(transaction => transaction.expenseType) // Filter expenses
      .reduce((sum, expense) => sum + expense.expenseAmount, 0);
  }

  // Calculate categories for the pie chart
  calculateCategories(): void {
    this.categories = {};

    // Group incomes by source
    this.filteredTransactions
      .filter(transaction => transaction.source) // Filter incomes
      .forEach(income => {
        const category = income.source; // Use 'source' as the category key
        this.categories[category] = (this.categories[category] || 0) + income.amount; // Use 'amount'
      });

    // Group expenses by expenseType
    this.filteredTransactions
      .filter(transaction => transaction.expenseType) // Filter expenses
      .forEach(expense => {
        const category = expense.expenseType; // Use 'expenseType' as the category key
        this.categories[category] = (this.categories[category] || 0) + expense.expenseAmount; // Use 'expenseAmount'
      });
  }

  // Render the pie chart
  renderChart(): void {
    const ctx = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.transactionChart) {
        this.transactionChart.destroy(); // Destroy existing chart instance
      }

      this.transactionChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(this.categories), // Category names
          datasets: [
            {
              data: Object.values(this.categories), // Category amounts
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726',
                '#29B6F6', '#AB47BC', '#FF7043', '#8D6E63', '#42A5F5'
              ],
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Income and Expenses by Category'
            }
          }
        }
      });
    } else {
      console.error('Canvas element not found!');
    }
  }

  // Navigate back to the dashboard
  onBack(): void {
    this.router.navigate(['/landing-page/dashboard']);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService, DashboardStats, RevenueData, RecentActivity } from '../../../core/services/admin.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    todayBookings: 0,
    cancelledBookings: 0,
    activeMovies: 0
  };

  revenueData: RevenueData[] = [];
  recentActivities: RecentActivity[] = [];
  selectedPeriod: number = 7;
  loading = true;

  private destroy$ = new Subject<void>();
  private refreshInterval = interval(30000); // Refresh every 30 seconds

  constructor(
    private adminService: AdminService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Auto-refresh every 30 seconds
    this.refreshInterval
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboardData(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(showLoading: boolean = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.loading = false;
      }
    });

    this.loadRevenueData();
    this.loadRecentActivities();
  }

  loadRevenueData(): void {
    this.adminService.getRevenueData(this.selectedPeriod).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.updateChart();
      },
      error: (err) => {
        console.error('Error loading revenue data:', err);
      }
    });
  }

  loadRecentActivities(): void {
    this.adminService.getRecentActivity(10).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (err) => {
        console.error('Error loading recent activities:', err);
      }
    });
  }

  updateChart(): void {
    // Chart will be updated via data binding
  }

  onPeriodChange(period: number): void {
    this.selectedPeriod = period;
    this.loadRevenueData();
  }

  refreshData(): void {
    this.loadDashboardData();
    this.alertService.success('Dashboard data refreshed successfully!');
  }

  getMaxRevenue(): number {
    if (this.revenueData.length === 0) return 100;
    return Math.max(...this.revenueData.map(d => d.revenue), 100);
  }

  getBarHeight(revenue: number): string {
    const max = this.getMaxRevenue();
    return `${(revenue / max) * 100}%`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  getRevenueChange(): { value: number; isPositive: boolean } {
    if (this.revenueData.length < 2) {
      return { value: 0, isPositive: true };
    }
    
    const current = this.revenueData[this.revenueData.length - 1]?.revenue || 0;
    const previous = this.revenueData[this.revenueData.length - 2]?.revenue || 0;
    
    if (previous === 0) {
      return { value: 0, isPositive: true };
    }
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0
    };
  }

  getBookingsChange(): { value: number; isPositive: boolean } {
    // Simplified - in production, compare with previous period
    return { value: 8.2, isPositive: true };
  }

  getUsersChange(): { value: number; isPositive: boolean } {
    // Simplified - in production, compare with previous period
    return { value: 15.3, isPositive: true };
  }
}

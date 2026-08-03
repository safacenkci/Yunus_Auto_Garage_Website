import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AnalyticsResponse } from '../../../core/models/api.models';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.html',
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  readonly data = signal<AnalyticsResponse | null>(null);
  readonly days = signal(30);

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    // chart rendered after data loads
  }

  setDays(d: number) {
    this.days.set(d);
    this.load();
  }

  load() {
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - this.days() * 86400000).toISOString().slice(0, 10);
    this.adminApi.getAnalytics(from, to).subscribe((res) => {
      this.data.set(res);
      setTimeout(() => this.renderChart(res), 0);
    });
  }

  private renderChart(res: AnalyticsResponse) {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: res.dailySeries.map((d) => d.date),
        datasets: [
          {
            label: 'Görüntülenme',
            data: res.dailySeries.map((d) => d.views),
            borderColor: '#000',
            tension: 0.3,
          },
          {
            label: 'Tekil Ziyaretçi',
            data: res.dailySeries.map((d) => d.uniqueVisitors),
            borderColor: '#fccc38',
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}

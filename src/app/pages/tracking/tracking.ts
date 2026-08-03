import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { interval, switchMap, catchError, of } from 'rxjs';
import { TrackingResponse } from '../../core/models/api.models';
import { TrackingService } from '../../core/services/tracking.service';
import { SITE_CONFIG } from '../../site-config';

@Component({
  selector: 'app-tracking',
  imports: [RouterLink, DatePipe],
  templateUrl: './tracking.html',
})
export class TrackingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly trackingService = inject(TrackingService);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = SITE_CONFIG;
  readonly data = signal<TrackingResponse | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!token) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }

    this.load(token);

    interval(30_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.trackingService.getByToken(token).pipe(catchError(() => of(null)))
        )
      )
      .subscribe((res) => {
        if (res) {
          this.data.set(res);
          this.notFound.set(false);
        }
      });
  }

  private load(token: string) {
    this.loading.set(true);
    this.trackingService.getByToken(token).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
        this.notFound.set(false);
      },
      error: () => {
        this.data.set(null);
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}.${m}.${y}`;
  }
}

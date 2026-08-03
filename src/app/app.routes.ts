import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/site-layout/site-layout').then((m) => m.SiteLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'randevu',
        loadComponent: () => import('./pages/booking/booking').then((m) => m.BookingComponent),
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/pages/login/login').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'randevular',
        loadComponent: () =>
          import('./admin/pages/appointments/appointments').then((m) => m.AppointmentsComponent),
      },
      {
        path: 'analitik',
        loadComponent: () => import('./admin/pages/analytics/analytics').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'sms',
        loadComponent: () => import('./admin/pages/sms/sms').then((m) => m.SmsComponent),
      },
      {
        path: 'ayarlar',
        loadComponent: () => import('./admin/pages/settings/settings').then((m) => m.SettingsComponent),
      },
      {
        path: 'galeri',
        loadComponent: () => import('./admin/pages/gallery/gallery').then((m) => m.GalleryAdminComponent),
      },
    ],
  },
];

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/site-layout/site-layout').then((m) => m.SiteLayout),
    data: {
      seo: {
        title: 'Yunus Auto Garage | Aksaray Oto Elektrik ve Oto Servis',
        description:
          'Aksaray oto elektrik, elektronik arıza tespiti, klima dolumu ve oto tuning hizmetleri. Yunus Auto Garage ile Aksaray Merkez ve çevresinde profesyonel servis.',
        canonicalPath: '/',
        robots: 'index, follow',
      },
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'randevu',
        loadComponent: () => import('./pages/booking/booking').then((m) => m.BookingComponent),
        data: {
          seo: {
            title: 'Online Randevu | Aksaray Oto Elektrik',
            description:
              'Aksaray oto elektrik randevunuzu online olusturun. Elektronik ariza, klima dolumu ve oto tuning icin hizli randevu alin.',
            canonicalPath: '/randevu',
          },
        },
      },
      {
        path: 'kvkk',
        loadComponent: () => import('./pages/kvkk/kvkk').then((m) => m.KvkkComponent),
        data: {
          seo: {
            title: 'KVKK Aydinlatma Metni | Yunus Auto Garage',
            description:
              'Yunus Auto Garage KVKK aydinlatma metni. Aksaray oto servis ve oto elektrik randevu surecinde islenen veriler hakkinda bilgi alin.',
            canonicalPath: '/kvkk',
          },
        },
      },
      {
        path: 'takip/:token',
        loadComponent: () => import('./pages/tracking/tracking').then((m) => m.TrackingComponent),
        data: {
          seo: {
            title: 'Arac Takip | Yunus Auto Garage',
            description: 'Arac durum takibi sayfasi.',
            canonicalPath: '/takip',
            robots: 'noindex, nofollow',
          },
        },
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/pages/login/login').then((m) => m.AdminLoginComponent),
    data: {
      seo: {
        title: 'Admin Giris | Yunus Auto Garage',
        description: 'Yonetim giris sayfasi.',
        canonicalPath: '/admin/login',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout').then((m) => m.AdminLayout),
    data: {
      seo: {
        title: 'Admin Panel | Yunus Auto Garage',
        description: 'Yonetim paneli.',
        canonicalPath: '/admin',
        robots: 'noindex, nofollow',
      },
    },
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

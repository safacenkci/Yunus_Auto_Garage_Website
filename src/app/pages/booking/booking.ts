import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../core/services/booking.service';
import { AppointmentResponse, ServiceDto, SlotDto } from '../../core/models/api.models';
import { SITE_CONFIG } from '../../site-config';

interface DayOption {
  date: string;
  label: string;
  dayName: string;
}

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './booking.html',
})
export class BookingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly config = SITE_CONFIG;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;

  readonly step = signal(1);
  readonly services = signal<ServiceDto[]>([]);
  readonly servicesLoading = signal(true);
  readonly slots = signal<SlotDto[]>([]);
  readonly slotsLoading = signal(false);
  readonly submitting = signal(false);
  readonly success = signal<AppointmentResponse | null>(null);
  readonly slotConflict = signal(false);
  readonly days = signal<DayOption[]>([]);
  readonly customServiceNoteTouched = signal(false);
  readonly selectedOptionsTouched = signal(false);

  selectedServiceId = signal<number | null>(null);
  selectedDate = signal<string | null>(null);
  selectedTime = signal<string | null>(null);
  customServiceNote = signal('');
  selectedOptions = signal<string[]>([]);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^0?5\d{9}$/)]],
    vehicleMake: ['', Validators.required],
    vehicleModel: ['', Validators.required],
    kvkkConsent: [false, Validators.requiredTrue],
  });

  ngOnInit() {
    this.buildDays();
    if (isPlatformBrowser(this.platformId)) {
      this.bookingService.getServices().subscribe({
        next: (s) => {
          this.services.set(this.normalizeServices(s));
          this.servicesLoading.set(false);
        },
        error: () => {
          this.services.set(this.fallbackServices());
          this.servicesLoading.set(false);
        },
      });
    } else {
      this.services.set(this.fallbackServices());
      this.servicesLoading.set(false);
    }
  }

  private normalizeServices(apiServices: ServiceDto[]): ServiceDto[] {
    const retired = new Set<string>(SITE_CONFIG.RETIRED_SERVICE_NAMES);
    const byName = new Map(
      apiServices.filter((s) => !retired.has(s.name)).map((s) => [s.name, s])
    );

    return SITE_CONFIG.BOOKING_SERVICES.flatMap((expected) => {
      const api = byName.get(expected.title);
      if (!api) return [];

      return [
        {
          ...api,
          icon: expected.icon,
          description: expected.description,
        },
      ];
    });
  }

  private fallbackServices(): ServiceDto[] {
    return SITE_CONFIG.BOOKING_SERVICES.map((s, index) => ({
      id: -(index + 1),
      name: s.title,
      icon: s.icon,
      description: s.description,
    }));
  }

  private buildDays() {
    const result: DayOption[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      result.push({
        date: iso,
        label: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        dayName: dayNames[d.getDay()],
      });
    }
    this.days.set(result);
  }

  selectService(id: number) {
    this.selectedServiceId.set(id);
    this.selectedOptions.set([]);
    this.selectedOptionsTouched.set(false);
    if (this.isOtherService()) {
      this.step.set(1);
      return;
    }
    this.customServiceNote.set('');
    this.customServiceNoteTouched.set(false);
    this.step.set(2);
  }

  continueOtherService() {
    this.customServiceNoteTouched.set(true);
    if (!this.isOtherService() || this.customServiceNote().trim().length < 10) {
      return;
    }
    this.step.set(2);
  }

  isOtherService(): boolean {
    const service = this.services().find((s) => s.id === this.selectedServiceId());
    return service?.name === 'Diğer';
  }

  serviceOptions(): readonly string[] {
    const service = this.services().find((s) => s.id === this.selectedServiceId());
    if (!service || service.name === 'Diğer') return [];
    return SITE_CONFIG.BOOKING_SERVICE_OPTIONS[service.name] ?? [];
  }

  isOptionSelected(option: string): boolean {
    return this.selectedOptions().includes(option);
  }

  toggleOption(option: string) {
    const current = this.selectedOptions();
    if (current.includes(option)) {
      this.selectedOptions.set(current.filter((o) => o !== option));
    } else {
      this.selectedOptions.set([...current, option]);
    }
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
    this.slotsLoading.set(true);
    this.bookingService.getSlots(date).subscribe({
      next: (s) => {
        this.slots.set(s);
        this.slotsLoading.set(false);
      },
      error: () => this.slotsLoading.set(false),
    });
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
    this.step.set(3);
    this.slotConflict.set(false);
  }

  goToStep(s: number) {
    this.step.set(s);
    if (s === 2) this.slotConflict.set(false);
    if (s === 1) {
      this.selectedDate.set(null);
      this.selectedTime.set(null);
    }
  }

  canGoToStep(s: number): boolean {
    return s < this.step();
  }

  submit() {
    if (this.form.invalid || !this.selectedServiceId() || !this.selectedDate() || !this.selectedTime()) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isOtherService() && this.customServiceNote().trim().length < 10) {
      this.customServiceNoteTouched.set(true);
      return;
    }

    if (!this.isOtherService() && this.selectedOptions().length === 0) {
      this.selectedOptionsTouched.set(true);
      return;
    }

    this.submitting.set(true);
    this.slotConflict.set(false);

    const v = this.form.getRawValue();

    this.bookingService
      .createAppointment({
        fullName: v.fullName,
        phone: v.phone,
        serviceId: this.selectedServiceId()!,
        vehicleMake: v.vehicleMake,
        vehicleModel: v.vehicleModel,
        date: this.selectedDate()!,
        timeSlot: this.selectedTime()!,
        note: this.isOtherService() ? this.customServiceNote().trim() : undefined,
        selectedOptions: this.isOtherService() ? undefined : this.selectedOptions(),
        kvkkConsent: v.kvkkConsent,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.success.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          if (err.status === 409) {
            this.slotConflict.set(true);
            this.step.set(2);
            if (this.selectedDate()) {
              this.selectDate(this.selectedDate()!);
            }
          }
        },
      });
  }

  selectedServiceName(): string {
    const service = this.services().find((s) => s.id === this.selectedServiceId());
    if (!service) return '';
    if (service.name === 'Diğer' && this.customServiceNote()) {
      return `Diğer — ${this.customServiceNote()}`;
    }
    return service.name;
  }

  customServiceNoteError(): string | null {
    if (!this.customServiceNoteTouched()) return null;
    if (this.customServiceNote().trim().length < 10) {
      return 'En az 10 karakter giriniz.';
    }
    return null;
  }

  selectedOptionsError(): string | null {
    if (!this.selectedOptionsTouched()) return null;
    if (this.selectedOptions().length === 0) {
      return 'En az bir işlem seçmelisiniz.';
    }
    return null;
  }

  fieldError(field: string): string | null {
    const ctrl = this.form.get(field);
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required'] || ctrl.errors['requiredTrue']) return 'Bu alan zorunludur.';
    if (ctrl.errors['minlength']) return 'En az 3 karakter giriniz.';
    if (ctrl.errors['pattern']) return 'Geçerli bir telefon numarası giriniz (05XX XXX XX XX).';
    return 'Geçersiz değer.';
  }
}

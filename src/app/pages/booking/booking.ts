import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../core/services/booking.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { AppointmentResponse, ServiceDto, SlotDto, VehicleCategoryDto, VehicleMakeDto, VehicleModelDto } from '../../core/models/api.models';
import { SITE_CONFIG } from '../../site-config';
import { isValidPhone, sanitizePhoneInput } from '../../core/utils/phone.util';

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
  private static readonly OTHER_OPTION = '__other__';
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly vehicleService = inject(VehicleService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly config = SITE_CONFIG;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;

  readonly step = signal(1);
  readonly services = signal<ServiceDto[]>([]);
  readonly servicesLoading = signal(true);
  readonly servicesLoadError = signal(false);
  readonly slots = signal<SlotDto[]>([]);
  readonly slotsLoading = signal(false);
  readonly submitting = signal(false);
  readonly success = signal<AppointmentResponse | null>(null);
  readonly slotConflict = signal(false);
  readonly days = signal<DayOption[]>([]);
  readonly customServiceNoteTouched = signal(false);
  readonly selectedOptionsTouched = signal(false);
  readonly vehicleCategories = signal<VehicleCategoryDto[]>([]);
  readonly vehicleMakes = signal<VehicleMakeDto[]>([]);
  readonly vehicleModels = signal<VehicleModelDto[]>([]);
  readonly categoriesLoading = signal(false);
  readonly makesLoading = signal(false);
  readonly modelsLoading = signal(false);
  readonly categoriesLoadError = signal(false);
  readonly makesLoadError = signal(false);
  readonly makeManualEntry = signal(false);
  readonly modelManualEntry = signal(false);
  readonly submitAttempted = signal(false);

  selectedCategoryId = signal('otomobil');
  selectedMakeId = signal<number | null>(null);
  selectedServiceId = signal<number | null>(null);
  selectedDate = signal<string | null>(null);
  selectedTime = signal<string | null>(null);
  customServiceNote = signal('');
  selectedOptions = signal<string[]>([]);

  readonly form = this.fb.nonNullable.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/),
      ],
    ],
    phone: [
      '',
      [
        Validators.required,
        (ctrl: AbstractControl): ValidationErrors | null =>
          isValidPhone(String(ctrl.value ?? '')) ? null : { phone: true },
      ],
    ],
    vehicleMake: ['', Validators.required],
    vehicleModel: ['', Validators.required],
    vehicleYear: ['', Validators.required],
    kvkkConsent: [false, Validators.requiredTrue],
  });

  readonly vehicleYears: number[] = Array.from(
    { length: new Date().getFullYear() + 1 - 1950 + 1 },
    (_, i) => new Date().getFullYear() + 1 - i
  );

  ngOnInit() {
    this.form.controls.vehicleModel.disable();
    this.buildDays();
    if (isPlatformBrowser(this.platformId)) {
      this.bookingService.getServices().subscribe({
        next: (s) => {
          this.services.set(s);
          this.servicesLoadError.set(false);
          this.servicesLoading.set(false);
        },
        error: () => {
          this.services.set([]);
          this.servicesLoadError.set(true);
          this.servicesLoading.set(false);
        },
      });
    } else {
      this.services.set([]);
      this.servicesLoadError.set(true);
      this.servicesLoading.set(false);
    }
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
    return service?.bookingMode === 'note';
  }

  serviceOptions(): readonly string[] {
    const service = this.services().find((s) => s.id === this.selectedServiceId());
    if (!service || service.bookingMode === 'note') return [];
    return service.options;
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
    this.loadVehicleCategories();
  }

  loadVehicleCategories() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.vehicleCategories().length > 0) {
      this.loadVehicleMakes(this.selectedCategoryId());
      return;
    }

    if (this.categoriesLoading()) {
      return;
    }

    this.categoriesLoading.set(true);
    this.categoriesLoadError.set(false);
    this.vehicleService.getCategories().subscribe({
      next: (categories) => {
        this.vehicleCategories.set(categories);
        if (categories.length > 0 && !categories.some((category) => category.id === this.selectedCategoryId())) {
          this.selectedCategoryId.set(categories[0].id);
        }
        this.categoriesLoading.set(false);
        this.loadVehicleMakes(this.selectedCategoryId());
      },
      error: () => {
        this.categoriesLoadError.set(true);
        this.categoriesLoading.set(false);
      },
    });
  }

  loadVehicleMakes(category: string) {
    if (!isPlatformBrowser(this.platformId) || this.makesLoading()) {
      return;
    }

    this.makesLoading.set(true);
    this.makesLoadError.set(false);
    this.vehicleService.getMakes(category).subscribe({
      next: (makes) => {
        this.vehicleMakes.set(makes);
        this.makesLoading.set(false);
        this.makeManualEntry.set(false);
      },
      error: () => {
        this.makesLoadError.set(true);
        this.makesLoading.set(false);
      },
    });
  }

  onCategoryChange() {
    const categoryId = this.selectedCategoryId();
    this.form.controls.vehicleMake.setValue('', { emitEvent: false });
    this.makeManualEntry.set(false);
    this.resetModelSelect();
    this.vehicleMakes.set([]);
    this.loadVehicleMakes(categoryId);
  }

  private resetModelSelect() {
    this.form.controls.vehicleModel.setValue('');
    this.form.controls.vehicleModel.disable();
    this.form.controls.vehicleModel.markAsUntouched();
    this.selectedMakeId.set(null);
    this.vehicleModels.set([]);
    this.modelsLoading.set(false);
    this.modelManualEntry.set(false);
  }

  handleMakeSelection(makeName: string) {
    if (!makeName) {
      this.resetModelSelect();
      return;
    }

    if (makeName === BookingComponent.OTHER_OPTION || makeName === 'Diğer') {
      this.selectedMakeId.set(null);
      this.makeManualEntry.set(true);
      this.form.controls.vehicleMake.setValue('', { emitEvent: false });
      this.form.controls.vehicleModel.enable();
      this.form.controls.vehicleModel.setValue('');
      this.form.controls.vehicleModel.markAsUntouched();
      this.vehicleModels.set([]);
      this.modelsLoading.set(false);
      this.modelManualEntry.set(true);
      return;
    }

    const make = this.vehicleMakes().find((m) => m.name === makeName) ?? null;
    this.makeManualEntry.set(false);
    this.selectedMakeId.set(make?.id ?? null);
    this.form.controls.vehicleMake.setValue(makeName, { emitEvent: false });
    this.form.controls.vehicleModel.setValue('');
    this.form.controls.vehicleModel.disable();
    this.vehicleModels.set([]);
    this.modelManualEntry.set(false);

    if (!make) {
      return;
    }

    this.modelsLoading.set(true);
    this.vehicleService.getModels(make.id).subscribe({
      next: (models) => {
        const usableModels = models.filter((m) => m.name !== 'Diğer');
        this.vehicleModels.set(usableModels);
        this.modelsLoading.set(false);
        if (usableModels.length === 0) {
          this.form.controls.vehicleModel.enable();
          this.modelManualEntry.set(true);
          return;
        }

        this.form.controls.vehicleModel.enable();
        if (this.selectedCategoryId() !== 'otomobil' && usableModels.length === 1) {
          this.form.controls.vehicleModel.setValue(usableModels[0].name);
        }
      },
      error: () => {
        this.vehicleModels.set([]);
        this.modelsLoading.set(false);
        this.form.controls.vehicleModel.enable();
        this.modelManualEntry.set(true);
      },
    });
  }

  onMakeSelectChange(makeName: string) {
    this.handleMakeSelection(makeName);
  }

  onModelSelectChange(modelName: string) {
    if (modelName === BookingComponent.OTHER_OPTION || modelName === 'Diğer') {
      this.selectOtherModel();
      return;
    }
    this.modelManualEntry.set(false);
    this.form.controls.vehicleModel.enable();
    this.form.controls.vehicleModel.setValue(modelName, { emitEvent: false });
  }

  selectableMakes(): VehicleMakeDto[] {
    return this.vehicleMakes().filter((m) => m.name !== 'Diğer');
  }

  selectOtherMake() {
    this.handleMakeSelection(BookingComponent.OTHER_OPTION);
  }

  selectOtherModel() {
    this.modelManualEntry.set(true);
    this.form.controls.vehicleModel.enable();
    this.form.controls.vehicleModel.setValue('');
  }

  onManualMakeInput(value: string) {
    if (!this.makeManualEntry()) return;
    this.form.controls.vehicleMake.setValue(value, { emitEvent: false });
  }

  onManualModelInput(value: string) {
    this.form.controls.vehicleModel.setValue(value, { emitEvent: false });
  }

  readonly otherOptionValue = BookingComponent.OTHER_OPTION;

  goToStep(s: number) {
    this.step.set(s);
    if (s === 2) this.slotConflict.set(false);
    if (s === 3) this.loadVehicleCategories();
    if (s === 1) {
      this.selectedDate.set(null);
      this.selectedTime.set(null);
    }
  }

  canGoToStep(s: number): boolean {
    return s < this.step();
  }

  submit() {
    this.submitAttempted.set(true);
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

    const categoryName =
      this.vehicleCategories().find((c) => c.id === this.selectedCategoryId())?.name ?? 'Otomobil';

    this.bookingService
      .createAppointment({
        fullName: v.fullName,
        phone: v.phone,
        serviceId: this.selectedServiceId()!,
        vehicleMake: `${categoryName} · ${v.vehicleMake}`,
        vehicleModel: v.vehicleModel,
        vehicleYear: Number(v.vehicleYear),
        date: this.selectedDate()!,
        timeSlot: this.selectedTime()!,
        note: this.isOtherService() ? this.customServiceNote().trim() : undefined,
        selectedOptions: this.isOtherService() ? undefined : this.selectedOptions(),
        kvkkConsent: v.kvkkConsent,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.submitAttempted.set(false);
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
    if (service.bookingMode === 'note' && this.customServiceNote()) {
      return `${service.name} — ${this.customServiceNote()}`;
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

  sanitizeFullName(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
      this.form.controls.fullName.setValue(cleaned, { emitEvent: false });
    }
  }

  sanitizePhone(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = sanitizePhoneInput(input.value);
    if (cleaned !== input.value) {
      input.value = cleaned;
      this.form.controls.phone.setValue(cleaned, { emitEvent: false });
    }
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl?.errors && this.submitAttempted();
  }

  fieldError(field: string): string | null {
    const ctrl = this.form.get(field);
    if (!ctrl?.errors || !this.submitAttempted()) return null;
    if (ctrl.errors['required'] || ctrl.errors['requiredTrue']) return 'Bu alanın doldurulması zorunludur.';
    if (ctrl.errors['minlength']) return 'En az 3 karakter giriniz.';
    if (ctrl.errors['pattern']) {
      if (field === 'fullName') return 'Sadece harf giriniz.';
    }
    if (ctrl.errors['phone']) {
      return 'Geçerli bir telefon numarası giriniz (8-15 rakam, örn. 05XX... veya +49...).';
    }
    return 'Geçersiz değer.';
  }
}

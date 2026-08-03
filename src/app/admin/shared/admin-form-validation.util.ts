import { AbstractControl, FormGroup } from '@angular/forms';

export const ADMIN_FIELD_REQUIRED = 'Bu alan zorunludur';
export const ADMIN_FORM_REQUIRED_SUMMARY = 'Lütfen zorunlu alanları doldurun';

export function adminControlInvalid(
  control: AbstractControl | null | undefined,
  submitted: boolean,
): boolean {
  if (!control) return false;
  return (submitted || control.touched) && control.invalid;
}

export function adminFieldError(
  control: AbstractControl | null | undefined,
  submitted: boolean,
): string | null {
  if (!control || !adminControlInvalid(control, submitted)) return null;

  const errors = control.errors;
  if (!errors) return null;

  if (errors['required'] || errors['requiredTrue']) {
    return ADMIN_FIELD_REQUIRED;
  }

  return 'Geçersiz değer.';
}

export function validateAdminForm(form: FormGroup, onInvalid: () => void): boolean {
  form.markAllAsTouched();

  if (form.invalid) {
    onInvalid();
    return false;
  }

  return true;
}

export function adminCustomFieldInvalid(showError: boolean, submitted: boolean): boolean {
  return submitted && showError;
}

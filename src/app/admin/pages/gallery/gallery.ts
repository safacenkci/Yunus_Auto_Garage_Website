import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { GalleryItemDto } from '../../../core/models/api.models';
import { type GalleryMediaType } from '../../../core/models/api-contract';
import { galleryThumbnail, isEmbedVideoUrl } from '../../../core/utils/gallery-media';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import { AdminConfirmKind } from '../../shared/admin-confirm.types';
import {
  ADMIN_FIELD_REQUIRED,
  ADMIN_FORM_REQUIRED_SUMMARY,
} from '../../shared/admin-form-validation.util';

type PendingConfirm =
  | { action: 'submit' }
  | { action: 'delete'; id: number };

import { AdminButtonSpinnerComponent } from '../../shared/admin-button-spinner.component';

@Component({
  selector: 'app-gallery-admin',
  imports: [ReactiveFormsModule, AdminConfirmModalComponent, AdminButtonSpinnerComponent],
  templateUrl: './gallery.html',
})
export class GalleryAdminComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);

  readonly formSummary = ADMIN_FORM_REQUIRED_SUMMARY;
  readonly items = signal<GalleryItemDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);
  readonly dragOver = signal(false);
  readonly filePreviewUrl = signal<string | null>(null);
  readonly pendingConfirm = signal<PendingConfirm | null>(null);
  readonly confirming = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    mediaType: ['Photo' as GalleryMediaType],
    title: [''],
    sortOrder: [0],
    isActive: [true],
    embedUrl: [''],
  });

  selectedFile: File | null = null;

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.revokePreview();
  }

  load() {
    this.loading.set(true);
    this.adminApi.getGallery().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Galeri yüklenemedi.');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.setSelectedFile(input.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setSelectedFile(file);
    }
  }

  clearSelectedFile(input: HTMLInputElement, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    input.value = '';
    this.setSelectedFile(null);
  }

  setSelectedFile(file: File | null) {
    this.revokePreview();

    if (!file) {
      this.selectedFile = null;
      return;
    }

    if (!this.isAcceptedFile(file)) {
      const mediaType = this.form.getRawValue().mediaType;
      this.error.set(
        mediaType === 'Photo'
          ? 'Lütfen geçerli bir fotoğraf dosyası seçin (PNG, JPG, WebP vb.).'
          : 'Lütfen geçerli bir video dosyası seçin (MP4, WebM).',
      );
      this.selectedFile = null;
      return;
    }

    this.error.set(null);
    this.selectedFile = file;

    if (file.type.startsWith('image/')) {
      this.filePreviewUrl.set(URL.createObjectURL(file));
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  resetForm() {
    this.form.reset({ mediaType: 'Photo', sortOrder: 0, isActive: true, title: '', embedUrl: '' });
    this.revokePreview();
    this.selectedFile = null;
    this.dragOver.set(false);
    this.editingId.set(null);
    this.error.set(null);
    this.submitted.set(false);
  }

  startEdit(item: GalleryItemDto) {
    this.editingId.set(item.id);
    this.form.patchValue({
      mediaType: item.mediaType,
      title: item.title ?? '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      embedUrl: item.mediaType === 'Video' && isEmbedVideoUrl(item.mediaUrl) ? item.mediaUrl : '',
    });
    this.revokePreview();
    this.selectedFile = null;
    this.dragOver.set(false);
    this.error.set(null);
    this.submitted.set(false);
  }

  mediaMissing(): boolean {
    if (!this.submitted()) return false;

    const v = this.form.getRawValue();
    if (this.editingId()) return false;

    if (v.mediaType === 'Photo') {
      return !this.selectedFile;
    }

    return !this.selectedFile && !v.embedUrl.trim();
  }

  dropzoneInvalid(): boolean {
    return this.mediaMissing();
  }

  dropzoneError(): string | null {
    if (!this.dropzoneInvalid()) return null;
    const mediaType = this.form.getRawValue().mediaType;
    if (mediaType === 'Photo') {
      return ADMIN_FIELD_REQUIRED;
    }
    return 'Video dosyası veya YouTube/Vimeo bağlantısı girin.';
  }

  askSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.pendingConfirm.set({ action: 'submit' });
  }

  closeConfirm() {
    if (this.confirming()) return;
    this.pendingConfirm.set(null);
  }

  submitConfirmKind(): AdminConfirmKind {
    return this.editingId() ? 'save' : 'add';
  }

  submitConfirmLabel(): string {
    return this.editingId() ? 'Güncelle' : 'Ekle';
  }

  submitConfirm() {
    const pending = this.pendingConfirm();
    if (!pending || this.confirming()) return;

    if (pending.action === 'delete') {
      this.executeDelete(pending.id);
      return;
    }

    this.executeSubmit();
  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();
    this.submitted.set(true);
    return !this.mediaMissing();
  }

  private executeSubmit() {
    const v = this.form.getRawValue();
    const formData = new FormData();
    formData.append('mediaType', v.mediaType);
    formData.append('title', v.title);
    formData.append('sortOrder', String(v.sortOrder));
    formData.append('isActive', String(v.isActive));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (v.mediaType === 'Video' && v.embedUrl.trim()) {
      formData.append('embedUrl', v.embedUrl.trim());
    }

    const editing = this.editingId();
    const request = editing
      ? this.adminApi.updateGalleryItem(editing, formData)
      : this.adminApi.createGalleryItem(formData);

    this.confirming.set(true);
    this.loading.set(true);
    request.subscribe({
      next: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
        this.resetForm();
        this.load();
      },
      error: (err) => {
        this.confirming.set(false);
        this.loading.set(false);
        this.pendingConfirm.set(null);
        this.error.set(err?.error?.detail ?? err?.error?.title ?? 'İşlem başarısız.');
      },
    });
  }

  askRemove(id: number) {
    this.pendingConfirm.set({ action: 'delete', id });
  }

  private executeDelete(id: number) {
    this.confirming.set(true);
    this.adminApi.deleteGalleryItem(id).subscribe({
      next: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
        if (this.editingId() === id) {
          this.resetForm();
        }
        this.load();
      },
      error: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
        this.error.set('Silme işlemi başarısız.');
      },
    });
  }

  thumbnail(item: GalleryItemDto): string | null {
    return galleryThumbnail(item);
  }

  isVideo(item: GalleryItemDto): boolean {
    return item.mediaType === 'Video';
  }

  private isAcceptedFile(file: File): boolean {
    const mediaType = this.form.getRawValue().mediaType;
    if (mediaType === 'Photo') {
      return file.type.startsWith('image/');
    }
    return file.type.startsWith('video/');
  }

  private revokePreview() {
    const url = this.filePreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.filePreviewUrl.set(null);
  }
}

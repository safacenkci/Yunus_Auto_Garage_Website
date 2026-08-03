import { afterNextRender, Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GalleryItemDto } from '../../core/models/api.models';
import { GalleryService } from '../../core/services/gallery.service';
import { ScrollService } from '../../core/services/scroll.service';
import {
  galleryThumbnail,
  isEmbedVideoUrl,
  toEmbedUrl,
} from '../../core/utils/gallery-media';
import { HOME_SECTION_IDS, SITE_CONFIG } from '../../site-config';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scrollService = inject(ScrollService);
  private galleryService = inject(GalleryService);

  readonly config = SITE_CONFIG;
  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;

  readonly gallery = signal<GalleryItemDto[]>([]);
  readonly galleryLoading = signal(true);
  readonly lightboxItem = signal<GalleryItemDto | null>(null);
  readonly lightboxEmbedUrl = signal<SafeResourceUrl | null>(null);

  serviceTags(service: (typeof SITE_CONFIG.SERVICES)[number]): readonly string[] {
    return 'tags' in service ? service.tags : [];
  }
  readonly safeMapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    SITE_CONFIG.GOOGLE_MAPS_EMBED_URL
  );

  constructor() {
    afterNextRender(() => {
      this.galleryService.getItems().subscribe({
        next: (items) => {
          this.gallery.set(items);
          this.galleryLoading.set(false);
        },
        error: () => this.galleryLoading.set(false),
      });

      this.route.fragment.subscribe((fragment) => {
        if (!fragment) {
          return;
        }

        if (fragment === 'randevu') {
          void this.router.navigate(['/randevu'], { replaceUrl: true });
          return;
        }

        if (HOME_SECTION_IDS.includes(fragment)) {
          this.scrollService.scrollToSectionWhenReady(fragment, false);
        }
      });
    });
  }

  thumbnail(item: GalleryItemDto): string | null {
    return galleryThumbnail(item);
  }

  openLightbox(item: GalleryItemDto) {
    this.lightboxItem.set(item);
    if (item.mediaType === 'Video' && isEmbedVideoUrl(item.mediaUrl)) {
      this.lightboxEmbedUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(toEmbedUrl(item.mediaUrl))
      );
    } else {
      this.lightboxEmbedUrl.set(null);
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
    }
  }

  closeLightbox() {
    this.lightboxItem.set(null);
    this.lightboxEmbedUrl.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
  }

  isEmbedVideo(item: GalleryItemDto): boolean {
    return item.mediaType === 'Video' && isEmbedVideoUrl(item.mediaUrl);
  }
}

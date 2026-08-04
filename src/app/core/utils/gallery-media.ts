import { GalleryItemDto } from '../models/api.models';
import type { GalleryMediaType } from '../models/api-contract';

export function isEmbedVideoUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes('youtube.com') || host.includes('youtu.be') || host.includes('vimeo.com');
  } catch {
    return false;
  }
}

export function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
    }

    if (host.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
  } catch {
    return url;
  }

  return url;
}

export function galleryThumbnail(item: GalleryItemDto): string | null {
  if (isGalleryMediaType(item.mediaType, 'Photo')) {
    return item.mediaUrl;
  }

  if (isEmbedVideoUrl(item.mediaUrl)) {
    const youtubeId = extractYouTubeId(item.mediaUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    return null;
  }

  return item.mediaUrl;
}

function isGalleryMediaType(value: string, expected: GalleryMediaType): boolean {
  return value === expected;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }

    if (host.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
  } catch {
    return null;
  }

  return null;
}

import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SITE_CONFIG } from '../../site-config';

export type SeoRouteData = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: 'index, follow' | 'noindex, nofollow';
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.applyRouteSeo();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.applyRouteSeo();
    });
  }

  private applyRouteSeo() {
    const snapshot = this.router.routerState.snapshot.root;
    const seo = this.resolveSeo(snapshot);
    const url = this.absoluteUrl(seo.canonicalPath ?? this.router.url);

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: seo.robots ?? 'index, follow' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'tr_TR' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:image', content: SITE_CONFIG.SEO_DEFAULT_IMAGE_URL });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_CONFIG.BUSINESS_NAME });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: SITE_CONFIG.SEO_DEFAULT_IMAGE_URL });
    this.meta.updateTag({ name: 'keywords', content: SITE_CONFIG.SEO_PRIMARY_KEYWORDS.join(', ') });

    this.setCanonical(url);
    this.setStructuredData(seo, url);
  }

  private resolveSeo(snapshot: ActivatedRouteSnapshot): SeoRouteData {
    const chain = this.collectRouteChain(snapshot);
    return chain.reduce<SeoRouteData>(
      (acc, current) => ({ ...acc, ...current }),
      {
        title: SITE_CONFIG.META_TITLE,
        description: SITE_CONFIG.META_DESCRIPTION,
        canonicalPath: '/',
        robots: 'index, follow',
      },
    );
  }

  private collectRouteChain(snapshot: ActivatedRouteSnapshot): SeoRouteData[] {
    const result: SeoRouteData[] = [];
    let current: ActivatedRouteSnapshot | null = snapshot;
    while (current) {
      const seo = current.data['seo'] as SeoRouteData | undefined;
      if (seo) result.push(seo);
      current = current.firstChild ?? null;
    }
    return result;
  }

  private setCanonical(url: string) {
    let canonical = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  private setStructuredData(seo: SeoRouteData, url: string) {
    const graph = [
      this.buildWebsiteNode(),
      this.buildBusinessNode(),
      this.buildWebPageNode(seo, url),
      this.buildBreadcrumbNode(url),
    ].filter(Boolean);

    let script = this.document.getElementById('app-seo-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'app-seo-jsonld';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }

  private buildWebsiteNode() {
    return {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.SITE_URL}/#website`,
      url: SITE_CONFIG.SITE_URL,
      name: SITE_CONFIG.BUSINESS_NAME,
      inLanguage: 'tr-TR',
    };
  }

  private buildBusinessNode() {
    const sameAs = SITE_CONFIG.SCHEMA_SAME_AS.filter((url) => !url.includes('BURAYA_'));

    return {
      '@type': 'AutoRepair',
      '@id': `${SITE_CONFIG.SITE_URL}/#business`,
      name: SITE_CONFIG.BUSINESS_NAME,
      image: SITE_CONFIG.LOGO_OR_PHOTO_URL,
      url: SITE_CONFIG.SITE_URL,
      telephone: `+90${SITE_CONFIG.PHONE_DIGITS}`,
      priceRange: 'TRY',
      areaServed: SITE_CONFIG.SEO_SERVICE_AREAS,
      description: SITE_CONFIG.META_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.STREET_ADDRESS,
        addressLocality: SITE_CONFIG.CITY,
        addressRegion: SITE_CONFIG.REGION,
        postalCode: SITE_CONFIG.POSTAL_CODE,
        addressCountry: SITE_CONFIG.COUNTRY_CODE,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: SITE_CONFIG.LAT,
        longitude: SITE_CONFIG.LNG,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: SITE_CONFIG.SCHEMA_OPENS,
          closes: SITE_CONFIG.SCHEMA_CLOSES,
        },
      ],
      ...(sameAs.length ? { sameAs } : {}),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Oto Elektrik ve Servis Hizmetleri',
        itemListElement: SITE_CONFIG.SERVICES.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.description,
            areaServed: SITE_CONFIG.SEO_SERVICE_AREAS,
          },
        })),
      },
      knowsAbout: SITE_CONFIG.SEO_PRIMARY_KEYWORDS,
    };
  }

  private buildWebPageNode(seo: SeoRouteData, url: string) {
    return {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${SITE_CONFIG.SITE_URL}/#website` },
      about: { '@id': `${SITE_CONFIG.SITE_URL}/#business` },
      inLanguage: 'tr-TR',
    };
  }

  private buildBreadcrumbNode(url: string) {
    const items = this.breadcrumbsFor(url);
    if (items.length <= 1) return null;

    return {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: this.absoluteUrl(item.path),
      })),
    };
  }

  private breadcrumbsFor(url: string): BreadcrumbItem[] {
    const path = url.replace(SITE_CONFIG.SITE_URL, '') || '/';
    if (path.startsWith('/randevu')) {
      return [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Randevu', path: '/randevu' },
      ];
    }
    if (path.startsWith('/kvkk')) {
      return [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'KVKK', path: '/kvkk' },
      ];
    }
    return [{ name: 'Ana Sayfa', path: '/' }];
  }

  private absoluteUrl(path: string) {
    return new URL(path, SITE_CONFIG.SITE_URL).toString();
  }
}

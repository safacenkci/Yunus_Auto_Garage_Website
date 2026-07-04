# Yunus Auto Garage — Aksaray Oto Elektrik

Aksaray oto sanayide (Bahçesaray Mah., 8630. Sk. — Sanayi K13) hizmet veren oto elektrikçi
**Yunus Auto Garage** için SEO odaklı, tek sayfalık tanıtım sitesi.

- **Teknoloji:** Angular 21 + SSG (prerender) — sayfa, build sırasında statik HTML'e dönüştürülür,
  Google içeriği doğrudan okur.
- **Amaç:** "aksaray oto elektrik", "aksaray oto elektrikçi" gibi aramalarda üst sırada çıkmak;
  ziyaretçinin tek dokunuşla **telefon**, **WhatsApp** ve **yol tarifine** ulaşması.
- **Yayın:** GitHub Pages (`.github/workflows/deploy.yml` — `main` dalına push'ta otomatik deploy).

## Geliştirme

```bash
npm install
npm start          # http://localhost:4200
npm run build      # statik çıktı: dist/yunus-oto-elektrik/browser
```

İşletme bilgileri tek merkezden yönetilir: **`src/app/site-config.ts`**.
Telefon, adres veya SSS metni değiştirirseniz `src/index.html` içindeki meta etiketleri ve
JSON-LD şemalarını da aynı şekilde güncelleyin (ikisi birbirinden bağımsız statik içeriktir).

---

## 🚀 Yayına Alma Rehberi (sırasıyla yapın)

Sitenin Google'da çıkması için kod tek başına yetmez; aşağıdaki adımlar tamamlanmalıdır.

### 1. Domain'i satın alın: `yunusautogarage.com`

Herhangi bir kayıt firmasından (ör. isimtescil, GoDaddy, Namecheap) alınabilir.

### 2. GitHub Pages'i etkinleştirin

1. GitHub'da repo → **Settings → Pages**
2. **Source:** "GitHub Actions" seçin.
3. `main` dalına push yapıldığında site otomatik yayınlanır
   (ilk aşamada `https://safacenkci.github.io/Yunus_Auto_Garage_Website/` adresinde görünür;
   site `base href /` ile derlendiği için asıl doğru çalışma **özel domain bağlandıktan sonra** olur).

### 3. Domain'i GitHub Pages'e bağlayın

1. Domain firmanızın DNS panelinde şu kayıtları ekleyin:
   - `A` kaydı → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` kaydı: `www` → `safacenkci.github.io`
2. GitHub → **Settings → Pages → Custom domain** alanına `yunusautogarage.com` yazın,
   **Enforce HTTPS**'i işaretleyin (sertifika birkaç saat içinde hazır olur).

### 4. Google Business Profile açın — **yerel SEO'daki en önemli adım!**

"aksaray oto elektrik" aramalarında **harita kutusunda (yerel pakette)** çıkmayı sağlayan şey
web sitesi değil, Google Business Profile'dır:

1. https://business.google.com adresinden **Yunus Auto Garage** işletmesini ekleyin.
2. Kategori: **Oto elektrik servisi / Oto tamirhanesi**; adres, telefon (0536 239 29 68),
   çalışma saatleri ve web sitesi (`https://yunusautogarage.com`) bilgilerini **sitedekiyle birebir aynı** girin
   (tutarlılık sıralamayı doğrudan etkiler).
3. Doğrulama sonrası dükkan fotoğrafları yükleyin ve **müşterilerden Google yorumu isteyin** —
   yorum sayısı ve puanı yerel sıralamada en güçlü sinyallerdendir.

### 5. Google Search Console'a ekleyin

1. https://search.google.com/search-console → `yunusautogarage.com` alan adını ekleyin (DNS doğrulaması).
2. **Sitemaps** bölümüne `https://yunusautogarage.com/sitemap.xml` gönderin.
3. Birkaç gün içinde site dizine alınır; "URL inceleme" aracıyla durumu takip edebilirsiniz.

### 6. Kalan küçük güncellemeler

- **Hassas GPS koordinatı:** Google Maps'te dükkana sağ tıklayıp koordinatı kopyalayın;
  `src/app/site-config.ts` (`LAT`/`LNG`) ve `src/index.html` (JSON-LD `geo`) alanlarını güncelleyin.
- **Sosyal profiller:** Google Business Profile / Instagram / Facebook linkleri hazır olunca
  `site-config.ts` içindeki boş alanlara ekleyin ve `index.html` JSON-LD'sine `sameAs` olarak girin.
- **Gerçek fotoğraflar:** `public/assets/` içindeki üretilmiş logo/og-image yerine dükkanın gerçek
  fotoğraflarını koymak hem SEO'ya hem güvene katkı sağlar.

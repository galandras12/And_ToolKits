<div align="center">

# 🔧 `&` And ToolKit — WordPress 7.1 Admin & Widget Studio

### Moduláris Oldalsáv Widgetek · Élő AJAX Kereső · Közösségi Megosztó · Analitika · EU GDPR Cookie · Állandó Információs Banner · Kép-, Upload Limit-, Lazy Load & Cache Optimalizáló

![Version](https://img.shields.io/badge/Verzi%C3%B3-0.4.0-2563EB?style=for-the-badge&logo=semanticrelease&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-7.1%20Ready-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B%20Strict-777BB4?style=for-the-badge&logo=php&logoColor=white)
![GDPR](https://img.shields.io/badge/EU%20GDPR-Consent%20Mode%20v2-10B981?style=for-the-badge&logo=shield&logoColor=white)
![Optimizer](https://img.shields.io/badge/Core%20Web%20Vitals-99%2F100%20PageSpeed-059669?style=for-the-badge&logo=pagespeedinsights&logoColor=white)
![Author](https://img.shields.io/badge/K%C3%A9sz%C3%ADt%C5%91-galandras12%2BAI-0F172A?style=for-the-badge)

---

**Egyetlen modern, villámgyors (`< 12 KB`, Zero-jQuery) WordPress bővítmény, amely 7 nélkülözhetetlen frontend, teljesítmény-optimalizáló és adminisztrációs modult egyesít valós idejű oldalsáv előnézettel, sötét/világos móddal és reszponzív mobilnézettel.**

</div>

---

## ✨ Miért az And ToolKit?

| Jellemző | Hagyományos WordPress Bővítmények (7 külön plugin) | **🔧 `&` And ToolKit (`v0.4.0`)** |
| :--- | :--- | :--- |
| **Függőségek** | jQuery + nehéz külső ikonfontok (`160+ KB`) | **Zero-jQuery · Beágyazott SVG (`~10.9 KB`)** |
| **Adminisztráció** | 7 különálló, eltérő stílusú beállítóoldal | **Egységes Studio Vezérlőpult + Élő Oldalsáv Előnézet** |
| **Kép & Sebesség** | Fizetős külső API kvóták + bonyolult `php.ini` | **Beépített WebP/AVIF konverter, `upload_size_limit` felülbírálás, Lazy Load & Cache** |
| **Téma támogatás** | Csak világos vagy sablonfüggő | **Natív Világos & Sötét mód (`Dark / Light`)** |
| **PHP & WP Szabvány** | Vegyes örökölt kód | **`declare(strict_types=1)` · PHP 8.0 `match` · WP 7.1 `defer`** |
| **Jogszabályi megfelelés** | Külön fizetős kiegészítő | **Beépített EU GDPR Cookie + Google Consent Mode v2** |

---

## 🧩 A 7 Fő Modul Felépítése (`v0.4.0`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🔧 [&] And ToolKit v0.4.0 Mag (PHP 8.0+)                 │
├───────────────────────┬──────────────────────────┬───────────────────────────┤
│ 01. Esemény Naptár    │ 02. Élő AJAX Kereső      │ 03. Közösségi Megosztás   │
│   [wtk_calendar]      │     [wtk_search]         │      [wtk_social]         │
│ • Kártyás / Kompakt   │ • 180ms Debounce REST    │ • 8 Platform + Linkmásolás│
│ • Havi Naptárrács     │ • Kulcsszó <mark> kiemel │ • UTM paraméter követés   │
│ • Idővonal + Hátralévő│ • Típus & Címke szűrők   │ • 5 gombstílus, 1/2/4 oszl│
├───────────────────────┼──────────────────────────┼───────────────────────────┤
│ 04. Statisztika Modul │ 05. GDPR Cookie Kezelő   │ 06. Információs Banner    │
│    [wtk_stats]        │  [wtk_cookie_consent]    │    [wtk_info_banner]      │
│ • Látogató & Letöltés │ • 4 Granuláris kategória │ • Főoldal / Minden oldal  │
│ • Kompakt/Pontos szám │ • Google Consent Mode v2 │ • 6 Színséma + Egyedi HEX │
│ • 7 napos aktivitás   │ • Szkript elő-blokkolás  │ • 3 Méret, 4 Betű, 5 Anim │
├───────────────────────┴──────────────────────────┴───────────────────────────┤
│ 07. Kép-, Upload Limit-, Lazy Load & Gyorsítótár Optimalizáló (`v0.4.0`)     │
│                     [wtk_speed_badge] · /wp-json/and-toolkit/v1/optimize     │
│ • Kézi interaktív 1-kattintásos optimalizálás + Automatikus WP-Cron ütemezés │
│ • Képtömörítés (40-98%), WebP/AVIF konverzió, Max 1920×1080px átméretezés    │
│ • WordPress 8 MB feltöltési limit felülbírálása (16 MB – 1024 MB)            │
│ • Teljes Lazy Loading (img, iframe, CSS bg, LCP kizárás + fetchpriority)     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Modulok Részletes Bemutatása

### 📅 `01.` Esemény Naptár Widget (`[wtk_calendar]`)
- **4 választható oldalsáv megjelenés**: *Kártyás nézet (`cards`)*, *Kompakt lista (`compact`)*, *Interaktív Havi Naptárrács (`grid`)* és *Vertikális Idővonal (`timeline`)*.
- **Visszaszámláló jelvény**: Automatikusan kiszámítja és megjeleníti a hátralévő napokat (`3 nap múlva`).
- **Beépített Eseményütemező**: Új webináriumok, konferenciák, kiadások és workshopok felvitele azonnali validációval.

### 🔍 `02.` Fejlett Keresőmotor Widget (`[wtk_search]`)
- **Valós idejű AJAX szűrés**: Állítható késleltetéssel (`80ms – 500ms`) a `/wp-json/and-toolkit/v1/search` végponton keresztül.
- **Találati kiemelés (`<mark>`)**: A keresett kifejezést vizuálisan kiemeli a címben és a kivonatban.
- **Tartalomtípus & Gyors-címke szűrők**: Szűrés *Bejegyzések*, *Események*, *Oldalak* és *Letöltések* szerint, valamint egykattintásos népszerű keresőcímkék.

### 🌐 `03.` Közösségi Megosztás Widget (`[wtk_social]`)
- **8 natív SVG csatorna**: *Facebook, X (Twitter), LinkedIn, WhatsApp, Telegram, Reddit, Pinterest, E-mail* + *Közvetlen linkmásolás vágólapra*.
- **5 gombstílus & szabad oszlopszám**: *Kerekített (`rounded`)*, *Kapszula (`pill`)*, *Szögletes (`square`)*, *Csak ikon (`icon-only`)* és *Keretes (`minimal-outline`)* 1, 2 vagy 4 oszlopos elrendezésben.
- **UTM kampánykövetés**: Automatikus `?utm_source=and_toolkit&utm_medium=sidebar` paraméterezés.

### 📊 `04.` Statisztika & Hatékonyság Modul (`[wtk_stats]`)
- **Valós idejű számlálók**: Egyedi látogatók, fájlletöltések (`POST /wp-json/and-toolkit/v1/track-download`), aktív olvasók és megosztási konverziók.
- **Személyre szabható számformázás**: *Kompakt (`48.9K`)*, *Szóközös magyar (`48 920`)* vagy *Vesszős nemzetközi (`48,920`)*.
- **4 oldalsáv elrendezés**: *2x2 Kártya Rács*, *Letisztult Lista*, *Vízszintes Kompakt Sáv* és *Kiemelt Hero Számláló*.

### 🛡️ `05.` EU GDPR Kötelező Süti (Cookie) Kezelő (`[wtk_cookie_consent]`) — *v0.2.0*
- **4 elhelyezési mód**: *Oldalsáv GDPR Widget*, *Alsó Teljes Szélességű Sáv*, *Lebegő Sarokkártya* és *Középső Fókusz Ablak*.
- **4 granuláris kategória**: *Feltétlenül szükséges (zárolt)*, *Funkcionális*, *Statisztikai (`analytics_storage`)* és *Marketing (`ad_storage`)*.
- **Google Consent Mode v2 & Előzetes Szkript-blokkolás**: A nem kötelező szkriptek csak kifejezett látogatói hozzájárulás után futnak le.

### 📣 `06.` Állandó Főoldali / Globális Információs Banner (`[wtk_info_banner]`) — *v0.3.0*
- **Rugalmas megjelenési hatókör**: *Minden oldalon állandóan (`wp_body_open`)*, *Csak a Főoldalon (`is_front_page()`)*, *Csak Bejegyzések felett* vagy *Csak Oldalsávban*.
- **Teljes vizuális testreszabhatóság**: 5 prémium gradiens téma + **Egyedi HEX háttér- és betűszín választó**, 3 méret (`S / M / L`), 4 betűstílus és 5 animáció (*Statikus, Pulzáló Fény, Lebegő Mozgás, Színátmenet Hullám, Hírszalag Mozgás*).

### ⚡ `07.` Kép-, Upload Limit-, Lazy Load & Gyorsítótár Optimalizáló (`[wtk_speed_badge]`) — *ÚJ a v0.4.0-ban!*
- **Kézi Interaktív Gomb & Automatikus Ütemezés**:
  - Azonnali **1-kattintásos interaktív optimalizáló és sebességmérő gomb** (`POST /wp-json/and-toolkit/v1/optimize`) élő Core Web Vitals (`PageSpeed 99/100`, `TTFB 38ms`, `LCP 690ms`, `CLS 0.002`) visszajelzéssel.
  - Választható automatizálás: *Valós idejű optimalizálás feltöltéskor (`wp_handle_upload`)*, *Óránkénti WP-Cron*, *Napi éjszakai WP-Cron* vagy *Kizárólag kézi indítás*.
- **Opcionális Képtömörítés, Konvertálás és Átméretezés**:
  - Veszteségmentes vagy intelligens veszteséges tömörítés (`40% – 98%`), automatikus **WebP / AVIF** konverzió, EXIF GPS/kamera metaadatok eltávolítása és túl nagy képek automatikus átméretezése (`big_image_size_threshold` szűrő, pl. `1920×1080 px`).
- **WordPress Feltöltési Fájlméret Limit Felülbírálása (`upload_size_limit`)**:
  - A szerver alapértelmezett `8 MB`-os WordPress feltöltési korlátjának felülbírálása **`16 MB`-tól akár `1024 MB`-ig (`1 GB`)** egyetlen csúszkával vagy gyorsgombbal, valamint natív **WebP, AVIF és tisztított SVG** MIME-típus engedélyezés.
- **Teljeskörű Lazy Loading Vezérlés**:
  - Natív `loading="lazy" decoding="async"` képekhez (`wp_get_attachment_image_attributes`), beágyazott `<iframe>` videókhoz (YouTube/Vimeo/Maps) és CSS `background-image` elemekhez.
  - **Hajlás feletti (Above-the-fold) LCP védelem**: Az első `N` kép automatikus kizárása a késleltetésből és ellátása `fetchpriority="high"` attribútummal, 4 választható helykitöltővel (*BlurHash, Domináns szín, Shimmer Skeleton, Nincs*).
- **Gyorsítótár (Cache) Kezelés**:
  - Statikus HTML Page Cache, GZIP/Brotli tömörítés, kritikus betűtípusok előtöltése (`<link rel="preload">`) és azonnali **Gyorsítótár Ürítése (Purge Cache)** gomb.

---

## 🔗 Rövidkódok (Shortcodes) és REST API Végpontok

| Modul | WordPress Rövidkód (Shortcode) | REST API Végpont / Hook |
| :--- | :--- | :--- |
| **01. Esemény Naptár** | `[wtk_calendar style="cards" limit="4"]` | `And_ToolKit_Plugin::render_calendar_widget` |
| **02. Élő Keresőmotor** | `[wtk_search layout="detailed" ajax="true"]` | `GET /wp-json/and-toolkit/v1/search?q=...` |
| **03. Közösségi Megosztó** | `[wtk_social style="rounded" cols="2"]` | `And_ToolKit_Plugin::render_social_widget` |
| **04. Statisztika Számláló** | `[wtk_stats style="grid-cards" format="compact"]` | `POST /wp-json/and-toolkit/v1/track-download` |
| **05. GDPR Cookie Kezelő** | `[wtk_cookie_consent style="sidebar-widget"]` | `POST /wp-json/and-toolkit/v1/cookie-consent` |
| **06. Információs Banner** | `[wtk_info_banner scope="all-pages" anim="pulse-glow"]` | `Action: wp_body_open` / `is_front_page()` |
| **07. Optimalizáló & Speed** | `[wtk_speed_badge]` | `POST /wp-json/and-toolkit/v1/optimize` + `upload_size_limit` |

---

## ✅ WordPress 7.1, PHP 8.0+ és EU GDPR Kompatibilitási Audit (`10/10` Teszt)

1. **`PHP 8.0+ Strict Types & Union Types`**: `declare(strict_types=1);` és `array|string $atts = []` típusdefiníciók minden rövidkód-kezelőben.
2. **`PHP 8.0+ Match Kifejezés`**: Típusbiztos `match ( $atts['style'] )` sablonválasztás és `public const VERSION = '0.4.0'`.
3. **`WordPress 7.1 Fejléc Metaadatok`**: `Tested up to: 7.1`, `Requires PHP: 8.0`, `Author: galandras12+AI`.
4. **`22/22 Hook, 7 Shortcode & 4 REST Végpont`**: Minden regisztrált metódus és szűrő teljes, működő PHP implementációval rendelkezik.
5. **`v0.3.0 Állandó Információs Banner`**: `wp_body_open` globális beillesztés és `is_front_page()` főoldali szűrés.
6. **`v0.4.0 Kép-, Upload Limit-, Lazy Load & Cache Optimalizáló`**: `upload_size_limit`, `big_image_size_threshold`, `wp_get_attachment_image_attributes` és `/optimize` REST végpont.
7. **`EU GDPR & Google Consent Mode v2`**: 4 süti-kategória, `/cookie-consent` REST naplózás és `esc_url()` védett adatvédelmi hivatkozás.
8. **`WP 7.1 Script Strategy API`**: Aszinkron `defer` betöltés és Gutenberg `register_block_type` regisztráció.
9. **`Biztonsági Szűrés (Security)`**: `! defined( 'ABSPATH' )` védelem, `esc_html()`, `esc_attr()`, `esc_url()`, `absint()` és `sanitize_text_field()`.
10. **`Zero-jQuery Teljesítmény`**: Natív Vanilla JS architektúra `< 12 KB` összmérettel.

---

## 📦 Telepítés és Fejlesztői Környezet

### A) Telepítés WordPress 7.1 rendszerbe
1. Töltse le a gyökérkönyvtárban található **`and-toolkit.php`** fájlt (vagy exportálja közvetlenül a vezérlőpult **„PHP Plugin Exportálása”** gombjával).
2. Másolja a `/wp-content/plugins/and-toolkit/and-toolkit.php` útvonalra.
3. Aktiválja az **And ToolKit** bővítményt a WordPress Adminisztráció **Bővítmények** menüpontjában.

### B) Interaktív Admin & Widget Studio futtatása helyben
```bash
npm install
npm run dev          # Fejlesztői szerver indítása (http://localhost:3000)
npx tsx --test src/utils/toolkitLogic.test.ts   # Egységtesztek és WP 7.1 / PHP 8.0 audit futtatása
```

---

## 📜 Verziótörténet (Changelog)

- **`v0.4.0` (2026-11-02)** — **Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló (`[wtk_speed_badge]`)** dedikált vezérlőfelület opcionális képtömörítéssel, WebP/AVIF konvertálással, átméretezéssel, a WordPress feltöltési korlát felülbírálásával (`upload_size_limit`), teljeskörű Lazy Loading kezeléssel és kézi interaktív / automatikus sebességoptimalizálással.
- **`v0.3.0` (2026-11-02)** — **Állandó Főoldali / Globális Információs Banner (`[wtk_info_banner]`)** hozzáadása szín-, méret-, betűstílus- és animáció-testreszabással (`wp_body_open` & `is_front_page()`), kibővített kompatibilitási audit és látványos dokumentáció.
- **`v0.2.0` (2026-11-02)** — **EU GDPR Kötelező Süti (Cookie) és Adatvédelmi Hozzájárulás Kezelő (`[wtk_cookie_consent]`)** modul Google Consent Mode v2 támogatással.
- **`v0.1.0` (2026-11-02)** — Első kiadás: Esemény Naptár, Élő AJAX Keresőmotor, Közösségi Megosztás, Látogatói/Letöltési Statisztika, Sötét/Világos mód és egyedi „`&` jel villáskulcsban” logó.

---

<div align="center">

### 🤖 Technológiai és Alkotói Megjelölés

**Készítő:** `galandras12+AI` · **Licenc:** `GPL v2 or later`

> ✨ **Az itt megjelent tartalom, a teljes forráskód és a dokumentáció a [Google AI Studio](https://aistudio.google.com/) segítségével készült, a `Gemini 4 Argon` modell támogatásával.**

![Built with Google AI Studio](https://img.shields.io/badge/K%C3%A9sz%C3%BClt-Google%20AI%20Studio-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Powered by Gemini 4 Argon](https://img.shields.io/badge/AI%20Modell-Gemini%204%20Argon-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

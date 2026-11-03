<div align="center">

# 🔧 `&` And ToolKit — WordPress 7.1 Admin & Widget Studio

### Moduláris Oldalsáv Widgetek · Élő AJAX Kereső · Közösségi Megosztó · Analitika · EU GDPR Cookie · Állandó Információs Banner · Kép/Upload/Lazy-Load Optimalizáló · Biztonsági Audit Napló & E-mail Értesítő

![Version](https://img.shields.io/badge/Verzi%C3%B3-0.5.0-2563EB?style=for-the-badge&logo=semanticrelease&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-7.1%20Ready-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B%20Strict-777BB4?style=for-the-badge&logo=php&logoColor=white)
![GDPR](https://img.shields.io/badge/EU%20GDPR-Consent%20Mode%20v2-10B981?style=for-the-badge&logo=shield&logoColor=white)
![AuditLog](https://img.shields.io/badge/Audit%20Log-.LOG%20%7C%20.TXT%20%7C%20.CSV-F59E0B?style=for-the-badge&logo=databricks&logoColor=white)
![Author](https://img.shields.io/badge/K%C3%A9sz%C3%ADt%C5%91-galandras12%2BAI-0F172A?style=for-the-badge)

---

**Egyetlen modern, villámgyors (`< 13 KB`, Zero-jQuery) WordPress bővítmény, amely 8 nélkülözhetetlen frontend, teljesítmény-optimalizáló, biztonsági naplózó és adminisztrációs modult egyesít valós idejű oldalsáv előnézettel, sötét/világos móddal és reszponzív mobilnézettel.**

</div>

---

## ✨ Miért az And ToolKit?

| Jellemző | Hagyományos WordPress Bővítmények (8 külön plugin) | **🔧 `&` And ToolKit (`v0.5.0`)** |
| :--- | :--- | :--- |
| **Függőségek** | jQuery + nehéz külső ikonfontok (`180+ KB`) | **Zero-jQuery · Beágyazott SVG (`~13.0 KB`)** |
| **Adminisztráció** | 8 különálló, eltérő stílusú beállítóoldal | **Egységes Studio Vezérlőpult + Élő Oldalsáv Előnézet** |
| **Kép & Sebesség** | Fizetős külső API kvóták + bonyolult `php.ini` | **Beépített WebP/AVIF konverter, `upload_size_limit` felülbírálás, Lazy Load & Cache** |
| **Biztonsági Napló** | Nehéz adatbázis-terhelő biztonsági csomagok | **8-kategóriás Audit Napló (`.log`, `.txt`, `.csv` mentés) + Okos E-mail Riasztók** |
| **Téma támogatás** | Csak világos vagy sablonfüggő | **Natív Világos & Sötét mód (`Dark / Light`)** |
| **PHP & WP Szabvány** | Vegyes örökölt kód | **`declare(strict_types=1)` · PHP 8.0 `match` · WP 7.1 `defer`** |

---

## 🧩 A 8 Fő Modul Felépítése (`v0.5.0`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🔧 [&] And ToolKit v0.5.0 Mag (PHP 8.0+)                 │
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
├───────────────────────┴──────────────┬───────────┴───────────────────────────┤
│ 07. Kép, Upload, Lazy Load & Cache   │ 08. Biztonsági Napló & E-mail (v0.5.0)│
│        [wtk_speed_badge]             │        [wtk_security_badge]           │
│ • WebP/AVIF tömörítés + átméretezés  │ • Belépés, Plugin, Téma, Poszt, Oldal │
│ • WP 8 MB feltöltési limit felülírás │ • Felhasználó létrehozás módja & csop.│
│ • Teljes Lazy Load (img, iframe, bg) │ • Auto & WP Core frissítés naplózás   │
│ • Kézi interaktív & auto sebességmérő│ • .LOG / .TXT / .CSV mentés + E-mail  │
└──────────────────────────────────────┴───────────────────────────────────────┘
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
- **Teljes vizuális testreszabhatóság**: 5 prémium gradiens téma + **Egyedi HEX háttér- és betűszín választó**, 3 méret (`S / M / L`), 4 betűstílus és 5 animáció.

### ⚡ `07.` Kép-, Upload Limit-, Lazy Load & Gyorsítótár Optimalizáló (`[wtk_speed_badge]`) — *v0.4.0*
- **Kézi Interaktív Gomb & Automatikus Ütemezés**: 1-kattintásos optimalizálás és sebességmérés (`PageSpeed 99/100`, `TTFB 38ms`, `LCP 690ms`) vagy automatikus WP-Cron ütemezés.
- **Képtömörítés, WebP/AVIF Konvertálás, Átméretezés & Upload Limit Felülbírálás**: A WordPress `8 MB`-os feltöltési korlátjának felülbírálása akár **`1024 MB`-ig (`upload_size_limit`)** és teljeskörű Lazy Loading.

### 🔐 `08.` Biztonsági Audit Naplózás & E-mail Értesítés Modul (`[wtk_security_badge]`) — *ÚJ a v0.5.0-ban!*
- **8 Teljes Körűen Naplózott Eseménykategória**:
  1. **Felhasználói bejelentkezések (`wp_login`)**: Melyik felhasználó mikor, milyen IP-címről/helyről és eszközről jelentkezett be.
  2. **Plugin műveletek (`upgrader_process_complete`, `deleted_plugin`)**: Mikor telepít, frissít vagy töröl egy bővítményt.
  3. **Téma műveletek (`upgrader_process_complete`, `switch_theme`)**: Mikor telepít, frissít vagy töröl egy WordPress sablont.
  4. **Poszt (Bejegyzés) műveletek (`save_post`, `before_delete_post`)**: Melyik felhasználó mikor hoz létre, szerkeszt vagy töröl egy posztot.
  5. **Oldal (Page) műveletek (`save_post_page`, `before_delete_post`)**: Melyik felhasználó mikor hoz létre, szerkeszt át vagy töröl egy oldalt.
  6. **Felhasználói életciklus és létrehozás módja (`user_register`, `set_user_role`, `delete_user`)**: Rögzíti, mikor hoznak létre felhasználót és **milyen módon** (*nyilvános regisztrációs űrlap*, *másik felhasználó meghívója* vagy *admin felületen létrehozás*), mikor helyezik át másik felhasználói csoportba, illetve mikor törölnek felhasználót.
  7. **Automatizált rendszerfrissítések (`automatic_updates_complete`)**: Mikor végez az automatizált háttérfrissítéssel a WordPress rendszere.
  8. **WordPress mag (Core) frissítések (`_core_updated_successfully`)**: Mikor és **ki indította el** a WordPress alaprendszer frissítését.
- **Naplófájl Mentése `.LOG`, `.TXT` vagy `.CSV` Formátumban**:
  - Egyetlen kattintással letölthető szabványos syslog **`.log`**, strukturált **`.txt`** vagy táblázatkezelő-kompatibilis **`.csv`** fájlba (`/wp-json/and-toolkit/v1/audit-export`).
- **Opcionálisan Ki-Be Kapcsolható E-mail Értesítések**:
  - **Belépési e-mail szűrő**: Választható értesítés *minden felhasználó*, *kizárólag csak szerkesztők (`editors-only`)* vagy *kizárólag csak adminisztrátorok (`admins-only`)* belépéséről.
  - **Új helyről vagy új eszközről történő belépés riasztás**: Ki-be kapcsolható e-mail riasztás opcionálisan kijelölhető felhasználói csoportokhoz (*Adminisztrátor, Szerkesztő, Szerző, Közreműködő, Feliratkozó*).
  - **Elérhető frissítés e-mail értesítő (Aktuális verzió → Új verzió)**: Ki-be kapcsolható e-mail értesítés, ha egy pluginhoz, témához vagy WordPress mag verzióhoz frissítés érkezik, pontosan megjelölve az aktuális és az új verziószámot (pl. `v7.1.0 ---> v7.1.1-security`).
  - **24 órás automatikus frissítések napi e-mail összefoglalója**: Ki-be kapcsolható napi összefoglaló szabadon választható időpontban (pl. `08:00`), ha az elmúlt 24 órában automatikusan frissült egy plugin, téma vagy WordPress mag verzió.

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
| **08. Biztonsági Audit Napló** | `[wtk_security_badge]` | `GET /wp-json/and-toolkit/v1/audit-export?format=log\|txt\|csv` |

---

## ✅ WordPress 7.1, PHP 8.0+ és EU GDPR Kompatibilitási Audit (`11/11` Teszt)

1. **`PHP 8.0+ Strict Types, Union Types & Nullable`**: `declare(strict_types=1);`, `array|string $atts = []` és `?int $reassign` típusdefiníciók.
2. **`PHP 8.0+ Match Kifejezések`**: Típusbiztos `match ()` sablon- és belépési jogosultság-ellenőrzés, valamint `public const VERSION = '0.5.0'`.
3. **`WordPress 7.1 Fejléc Metaadatok`**: `Tested up to: 7.1`, `Requires PHP: 8.0`, `Author: galandras12+AI`.
4. **`36/36 Metódus, 17 Action, 3 Filter, 8 Shortcode & 5 REST Végpont`**: Minden regisztrált metódus és szűrő teljes, működő PHP implementációval rendelkezik.
5. **`v0.5.0 Biztonsági Audit Naplózás (.log/.txt/.csv) & E-mail Értesítők`**: `wp_login`, `upgrader_process_complete`, `save_post`, `user_register`, `set_user_role`, `automatic_updates_complete`, `_core_updated_successfully` és `wp_mail()` integráció.
6. **`v0.4.0 Kép-, Upload Limit-, Lazy Load & Cache Optimalizáló`**: `upload_size_limit`, `big_image_size_threshold`, `wp_get_attachment_image_attributes` és `/optimize` REST végpont.
7. **`v0.3.0 Állandó Információs Banner`**: `wp_body_open` globális beillesztés és `is_front_page()` főoldali szűrés.
8. **`EU GDPR & Google Consent Mode v2`**: 4 süti-kategória, `/cookie-consent` REST naplózás és `esc_url()` védett adatvédelmi hivatkozás.
9. **`WP 7.1 Script Strategy API`**: Aszinkron `defer` betöltés és Gutenberg `register_block_type` regisztráció.
10. **`Biztonsági Szűrés (Security)`**: `! defined( 'ABSPATH' )` védelem, `esc_html()`, `esc_attr()`, `esc_url()`, `absint()`, `sanitize_email()` és `sanitize_text_field()`.
11. **`Zero-jQuery Teljesítmény`**: Natív Vanilla JS architektúra `< 14 KB` összmérettel.

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

- **`v0.5.0` (2026-11-03)** — **Biztonsági Audit Naplózás & E-mail Értesítés Modul (`[wtk_security_badge]`)**: 8 eseménykategória naplózása (bejelentkezések, plugin/téma/poszt/oldal műveletek, felhasználó létrehozás módja / csoportváltás / törlés, automatizált rendszerfrissítés, WP mag frissítés), `.log` / `.txt` / `.csv` fájl exportálás, valamint ki-be kapcsolható szerepkör-alapú és új hely/eszköz belépési e-mailek, verziókövető frissítési értesítők és 24 órás napi összefoglaló.
- **`v0.4.0` (2026-11-02)** — **Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló (`[wtk_speed_badge]`)** dedikált vezérlőfelület opcionális képtömörítéssel, WebP/AVIF konvertálással, átméretezéssel, a WordPress feltöltési korlát felülbírálásával (`upload_size_limit`), teljeskörű Lazy Loading kezeléssel és kézi interaktív / automatikus sebességoptimalizálással.
- **`v0.3.0` (2026-11-02)** — **Állandó Főoldali / Globális Információs Banner (`[wtk_info_banner]`)** hozzáadása szín-, méret-, betűstílus- és animáció-testreszabással (`wp_body_open` & `is_front_page()`).
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

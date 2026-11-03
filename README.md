<div align="center">

# 🔧 `&` And ToolKit — WordPress 7.1 Admin & Widget Studio

### Moduláris Oldalsáv Widgetek · Élő AJAX Kereső · Közösségi Megosztó · Analitika · EU GDPR Cookie · Állandó Információs Banner · Kép/Upload/Lazy-Load Optimalizáló · Biztonsági Audit Napló & E-mail Értesítő

![Version](https://img.shields.io/badge/Verzi%C3%B3-0.5.2-2563EB?style=for-the-badge&logo=semanticrelease&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-7.1%20Ready-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B%20Strict-777BB4?style=for-the-badge&logo=php&logoColor=white)
![GDPR](https://img.shields.io/badge/EU%20GDPR-Consent%20Mode%20v2-10B981?style=for-the-badge&logo=shield&logoColor=white)
![AuditLog](https://img.shields.io/badge/Audit%20Log-.LOG%20%7C%20.TXT%20%7C%20.CSV-F59E0B?style=for-the-badge&logo=databricks&logoColor=white)
![Author](https://img.shields.io/badge/K%C3%A9sz%C3%ADt%C5%91-galandras12%2BAI-0F172A?style=for-the-badge)

---

**Egyetlen fájlból telepíthető, Zero-jQuery WordPress bővítmény, amely 8 frontend, teljesítmény-optimalizáló, biztonsági naplózó és adminisztrációs modult egyesít. A beállítások a WordPress admin felületen mentődnek; a React alapú Studio élő előnézetet és PHP-exportot ad.**

</div>

---

## ✨ Miért az And ToolKit?

| Jellemző | Hagyományos WordPress Bővítmények (8 külön plugin) | **🔧 `&` And ToolKit (`v0.5.2`)** |
| :--- | :--- | :--- |
| **Függőségek** | jQuery + nehéz külső ikonfontok (`180+ KB`) | **Zero-jQuery · beágyazott Vanilla JS és CSS, külső asset nélkül** |
| **Adminisztráció** | 8 különálló, eltérő stílusú beállítóoldal | **Egy WP beállítóoldal (Settings API) + Studio előnézet** |
| **Kép & Sebesség** | Fizetős külső API kvóták | **WebP/AVIF kimeneti formátum (ha a szerver támogatja), tömörítési minőség, Lazy Load, opcionális oldal-gyorsítótár** |
| **Biztonsági Napló** | Nehéz biztonsági csomagok | **Adatbázisban tárolt audit napló (`.log`, `.txt`, `.csv` export) + Critical Only e-mail riasztó** |
| **Téma támogatás** | Csak világos vagy sablonfüggő | **Natív Világos & Sötét mód (`Dark / Light`)** |
| **PHP & WP Szabvány** | Vegyes örökölt kód | **`declare(strict_types=1)` · PHP 8.0 `match` · WP 6.3+ script `strategy`** |

---

## 🧩 A 8 Fő Modul Felépítése (`v0.5.2`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🔧 [&] And ToolKit v0.5.2 Mag (PHP 8.0+)                 │
├───────────────────────┬──────────────────────────┬───────────────────────────┤
│ 01. Esemény Naptár    │ 02. Élő AJAX Kereső      │ 03. Közösségi Megosztás   │
│   [wtk_calendar]      │     [wtk_search]         │      [wtk_social]         │
│ • Kártyás / Kompakt   │ • 180ms Debounce REST    │ • 8 Platform + Linkmásolás│
│ • Havi Naptárrács     │ • Kulcsszó <mark> kiemel │ • UTM paraméter követés   │
│ • Idővonal + Hátralévő│ • Típus szűrő (poszt/olda│ • 5 gombstílus, 1/2/4 oszl│
├───────────────────────┼──────────────────────────┼───────────────────────────┤
│ 04. Statisztika Modul │ 05. GDPR Cookie Kezelő   │ 06. Információs Banner    │
│    [wtk_stats]        │  [wtk_cookie_consent]    │    [wtk_info_banner]      │
│ • Látogató & Letöltés │ • 4 Granuláris kategória │ • Főoldal / Minden oldal  │
│ • Kompakt/Pontos szám │ • Google Consent Mode v2 │ • 6 Színséma + Egyedi HEX │
│ • 7 napos aktivitás   │ • Szkript elő-blokkolás  │ • 3 Méret, 4 Betű, 5 Anim │
├───────────────────────┴──────────────┬───────────┴───────────────────────────┤
│ 07. Kép, Upload, Lazy Load & Cache   │ 08. Biztonsági Napló & E-mail (v0.5.2)│
│        [wtk_speed_badge]             │        [wtk_security_badge]           │
│ • WebP/AVIF tömörítés + átméretezés  │ • Belépés, Plugin, Téma, Poszt, Oldal │
│ • Feltöltési limit (PHP-plafonig)    │ • Felhasználó létrehozás módja & csop.│
│ • Teljes Lazy Load (img, iframe, bg) │ • Auto & WP Core frissítés naplózás   │
│ • Opcionális oldal-gyorsítótár       │ • .LOG / .TXT / .CSV mentés + E-mail  │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🚀 Modulok Részletes Bemutatása

### 📅 `01.` Esemény Naptár Widget (`[wtk_calendar]`)
- **4 választható oldalsáv megjelenés**: *Kártyás nézet (`cards`)*, *Kompakt lista (`compact`)*, *Interaktív Havi Naptárrács (`grid`)* és *Vertikális Idővonal (`timeline`)*.
- **Visszaszámláló jelvény**: Automatikusan kiszámítja és megjeleníti a hátralévő napokat (`3 nap múlva`).
- **Eseménydátum meta mező**: a szerkesztőben megadott dátumú (`_wtk_event_date`) bejegyzések/oldalak jelennek meg a naptárban; rövidkód-attribútumok: `style`, `limit`.

### 🔍 `02.` Fejlett Keresőmotor Widget (`[wtk_search]`)
- **Valós idejű AJAX szűrés**: Állítható késleltetéssel (`80ms – 500ms`) a `/wp-json/and-toolkit/v1/search` végponton. A végpont **kizárólag publikus, jelszó nélküli tartalmat** ad vissza (azonosító, cím, URL, típus, kivonat); ütemezett vagy jelszóvédett poszt nem szivárog ki.
- **Találati kiemelés (`<mark>`)**: A keresett kifejezést vizuálisan kiemeli a címben és a kivonatban.
- **Tartalomtípus & Gyors-címke szűrők**: Szűrés *Bejegyzések*, *Események*, *Oldalak* és *Letöltések* szerint, valamint egykattintásos népszerű keresőcímkék.

### 🌐 `03.` Közösségi Megosztás Widget (`[wtk_social]`)
- **8 natív SVG csatorna**: *Facebook, X (Twitter), LinkedIn, WhatsApp, Telegram, Reddit, Pinterest, E-mail* + *Közvetlen linkmásolás vágólapra*.
- **5 gombstílus & szabad oszlopszám**: *Kerekített (`rounded`)*, *Kapszula (`pill`)*, *Szögletes (`square`)*, *Csak ikon (`icon-only`)* és *Keretes (`minimal-outline`)* 1, 2 vagy 4 oszlopos elrendezésben.
- **UTM kampánykövetés**: Automatikus `?utm_source=and_toolkit&utm_medium=sidebar` paraméterezés.

### 📊 `04.` Statisztika & Hatékonyság Modul (`[wtk_stats]`)
- **Valós, összesített számlálók**: látogatások (munkamenetenként, `POST /track-visit`), fájlletöltések (`POST /track-download`) és 7 napos aktivitás. Nulláról indulnak; a végpontok rate limitesek, a letöltés-követés csak saját domain és ismert fájlkiterjesztés esetén számol. Személyes adat nem tárolódik; GDPR-modul mellett a látogatás-számlálás csak statisztikai hozzájárulás után fut.
- **Személyre szabható számformázás**: *Kompakt (`48.9K`)*, *Szóközös magyar (`48 920`)* vagy *Vesszős nemzetközi (`48,920`)*.
- **4 oldalsáv elrendezés**: *2x2 Kártya Rács*, *Letisztult Lista*, *Vízszintes Kompakt Sáv* és *Kiemelt Hero Számláló*.

### 🛡️ `05.` EU GDPR Kötelező Süti (Cookie) Kezelő (`[wtk_cookie_consent]`) — *v0.2.0*
- **4 elhelyezési mód**: *Oldalsáv GDPR Widget*, *Alsó Teljes Szélességű Sáv*, *Lebegő Sarokkártya* és *Középső Fókusz Ablak*.
- **4 granuláris kategória**: *Feltétlenül szükséges (zárolt)*, *Funkcionális*, *Statisztikai (`analytics_storage`)* és *Marketing (`ad_storage`)*.
- **Google Consent Mode v2**: `gtag('consent','default')` tiltott állapottal a `wp_head`-ben, hozzájáruláskor `update`.
- **Szkript-blokkolás**: az ismert követő domainekről (Google Tag Manager/Analytics, Meta, DoubleClick, Hotjar, Clarity stb.) betöltött szkriptek `type="text/plain"` + `data-atk-category` jelöléssel kerülnek az oldalba, és csak hozzájárulás után aktiválódnak. Egyedi szkripthez ugyanez a jelölés kézzel is használható.
- **Hozzájárulás-napló**: a `POST /cookie-consent` pszeudonimizált (sózott hash) IP-vel, szinttel és kategóriákkal rögzít egy sort a `wp_and_toolkit_consent` táblába (az igazolhatóság miatt 3 évig).

### 📣 `06.` Állandó Főoldali / Globális Információs Banner (`[wtk_info_banner]`) — *v0.3.0*
- **Hatókör**: *minden oldalon* (`wp_body_open`), *csak főoldalon* (`is_front_page()`), *csak bejegyzéseknél* (`blog-posts`) vagy *csak rövidkóddal*.
- **Megjelenés**: 5 gradiens téma + **egyedi HEX háttér-/betűszín** (validálva), 3 méret, 4 betűstílus, 5 animáció, tapadó sáv és bezárható mód.

### ⚡ `07.` Kép-, Upload Limit-, Lazy Load & Gyorsítótár Optimalizáló (`[wtk_speed_badge]`) — *v0.4.0, v0.5.2-ben javítva*
- **Feltöltési limit**: az `upload_size_limit` szűrő a kért értéket (max. 1024 MB) **a PHP tényleges plafonjára (`upload_max_filesize`, `post_max_size`) korlátozza**, mert ezek futásidőben nem emelhetők. Az admin oldal mutatja a hatékony és a PHP-s értéket.
- **Képfeldolgozás**: `wp_editor_set_quality` (tömörítési minőség), `image_editor_output_format` (WebP/AVIF kimenet, ha a szerver képszerkesztője támogatja) és `big_image_size_threshold` (nagy képek átméretezése). Csak új feltöltésekre/méretekre hat.
- **Lazy load**: a WordPress saját API-ján (`wp_lazy_loading_enabled`, `wp_omit_loading_attr_threshold`) keresztül; az oldal tetején állítható számú kép nem lesz lusta (LCP védelem). Háttérképekhez `data-atk-bg="url"` attribútum + IntersectionObserver.
- **Oldal-gyorsítótár (opcionális)**: csak kijelentkezett, süti nélküli, paraméter nélküli GET kérésekre; tartalomváltozáskor, sablonváltáskor és frissítéskor automatikusan érvénytelenedik; `X-And-ToolKit-Cache: HIT|MISS` fejléc.
- **Kézi gomb és időzítés**: az admin oldalon „Gyorsítótár ürítése most”, valamint WP-Cron alapú óránkénti/napi ürítés. A `POST /optimize` ugyanezt végzi.

### 🔐 `08.` Biztonsági Audit Naplózás & E-mail Értesítés Modul (`[wtk_security_badge]`) — *v0.5.0–v0.5.2*
- **Valódi napló adatbázisban** (`wp_and_toolkit_audit`): idő (UTC), kategória, súlyosság, felhasználó, szerepkör, IP, böngésző, cél és üzenet; beállítható megőrzési idő (alap: 90 nap, óránkénti WP-Cron törlés). Az admin oldalon az utolsó 100 esemény látható.
- **Naplózott események**: bejelentkezés; plugin telepítés/frissítés/törlés (név + verzió); téma telepítés/frissítés/váltás; poszt és oldal létrehozás/szerkesztés/kuka/végleges törlés (`wp_after_insert_post`, `before_delete_post`); felhasználó létrehozás (admin felületen vagy regisztrációs űrlapon), szerepkör-váltás, törlés; automatikus plugin/téma frissítések; WordPress mag frissítés (aktorral); fájlrendszer-változás.
- **Fájlrendszer-integritás**: óránként SHA-256 ellenőrzés a `wp-config.php`, az aktív bővítmények fő fájlja és az aktív téma `functions.php` fájlján; frissítés/aktiválás után az alapállapot újraépül, váratlan módosításnál kritikus bejegyzés és riasztás készül.
- **Export**: admin oldali letöltés (nonce + `manage_options`) valódi `.log` (syslog-szerű, egysoros), `.txt` vagy `.csv` fájlként (CSV képlet-injekció elleni védelemmel); a `GET /audit-export?format=...` JSON-ban adja vissza a tartalmat.
- **Critical Only (`critical_only_emails`)**: minden e-mail egyetlen `notify()` függvényen megy át, ezért a kapcsoló mindenhol érvényesül: bekapcsolva kizárólag a **WordPress mag frissítés** és a **fájlrendszer-változás** küld levelet.
- **E-mail értesítők** (a címzett üresen a webhely admin e-mail címe; nincs beégetett cím):
  - belépési értesítő: *minden felhasználó* / *szerkesztők* / *adminisztrátorok*;
  - új eszközről vagy új IP-ről történő belépés riasztás kijelölt szerepkörökre (az első megfigyelt eszköz alapállapot, nem riasztás);
  - elérhető frissítés értesítő (`v7.1.0 → v7.1.1`), óránkénti ellenőrzéssel, verziónként egyszer;
  - napi összefoglaló az elmúlt 24 óra automatikus frissítéseiről a beállított időpont után, naponta egyszer.

---

## 🔗 Rövidkódok (Shortcodes) és REST API Végpontok

| Modul | WordPress Rövidkód (Shortcode) | REST API Végpont / Hook |
| :--- | :--- | :--- |
| **01. Esemény Naptár** | `[wtk_calendar style="cards" limit="4"]` | meta mező: `_wtk_event_date` |
| **02. Élő Keresőmotor** | `[wtk_search layout="detailed"]` | `GET /wp-json/and-toolkit/v1/search?q=...&type=...` |
| **03. Közösségi Megosztó** | `[wtk_social style="rounded" cols="2"]` | — |
| **04. Statisztika Számláló** | `[wtk_stats style="grid-cards" format="compact"]` | `POST /track-download`, `POST /track-visit` |
| **05. GDPR Cookie Kezelő** | `[wtk_cookie_consent]` | `POST /cookie-consent` |
| **06. Információs Banner** | `[wtk_info_banner]` | `wp_body_open` + hatókör |
| **07. Optimalizáló & Speed** | `[wtk_speed_badge]` | `POST /optimize` (csak `manage_options`) |
| **08. Biztonsági Audit Napló** | `[wtk_security_badge]` (publikus, konfigurációt nem fed fel) | `GET /audit-export?format=log\|txt\|csv` (csak `manage_options`) |

A rövidkódok a Szöveg widgetben, a Rövidkód blokkban és klasszikus témákban is használhatók. A beállítások az **And ToolKit** admin menüben (Settings API) szerkeszthetők; a rövidkód-attribútumok felülírják az adott használat beállítását.

---

## ✅ Minőségbiztosítás (`v0.5.2`)

1. **Egy forrás, nincs elcsúszás**: a PHP sablon az `src/utils/pluginTemplate.ts`-ben van; a gyökér `and-toolkit.php` a `npm run build:plugin` parancsból készül, és egy teszt ellenőrzi, hogy bájtra egyezik a generátor kimenetével.
2. **Generátor-biztonság**: a Studio minden szövege PHP-escape-en (`\` és `'`) megy át, ezért nem törheti el a generált kódot.
3. **Statikus audit (12 ellenőrzés)**: a `auditWordPressPhpCompatibility` a valódi megvalósítás jeleit (DB-írás, nonce, rate limit, `has_password=false`, Consent Mode, WP szűrők) keresi, és a régi hibák visszatérését is jelzi (beégetett e-mail, nyers `get_posts()`, hiányzó asset); egy üres váz nem mehet át rajta.
4. **Futtatott ellenőrzések**: `tsc --noEmit`, `vite build`, 15 egységteszt (`npm test`), `php -l`, valamint WP-stubokkal futtatott PHP füst-teszt (konfig-összefésülés, szanitizálás, Critical Only, export, banner, szkript-blokkolás).
5. **Nincs élő WordPress-teszt**: a bővítményt valódi WordPress 7.1 / PHP 8.x környezetben még ki kell próbálni; a `Tested up to: 7.1` fejléc ezt addig nem igazolja.

---

## 📦 Telepítés és Fejlesztői Környezet

### A) Telepítés WordPress 7.1 rendszerbe
1. Töltse le a gyökérkönyvtárban található **`and-toolkit.php`** fájlt (vagy exportálja a Studio **„PHP Plugin Exportálása”** gombjával). Más fájl nem szükséges.
2. Másolja a `/wp-content/plugins/and-toolkit/and-toolkit.php` útvonalra.
3. Aktiválja az **And ToolKit** bővítményt a **Bővítmények** menüpontban (létrehozza a naplótáblákat és az óránkénti ütemezést).
4. Állítsa be a modulokat az **And ToolKit** admin menüben. Törléskor (uninstall) a bővítmény eltávolítja a tábláit és beállításait.

### B) Interaktív Admin & Widget Studio futtatása helyben
```bash
npm install
npm run dev          # Fejlesztői szerver indítása (http://localhost:3000)
npm test             # Egységtesztek és a PHP-sablon audit
npm run build:plugin # and-toolkit.php újragenerálása a sablonból
```

---

## 📜 Verziótörténet (Changelog)

- **`v0.5.2` (2026-11-03)** — **Biztonsági és működési javítócsomag (audit alapján)**:
  - **Biztonság**: a nyilvános `/search` többé nem ad vissza nyers `WP_Post` objektumot, jelszóvédett és ütemezett tartalmat; a számláló végpontok rate limitesek és validáltak; nincs beégetett e-mail cím (üresen az admin e-mail); a `[wtk_security_badge]` nem fed fel konfigurációt; CSV-injekció és log-forging elleni védelem; a generátor PHP-escape-el.
  - **Audit napló**: valódi adatbázistábla aktorral/IP-vel, valódi `.log/.txt/.csv` letöltés, fájlrendszer-integritás, elérhető-frissítés és napi összefoglaló WP-Cronnal, új eszköz riasztás; a Critical Only kapcsoló egy helyen érvényesül.
  - **Működő modulok**: beállítások mentése (Settings API) és admin felület; renderelt naptár/keresés/megosztó/statisztika/banner; GDPR süti-kezelő valódi felülettel, Consent Mode v2-vel, szkript-blokkolással és hozzájárulás-naplóval; beágyazott JS/CSS (a hiányzó `and-toolkit.min.js` megszűnt); minden rövidkód-attribútum működik.
  - **Optimalizáló**: kép minőség/formátum/átméretezés, WordPress-szabványos lazy load, PHP-plafonhoz kötött feltöltési limit, opcionális oldal-gyorsítótár.
  - **Egyéb**: `Requires at least: 6.3`, aktiválási/deaktiválási/uninstall hook, adatvédelmi szöveg, a hamis „PageSpeed 99/100” jellegű állítások eltávolítása, `build:plugin` + sablon/fájl azonosság teszt, 12 elemű szigorúbb statikus audit.
- **`v0.5.1` (2026-11-03)** — **Critical Only (Csak Kritikus) E-mail Szűrő (`criticalOnlyEmails`)**: Új kapcsoló a Biztonsági Audit Napló beállításaiban, amely bekapcsolva kizárólag a magas kockázatú eseményekről (WordPress Mag frissítések vagy fájlrendszer-változások) küld e-mail riasztást.
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

---

### 🔎 Audit

A **Claude Code**-ban a **Sonnet 5.5** modellje auditálta a **0.5.2** verziót, **2026. 11. 03.** dátummal.

<div align="center">

# 🔧 `&` And ToolKit — WordPress 7.1 Admin & Widget Studio

### Moduláris Oldalsáv Widgetek · Élő AJAX Kereső · Közösségi Megosztó · Analitika · EU GDPR Cookie · Állandó Információs Banner · Kép/Upload/Lazy-Load Optimalizáló · Biztonsági Audit Napló & E-mail · Botvédelem (reCAPTCHA v3 & Turnstile) · Hitelesítés (2FA, Időszinkron, Passkey, Offline Széf) · WP Rejtés & Mesterjelszó

![Version](https://img.shields.io/badge/Verzi%C3%B3-0.7.0-2563EB?style=for-the-badge&logo=semanticrelease&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-7.1%20Ready-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B%20Strict-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Auth](https://img.shields.io/badge/Hiteles%C3%ADt%C3%A9s-2FA%20%7C%20Passkey%20%7C%20Offline-4F46E5?style=for-the-badge&logo=webauthn&logoColor=white)
![WPHide](https://img.shields.io/badge/WP%20Rejt%C3%A9s-Stealth%20%26%20Master%20Key-E11D48?style=for-the-badge&logo=letsencrypt&logoColor=white)
![GDPR](https://img.shields.io/badge/EU%20GDPR-Consent%20Mode%20v2-10B981?style=for-the-badge&logo=shield&logoColor=white)
![Author](https://img.shields.io/badge/K%C3%A9sz%C3%ADt%C5%91-galandras12%2BAI-0F172A?style=for-the-badge)

---

**Egyetlen fájlból telepíthető, Zero-jQuery WordPress bővítmény, amely 11 frontend, teljesítmény-optimalizáló, biztonsági naplózó, botvédelmi (Google reCAPTCHA v3 / Cloudflare Turnstile), többfaktoros hitelesítő (2FA TOTP időszinkronnal, Passkey, E-mail OTP, Offline mentett jelszavak, rang-mátrix, `[wtk_auth_manager]`) és WP Rejtés & Mesterjelszó modult egyesít.**

</div>

---

## ✨ Miért az And ToolKit?

| Jellemző | Hagyományos WordPress Bővítmények (11 külön plugin) | **🔧 `&` And ToolKit (`v0.7.0`)** |
| :--- | :--- | :--- |
| **Függőségek** | jQuery + nehéz külső ikonfontok (`180+ KB`) | **Zero-jQuery · beágyazott Vanilla JS és CSS, külső asset nélkül** |
| **Adminisztráció** | 11 különálló, eltérő stílusú beállítóoldal | **Egy WP beállítóoldal (Settings API) + Studio előnézet** |
| **Hitelesítés (v0.7.0)** | Fizetős 2FA/Passkey bővítmények, frissítéskor elvesző kulcsok | **2FA TOTP + Szerver–Kliens Időszinkron, Passkey, E-mail OTP, Offline Széf, Rang-mátrix, IP Fehérlista, `[wtk_auth_manager]` Shortcode és Frissítés-biztos adattárolás** |
| **WP Rejtés (v0.7.0)** | Sebezhető URL-átírók, forráskódból kiolvasható zárolt tartalom | **WP URL & meta álcázás, egyedi login / `[wtk_custom_login]`, AJAX Buborék belépés, Zero-Source-Leak tagok-mód, szerző/e-mail maszkolás és Titkosított Mesterjelszó (Admin felfedéssel + IP Fehérlistával)** |
| **Kép & Sebesség** | Fizetős külső API kvóták | **WebP/AVIF kimeneti formátum, tömörítési minőség, Lazy Load, opcionális oldal-gyorsítótár** |
| **Biztonsági Napló** | Nehéz biztonsági csomagok | **Adatbázisban tárolt audit napló (`.log`, `.txt`, `.csv` export) + Critical Only e-mail riasztó** |
| **Botvédelem (v0.6.0)** | Külön CAPTCHA bővítmények | **Választható Google reCAPTCHA v3 vagy Cloudflare Turnstile + állítható észlelési küszöbérték (`0.1–0.9`)** |
| **PHP & WP Szabvány** | Vegyes örökölt kód | **`declare(strict_types=1)` · PHP 8.0 `match` · WP 6.3+ script `strategy`** |

---

## 🧩 A 11 Fő Modul Felépítése (`v0.7.0`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🔧 [&] And ToolKit v0.7.0 Mag (PHP 8.0+)                 │
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
├───────────────────────┼──────────────────────────┼───────────────────────────┤
│ 07. Optimalizáló      │ 08. Biztonsági Napló     │ 09. Botvédelem (v0.6.0)   │
│   [wtk_speed_badge]   │   [wtk_security_badge]   │   [wtk_captcha_badge]     │
│ • WebP/AVIF + Resize  │ • 12 eseménykategória DB │ • Google reCAPTCHA v3     │
│ • Upload limit & Cache│ • .LOG / .TXT / .CSV     │ • Cloudflare Turnstile    │
│ • Teljes Lazy Load    │ • Critical Only E-mail   │ • Küszöbérték: 0.1 – 0.9  │
├───────────────────────┴───────────────┬──────────┴───────────────────────────┤
│ 10. Hitelesítés Központ (v0.7.0)      │ 11. WP Rejtés & Mesterjelszó (v0.7.0)│
│        [wtk_auth_manager]             │         [wtk_custom_login]           │
│ • 2FA TOTP + Készülék Időszinkron     │ • WP URL, verzió & szerző álcázás    │
│ • Passkey (WebAuthn) + E-mail OTP     │ • wp-login/wp-admin rejtés + Buborék │
│ • Offline Mentett Jelszavak + Széf    │ • Csak Tagoknak Mód (Zero Source Leak│
│ • Frissítés-biztos + Rang Mátrix + IP │ • Titkosított Mesterjelszó + Admin   │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🚀 Újdonságok a `v0.7.0` Kiadásban

### 🔑 `10.` Hitelesítés Központ (`[wtk_auth_manager]`) — *v0.7.0*
- **2FA Szabvány Hitelesítő (`TOTP RFC 6238`)**: Base32 titkos kulcs és QR-kód generálás, 6 jegyű 30 másodperces időalapú kódokkal (Google Authenticator, Microsoft Authenticator, Authy, 1Password, Bitwarden kompatibilis).
- **Szerver–Kliens Időelcsúszás Korrekció & Készülék Szinkronizálás**: Manuális pontos dátum/idő beállítás és 1-kattintásos készülék-szinkronizálás (`POST /wp-json/and-toolkit/v1/auth-sync-time`), valamint állítható időablak-tolerancia (`±1..4` ablak), hogy eltérő időzóna vagy elcsúszott szerveróra miatt soha ne legyen sikertelen a 2FA kódbeírás.
- **Passkey (`WebAuthn / FIDO2`) Hitelesítő**: Biometrikus (Touch ID, Face ID, Windows Hello) és hardveres biztonsági kulcs (YubiKey) kezelés.
- **E-mail Alapú Hitelesítő (`OTP`)**: Egyszeri 6 jegyű belépési kód küldése a felhasználó e-mail címére állítható lejárati idővel.
- **Offline Mentett Jelszó Kezelő**: Vészhelyzeti offline mentett kódok és alkalmazás-jelszavak (`SHA-256` hash tárolással és `.txt` kódszéf letöltéssel).
- **Frissítés-biztos Hitelesítő Adattárolás (`preserve_auth_credentials_on_update`)**: Garantálja, hogy a bővítmény frissítésekor a beállított 2FA titkos kulcsok, regisztrált Passkey-k és Offline mentett kódok soha nem vesznek el.
- **Rangonkénti (Szerepkör) Szabálymátrix**: *Adminisztrátor*, *Szerkesztő*, *Szerző*, *Közreműködő* és *Feliratkozó* szinten külön-külön beállítható **Kötelező (`required`)**, **Opcionális (`optional`)** vagy **Tiltott (`disabled`)** szabály minden egyes hitelesítő szolgáltatásra.
- **Shortcode Alapú Önkiszolgáló Felület (`[wtk_auth_manager]`)**: Bármely oldalba beilleszthető felület, ahol a felhasználók `wp-admin` belépés nélkül kiválaszthatják és kezelhetik saját hitelesítő szolgáltatásaikat és időszinkronjukat.
- **IP-cím Alapú Fehérlista (`whitelistedIps`)**: Előre definiált IP-címek és CIDR tartományok (`127.0.0.1`, `/24`, `/16`), amelyekről belépve a rendszer nem kéri a hitelesítő használatát.

### 🕵️ `11.` WP Rejtés & Mesterjelszó Védelem (`[wtk_custom_login]`) — *v0.7.0*
- **WordPress URL-ek és Robot-Ujjlenyomatok Elrejtése**: Átírja a `/wp-content`, `/wp-includes` és `/wp-json` útvonalakat egyedi nevekre, eltávolítja a `generator` meta címkét és a `?ver=` paramétereket, valamint blokkolja az `?author=1` szkennelést, így a robotok nem tudják beazonosítani, hogy WordPress oldalról van szó.
- **`wp-login.php` és `wp-admin` Elrejtése**: Saját belépési URL (`customLoginSlug`) beállítása vagy a bejelentkező űrlap beágyazása bármely oldalba a **`[wtk_custom_login]`** shortcode segítségével.
- **AJAX Alapú Lebegő Buborék Bejelentkező Widget**: Az oldal jobb vagy bal alsó sarkában megnyitható buborék alapú AJAX bejelentkező felület (`/wp-json/and-toolkit/v1/bubble-login` és `wp_ajax_nopriv_wtk_bubble_login`).
- **Kizárólag Bejelentkezett Felhasználók Mód (`membersOnlyMode`) + Forráskód-Védelem (`stripHtmlSourceForGuests`)**: Átfedéssel (overlay) kötelezően csak bejelentkezett felhasználók számára enged bármilyen oldalt, bejegyzést vagy médiatartalmat megtekinteni, és szerveroldalon (`template_redirect`) eltávolítja az eredeti HTML törzset, így még a böngésző forráskódjából (`view-source:`) sem olvasható ki a weboldal tartalma.
- **Felhasználónevek és E-mail Címek Elrejtése**: Maszkolja a bejegyzések és hozzászólások szerzőinek felhasználónevét és e-mail címét (`the_author`, `get_comment_author`), hogy a robotok ne tudják kiolvasni a bejelentkezési adatokat.
- **Egységes Mesterjelszó Védelem**: Bekapcsoláskor egy egységes mesterjelszó megadásával engedi csak látni a weboldal bármilyen tartalmát:
  - **Titkosítva tárolva (`masterPasswordCipher` + `masterPasswordHash`)**: Kódból és adatbázisból nyersen nem olvasható ki.
  - **Adminisztrátori megtekintés (`decrypt_master_password_for_admin`)**: A beállított mesterjelszó a felületen gombnyomásra felfedhető és megtekinthető, ha másik jogosult adminisztrátor szeretné megnézni.
  - **Mesterjelszó IP Fehérlista (`masterPasswordWhitelistedIps`)**: A fehérlistás IP-címekről érkező látogatóktól nem kéri a mesterjelszót.

---

## 🔗 Rövidkódok (11 Shortcode) és REST API Végpontok

| Modul | WordPress Rövidkód (Shortcode) | REST API Végpont / Hook |
| :--- | :--- | :--- |
| **01. Esemény Naptár** | `[wtk_calendar style="cards" limit="4"]` | meta mező: `_wtk_event_date` |
| **02. Élő Keresőmotor** | `[wtk_search layout="detailed"]` | `GET /wp-json/and-toolkit/v1/search?q=...&type=...` |
| **03. Közösségi Megosztó** | `[wtk_social style="rounded" cols="2"]` | — |
| **04. Statisztika Számláló** | `[wtk_stats style="grid-cards" format="compact"]` | `POST /track-download`, `POST /track-visit` |
| **05. GDPR Cookie Kezelő** | `[wtk_cookie_consent]` | `POST /cookie-consent` |
| **06. Információs Banner** | `[wtk_info_banner]` | `wp_body_open` + hatókör |
| **07. Optimalizáló & Speed** | `[wtk_speed_badge]` | `POST /optimize` (csak `manage_options`) |
| **08. Biztonsági Audit Napló** | `[wtk_security_badge]` | `GET /audit-export?format=log\|txt\|csv` (csak `manage_options`) |
| **09. Botvédelem (CAPTCHA)** | `[wtk_captcha_badge]` | `authenticate`, `registration_errors`, `lostpassword_post`, `preprocess_comment` |
| **10. Hitelesítés Központ** | `[wtk_auth_manager]` | `POST /auth-sync-time`, `upgrader_process_complete` |
| **11. WP Rejtés & Login** | `[wtk_custom_login]` | `POST /bubble-login`, `template_redirect`, `the_author`, `get_comment_author` |

---

## 📦 Telepítés és Fejlesztői Környezet

### A) Telepítés WordPress 7.1 rendszerbe
1. Töltse le a gyökérkönyvtárban található **`and-toolkit.php`** fájlt (vagy exportálja a Studio **„PHP Plugin Exportálása”** gombjával).
2. Másolja a `/wp-content/plugins/and-toolkit/and-toolkit.php` útvonalra.
3. Aktiválja az **And ToolKit** bővítményt a **Bővítmények** menüpontban.

### B) Interaktív Admin & Widget Studio futtatása helyben
```bash
npm install
npm run dev          # Fejlesztői szerver indítása (http://localhost:3000)
npm test             # Egységtesztek és a 15 pontos PHP-sablon audit
npm run build:plugin # and-toolkit.php újragenerálása a sablonból
```

---

## 📜 Verziótörténet (Changelog)

- **`v0.7.0` (2026-11-03)** — **Hitelesítés Központ (`[wtk_auth_manager]`) & WP Rejtés + Mesterjelszó Modul (`[wtk_custom_login]`)**:
  - **Hitelesítés**: 2FA szabvány hitelesítő (RFC 6238 TOTP), szerver–kliens időeltolódást korrigáló manuális dátum/idő beállítás és készülék-szinkronizálás, Passkey (WebAuthn), E-mail alapú OTP hitelesítő, Offline mentett jelszó kezelő, frissítés-biztos kulcsmegőrzés (`preserve_auth_credentials_on_update`), rangonkénti (`Kötelező / Opcionális / Tiltott`) szabálymátrix, IP fehérlista és `wp-admin` mentes `[wtk_auth_manager]` önkiszolgáló shortcode.
  - **WP Rejtés**: WordPress URL-ek (`/wp-content`, `/wp-includes`, `/wp-json`) és verzió metaadatok elrejtése robotok elől, `wp-login.php` és `wp-admin` elrejtése egyedi URL-lel vagy `[wtk_custom_login]` shortcode-dal, lebegő AJAX buborék bejelentkező widget, kizárólag bejelentkezett felhasználók számára hozzáférési mód teljes forráskód-védelemmel (`stripHtmlSourceForGuests`), felhasználónevek és e-mail címek maszkolása posztokon és kommentekben, valamint titkosítva tárolt, adminisztrátorok által megtekinthető egységes Mesterjelszó IP-fehérlistával.
- **`v0.6.0` (2026-11-03)** — **Botvédelem: Google reCAPTCHA v3 & Cloudflare Turnstile Modul (`[wtk_captcha_badge]`)**.
- **`v0.5.2` (2026-11-03)** — **Biztonsági és működési javítócsomag (audit alapján)**.
- **`v0.5.1` (2026-11-03)** — **Critical Only (Csak Kritikus) E-mail Szűrő (`criticalOnlyEmails`)**.
- **`v0.5.0` (2026-11-03)** — **Biztonsági Audit Naplózás & E-mail Értesítés Modul (`[wtk_security_badge]`)**.
- **`v0.4.0` (2026-11-02)** — **Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló (`[wtk_speed_badge]`)**.
- **`v0.3.0` (2026-11-02)** — **Állandó Főoldali / Globális Információs Banner (`[wtk_info_banner]`)**.
- **`v0.2.0` (2026-11-02)** — **EU GDPR Kötelező Süti (Cookie) és Adatvédelmi Hozzájárulás Kezelő (`[wtk_cookie_consent]`)**.
- **`v0.1.0` (2026-11-02)** — Első kiadás: Esemény Naptár, Élő AJAX Keresőmotor, Közösségi Megosztás, Látogatói/Letöltési Statisztika.

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

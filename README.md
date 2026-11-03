<div align="center">

# 🔧 `&` And ToolKit — WordPress 7.1 Admin & Widget Studio

### Moduláris Oldalsáv Widgetek · Élő AJAX Kereső · Közösségi Megosztó · Analitika · EU GDPR Cookie · Állandó Információs Banner · Kép/Upload/Lazy-Load Optimalizáló · Biztonsági Audit Napló & E-mail · Botvédelem (reCAPTCHA v3 & Turnstile) · Hitelesítés (2FA TOTP + visszaállító kódok) · WP Rejtés & Mesterjelszó

![Version](https://img.shields.io/badge/Verzi%C3%B3-0.7.1-2563EB?style=for-the-badge&logo=semanticrelease&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-7.1%20Ready-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B%20Strict-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Auth](https://img.shields.io/badge/Hiteles%C3%ADt%C3%A9s-2FA%20TOTP%20%7C%20Recovery-4F46E5?style=for-the-badge&logo=webauthn&logoColor=white)
![WPHide](https://img.shields.io/badge/WP%20Rejt%C3%A9s-Hardening%20%26%20Master%20Gate-E11D48?style=for-the-badge&logo=letsencrypt&logoColor=white)
![GDPR](https://img.shields.io/badge/EU%20GDPR-Consent%20Mode%20v2-10B981?style=for-the-badge&logo=shield&logoColor=white)
![Author](https://img.shields.io/badge/K%C3%A9sz%C3%ADt%C5%91-galandras12%2BAI-0F172A?style=for-the-badge)

---

**Egyetlen fájlból telepíthető, Zero-jQuery WordPress bővítmény, amely 11 frontend, teljesítmény-optimalizáló, biztonsági naplózó, botvédelmi (Google reCAPTCHA v3 / Cloudflare Turnstile), többfaktoros hitelesítő (2FA TOTP időszinkronnal, Passkey, E-mail OTP, Offline mentett jelszavak, rang-mátrix, `[wtk_auth_manager]`) és WP Rejtés & Mesterjelszó modult egyesít.**

</div>

---

## ✨ Miért az And ToolKit?

| Jellemző | Hagyományos WordPress Bővítmények (11 külön plugin) | **🔧 `&` And ToolKit (`v0.7.1`)** |
| :--- | :--- | :--- |
| **Függőségek** | jQuery + nehéz külső ikonfontok (`180+ KB`) | **Zero-jQuery · beágyazott Vanilla JS és CSS, külső asset nélkül** |
| **Adminisztráció** | 11 különálló, eltérő stílusú beállítóoldal | **Egy WP beállítóoldal (Settings API) + Studio előnézet** |
| **Hitelesítés** | Fizetős 2FA bővítmények | **Valódi 2FA (TOTP, RFC 6238) titkosított, felhasználónkénti kulccsal + visszaállító kódok, szerepkör-szabályok, CIDR IP-mentesség, `[wtk_auth_manager]`** |
| **WP Rejtés** | Sebezhető URL-átírók | **Verzió-rejtés, felderítés-tiltás, szerző-maszkolás, csak tagoknak mód (REST is zárolt), hash-elt mesterjelszó kapu, `[wtk_custom_login]`, AJAX belépő buborék** |
| **Kép & Sebesség** | Fizetős külső API kvóták | **WebP/AVIF kimeneti formátum, tömörítési minőség, Lazy Load, opcionális oldal-gyorsítótár** |
| **Biztonsági Napló** | Nehéz biztonsági csomagok | **Adatbázisban tárolt audit napló (`.log`, `.txt`, `.csv` export) + Critical Only e-mail riasztó** |
| **Botvédelem (v0.6.0)** | Külön CAPTCHA bővítmények | **Választható Google reCAPTCHA v3 vagy Cloudflare Turnstile + állítható észlelési küszöbérték (`0.1–0.9`)** |
| **PHP & WP Szabvány** | Vegyes örökölt kód | **`declare(strict_types=1)` · PHP 8.0 `match` · WP 6.3+ script `strategy`** |

---

## 🧩 A 11 Fő Modul Felépítése (`v0.7.1`)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🔧 [&] And ToolKit v0.7.1 Mag (PHP 8.0+)                 │
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
│ 10. Hitelesítés Központ (v0.7.1)      │ 11. WP Rejtés & Mesterjelszó (v0.7.1)│
│        [wtk_auth_manager]             │         [wtk_custom_login]           │
│ • 2FA TOTP (RFC 6238, titkosítva)     │ • Verzió-rejtés, felderítés-tiltás   │
│ • Egyszer használatos visszaállító kód│ • Szerző-maszkolás + AJAX Buborék    │
│ • Belépéskor kikényszerítve + zár     │ • Csak Tagoknak Mód (REST is zárolt) │
│ • Rang Mátrix + CIDR IP-mentesség     │ • Hash-elt Mesterjelszó kapu         │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🚀 Hitelesítés és WP Rejtés (`v0.7.0` bevezette, `v0.7.1` javította)

> **Mi működik a letöltött PHP bővítményben, és mi csak a Studio előnézetében?** A `v0.7.0` több funkciót hirdetett, mint amennyi a PHP kódban megvolt (a 2FA nem lett kikényszerítve, a mesterjelszó-kapunak nem volt jelszóűrlapja, a beállítások kulcsnevei elcsúsztak, így nem mentődtek). A `v0.7.1` ezt javítja; az alábbi lista a tényleges állapotot adja.

### 🔑 `10.` Hitelesítés (`[wtk_auth_manager]`)
| Funkció | PHP bővítmény | Megjegyzés |
| :--- | :---: | :--- |
| **2FA TOTP (RFC 6238)** | ✅ működik | Base32 titkos kulcs, ±tűrés ablak, újrajátszás elleni számláló; hivatalos RFC-tesztvektorokkal ellenőrizve. A kulcs felhasználónként, libsodium-mal titkosítva a user meta-ban él, soha nem a konfigban. |
| **Visszaállító kódok** | ✅ működik | 10 db egyszer használatos kód, csak HMAC-hash tárolva, a profilon egyszer jelenik meg. |
| **Belépéskor kikényszerítve** | ✅ működik | A jelszó ellenőrzése után kér kódot; 5 hibás próba után 10 percre zár; beállítatlan fióknál nem zár ki (a kötelező szerepkörnek figyelmeztetés jelenik meg). |
| **Szerepkör-szabályok** | ✅ működik | `required` / `optional` / `disabled` a TOTP-re szerepkörönként. |
| **IP-mentesség** | ✅ működik | Egyedi cím és CIDR, IPv4 és IPv6; alapból üres lista. Fordított proxy mögött az `and_toolkit_client_ip` szűrővel kell a valódi IP-t megadni. |
| **`[wtk_auth_manager]`** | ✅ működik | Állapot és link a profil 2FA-beállításához. |
| Passkey (WebAuthn), e-mail OTP, offline jelszó-széf, időszinkron | ❌ csak Studio-előnézet | A PHP kód nem tartalmazza. Az időszinkron végpontot a `v0.7.1` eltávolította: bármely bejelentkezett felhasználó módosíthatta a globális TOTP-eltolást. |

A 2FA-val védett fiók az **XML-RPC és REST API felé az igazi jelszavával nem léphet be** (ez megkerülné a 2FA-t), csak WordPress **alkalmazásjelszóval**. A 2FA nélküli fiókokat az API-belépés nem érinti.

**Vészkapcsoló:** ha a WordPress-sókat (`AUTH_SALT` stb.) lecserélik, a titkosított 2FA-kulcsok és a visszaállító kódok érvénytelenné válnak. Ilyenkor a `wp-config.php`-ba írt `define( 'AND_TOOLKIT_DISABLE_2FA', true );` sor kikapcsolja a 2FA-kikényszerítést, így újra be lehet lépni és újra beállítani.

### 🕵️ `11.` WP Rejtés & Mesterjelszó (`[wtk_custom_login]`)
| Funkció | PHP bővítmény | Megjegyzés |
| :--- | :---: | :--- |
| Verzió- és generator-elrejtés | ✅ működik | `wp_generator`, `the_generator`, `?ver=` a WP verziószámára. A `readme.html` fájlt a bővítmény nem törli. |
| Felhasználó-felderítés tiltása | ✅ működik | `?author=N`, szerzői archívum és `/wp/v2/users` vendégeknek. |
| Szerző- és kommentnév-maszkolás | ✅ működik | Csak a szerzők és regisztrált kommentelők nevét maszkolja; a névtelen látogatók megadott neve érintetlen. |
| Csak tagoknak mód | ✅ működik | Zárolt oldal belépési linkkel; a REST API is zárolt vendégeknek. |
| Mesterjelszó kapu | ✅ működik | Jelszóűrlap; a jelszó csak sózott hash (`wp_hash_password`), a kapu aláírt HttpOnly sütit ad, sebességkorlátos, az adminisztrátor és a mentesített IP-k kivételek. Jelszó nélkül nem kapcsolható be. **Az admin sem tekintheti meg a jelszót** (a `v0.7.0` visszafejthető, forráskódba égetett kulcsú tárolását eltávolítottuk). |
| `[wtk_custom_login]` és AJAX belépő buborék | ✅ működik | Valódi `wp_login_form`; a CAPTCHA és a 2FA mező is megjelenik; a buborék `wp_signon`-t hív sebességkorláttal. |
| URL-átírás (`wp-content`, `wp-includes`, `wp-json`), `wp-login.php` áthelyezése | ❌ csak Studio-előnézet | A PHP kód nem tartalmazza (a nem tesztelt átírás kizárhatná az adminokat). |

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
npm test             # Egységtesztek és a 16 pontos PHP-sablon audit
npm run build:plugin # and-toolkit.php újragenerálása a sablonból
```

---

## 📜 Verziótörténet (Changelog)

- **`v0.7.1` (2026-11-03)** — **Biztonsági és működési javítócsomag a `v0.7.0` auditja alapján**:
  - **Súlyos hibák**: a 2FA nem volt kikényszerítve, és a TOTP a nyers szöveget használta kulcsnak (egyetlen hitelesítő alkalmazással sem működött) → valódi, RFC-vektorokkal ellenőrzött TOTP + visszaállító kódok, belépéskor kikényszerítve; a beállítások kulcsnevei elcsúsztak (16 séma-kulcs nem mentődött) → egységesítve, és statikus teszt védi; a mesterjelszó-kapunak nem volt jelszóűrlapja, a süti értéke maga a hash volt, a kapu az adminokat is kizárta → hash-elt jelszó, aláírt süti, jelszóűrlap, az admin sosem zárható ki.
  - **Beégetett adatok eltávolítva** a kiadott fájlból: TOTP titok, mesterjelszó (és a hozzá tartozó XOR-os "titkosítás" kulccsal), IP-fehérlista (`84.2.44.19`, `192.168.1.0/24`), demó CAPTCHA kulcsok, promóciós banner. Az összes új funkció telepítéskor kikapcsolt vagy inert.
  - **Biztonság**: az időszinkron REST végpontot bármely bejelentkezett felhasználó hívhatta (globális TOTP-eltolás) → eltávolítva; a "frissítés-védelem" plaintext másolatot készített a titkokról → eltávolítva; az IP-fehérlista csak `/24` sztring-előtagot ismert → teljes CIDR (IPv4 + IPv6); a `/auth-sync-time` és `/bubble-login` REST útvonalak megszűntek.
  - **CAPTCHA**: reCAPTCHA `action` és hostname ellenőrzés; token-frissítés beküldéskor (a token ~2 percig érvényes); nem blokkolja az XML-RPC / REST / alkalmazásjelszavas belépést és a bejelentkezett kommentelőket; a szolgáltatói hálózati hiba nem zárja ki a látogatókat (szűrhető); a mezők nem jelennek meg kulcsok nélkül.
  - **GDPR**: a süti-felület már nem pre-ticked (a "Funkcionális" be volt jelölve), az elutasítás ugyanolyan hangsúlyú, mint az elfogadás; oldalsáv módban is megkérdezi a látogatót (tartalék lebegő kártya), és a hozzájárulás bármikor visszavonható; a szkriptek aktiválása megőrzi a sorrendet.
  - **Egyéb**: a rate limit kulcsa IP + böngésző (proxy mögött nem esik szét); minden megtekinthető tartalomtípus érvényteleníti a gyorsítótárat; a Gutenberg dupla mentése nem naplózódik kétszer; PHP 8.4-kompatibilis CSV export; admin figyelmeztetés privát IP-t látó (proxy mögötti) szerverre; a Studio panelei jelzik, mi működik a PHP-ban és mi csak előnézet.
  - **Tesztek**: 21 egységteszt, 16 pontos statikus audit (az audit a 0.7.0-ás hibás kódon is átment, ezért a hibaosztályokra célzott ellenőrzések kerültek bele), 81 WP-stubos PHP viselkedési teszt (TOTP RFC 6238 vektorok, újrajátszás, zárolás, kapu, REST-zár, CIDR, captcha) és böngészős (Chromium) JS-teszt a keresőre, GDPR-sávra, megosztóra és belépő buborékra.
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

A **Claude Code**-ban a **Sonnet 5.5** modellje auditálta a **0.7.1** verziót is, **2026. 11. 03.** dátummal.

# And ToolKit — WordPress 7.1 & PHP 8.0+ Plugin & Widget Studio

- **Verzió:** `0.1.0`
- **Készítő:** `galandras12+AI`
- **Kompatibilitás:** WordPress `6.2 – 7.1+` · PHP `8.0+` (`declare(strict_types=1);`)
- **Licenc:** GPL v2 or later

Az **And ToolKit** egy modern, sötét és világos módot is támogató WordPress adminisztrációs eszköztár és reszponzív oldalsáv widget-gyűjtemény, egyedi **villáskulcsba foglalt `&` (and jel)** logóval.

---

## Főbb Modulok és Rövidkódok (Shortcodes)

1. **Esemény Naptár Widget (`[wtk_calendar]`)**
   - Közelgő bejegyzések és események megjelenítése az oldalsávban 4 választható stílussal (`cards`, `compact`, `grid`, `timeline`), kategória szűréssel és hátralévő napok számlálójával.
2. **Fejlett Keresőmotor Widget (`[wtk_search]`)**
   - Testreszabható élő AJAX találati lista (`detailed`, `compact-cards`, `minimal`), kulcsszó-kiemeléssel, tartalomtípus szűréssel és gyorskereső címkékkel.
3. **Platformfüggetlen Közösségi Megosztás Widget (`[wtk_social]`)**
   - Külső követőkódoktól mentes, gyors SVG megosztó gombok (Facebook, X, LinkedIn, WhatsApp, Telegram, Reddit, Pinterest, E-mail + Link másolása) 5 gombstílussal és UTM paraméterezéssel.
4. **Hatékonyságmérő Statisztika Modul (`[wtk_stats]`)**
   - Egyedi látogatók, letöltések, aktív olvasók és megosztások mérése és testreszabott oldalsávos megjelenítése (`compact`, `exact`, `comma` számformázással és heti mini grafikonnal).

---

## Telepítés WordPress 7.1 alatt

1. Töltse le vagy másolja az `and-toolkit.php` fájlt a WordPress telepítés `/wp-content/plugins/and-toolkit/` mappájába.
2. Aktiválja az **And ToolKit (v0.1.0)** bővítményt a **WordPress Admin → Bővítmények** menüpontban.
3. Használja a `[wtk_calendar]`, `[wtk_search]`, `[wtk_social]` és `[wtk_stats]` rövidkódokat vagy a Gutenberg blokkokat az oldalsávban.

## Fejlesztői Admin Stúdió Indítása (React + Vite)

```bash
npm install
npm run dev
```

Egységtesztek és WordPress 7.1 + PHP 8.0 kompatibilitási audit futtatása:

```bash
npx --yes tsx --test src/utils/toolkitLogic.test.ts
```

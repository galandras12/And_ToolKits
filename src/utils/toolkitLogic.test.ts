import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_AUDIT_ENTRIES,
  INITIAL_POSTS,
  INITIAL_STATE,
  auditWordPressPhpCompatibility,
  buildUpdateNotificationEmailPreview,
  calculateMediaQueueSummary,
  calculatePerformanceMetrics,
  computeAdjustedTimestamp,
  decryptMasterPasswordForAdmin,
  encryptMasterPassword,
  evaluateCaptchaVerification,
  evaluateRoleAuthRequirement,
  filterAuditLogEntries,
  formatAuditLogsForExport,
  formatMetricValue,
  generateTotpCode,
  generateWordPressPluginPhp,
  getCaptchaSensitivityLabel,
  getDaysUntilEvent,
  getFilteredCalendarPosts,
  isHighImpactCriticalEvent,
  isIpWhitelisted,
  maskUserIdentityForPublic,
  preserveAuthDataAcrossPluginUpdate,
  sanitizeAndMaskWpOutput,
  searchPosts,
  shouldSendAuditEventEmail,
  shouldSendLoginEmailAlert,
  validateCaptchaKeys,
  validateNewPostInput,
  verifyMasterPasswordAccess,
  verifyTotpCodeWithDrift,
} from './toolkitLogic';

test('getFilteredCalendarPosts sorts chronologically and respects maxItems and categoryFilter', () => {
  const allConfig = { ...INITIAL_STATE.calendar, maxItems: 3, categoryFilter: 'all' };
  const result = getFilteredCalendarPosts(INITIAL_POSTS, allConfig);
  assert.equal(result.length, 3);
  assert.equal(result[0].date <= result[1].date, true);

  const workshopConfig = { ...INITIAL_STATE.calendar, maxItems: 5, categoryFilter: 'Workshop' };
  const workshops = getFilteredCalendarPosts(INITIAL_POSTS, workshopConfig);
  assert.equal(workshops.every((p) => p.category === 'Workshop'), true);
});

test('getDaysUntilEvent calculates accurate day delta', () => {
  assert.equal(getDaysUntilEvent('2026-11-05', '2026-11-02'), 3);
  assert.equal(getDaysUntilEvent('2026-11-02', '2026-11-02'), 0);
});

test('searchPosts filters by query and included post types', () => {
  const results = searchPosts(INITIAL_POSTS, 'Konferencia', INITIAL_STATE.search);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'post-103');

  const downloadOnlyConfig = {
    ...INITIAL_STATE.search,
    includedTypes: ['download' as const],
  };
  const downloadResults = searchPosts(INITIAL_POSTS, '', downloadOnlyConfig);
  assert.equal(downloadResults.every((p) => p.postType === 'download'), true);
});

test('formatMetricValue formats compact, comma, and exact space-separated numbers', () => {
  assert.equal(formatMetricValue(48920, 'compact'), '48.9K');
  assert.equal(formatMetricValue(48920, 'comma'), '48,920');
  assert.equal(formatMetricValue(48920, 'exact'), '48 920');
});

test('calculatePerformanceMetrics rewards zero-jQuery and minification', () => {
  const fast = calculatePerformanceMetrics(INITIAL_STATE.performance, 8);
  const slow = calculatePerformanceMetrics(
    {
      minifyAssets: false,
      deferScripts: false,
      svgSpritesOnly: false,
      objectCacheTtlMinutes: 0,
      zeroJqueryDependency: false,
    },
    8
  );
  assert.equal(fast.bundleSizeKb < slow.bundleSizeKb, true);
  assert.equal(fast.lighthouseScore > slow.lighthouseScore, true);
});

test('calculateMediaQueueSummary computes image compression savings accurately', () => {
  const summary = calculateMediaQueueSummary(INITIAL_STATE.optimizer.mediaQueue);
  assert.equal(summary.totalOriginalKb > summary.totalOptimizedKb, true);
  assert.equal(summary.savingsPercent > 75, true);
  assert.equal(summary.pendingCount, 2);
});

test('filterAuditLogEntries and formatAuditLogsForExport support .log, .txt, and .csv formats', () => {
  const loginOnly = filterAuditLogEntries(INITIAL_AUDIT_ENTRIES, 'user_login', '');
  assert.equal(loginOnly.length, 1);
  assert.equal(loginOnly[0].actorUser, 'galandras12');

  const logOut = formatAuditLogsForExport(INITIAL_AUDIT_ENTRIES, 'log');
  const txtOut = formatAuditLogsForExport(INITIAL_AUDIT_ENTRIES, 'txt');
  const csvOut = formatAuditLogsForExport(INITIAL_AUDIT_ENTRIES, 'csv');

  assert.equal(logOut.includes('actor="galandras12"'), true);
  assert.equal(txtOut.includes('AND TOOLKIT v0.7.0'), true);
  assert.equal(csvOut.startsWith('ID,Idopont,Kategoria'), true);
});

test('shouldSendLoginEmailAlert and buildUpdateNotificationEmailPreview evaluate v0.5.1 email rules accurately', () => {
  const adminCheck = shouldSendLoginEmailAlert(
    {
      loginEmailEnabled: true,
      loginEmailScope: 'admins-only',
      newDeviceLocationEmailEnabled: false,
      newDeviceTargetRoles: [],
    },
    'administrator',
    false
  );
  assert.equal(adminCheck.send, true);

  const subscriberNewDevice = shouldSendLoginEmailAlert(
    {
      loginEmailEnabled: true,
      loginEmailScope: 'admins-only',
      newDeviceLocationEmailEnabled: true,
      newDeviceTargetRoles: ['editor', 'author'],
    },
    'author',
    true
  );
  assert.equal(subscriberNewDevice.send, true);

  const emailPreview = buildUpdateNotificationEmailPreview(INITIAL_STATE.auditLog);
  assert.equal(emailPreview.includedCount, 4);
  assert.equal(emailPreview.body.includes('v7.1.0  --->  Új verzió: v7.1.1-security'), true);
});

test('v0.5.1 Critical Only toggle filters email notifications to only send alerts for high-impact events (core WP updates or file system changes)', () => {
  const criticalConfig = {
    ...INITIAL_STATE.auditLog,
    criticalOnlyEmails: true,
  };

  const loginDecision = shouldSendAuditEventEmail(criticalConfig, {
    category: 'user_login',
    severity: 'warning',
    actorRole: 'administrator',
    isNewDeviceOrLocation: true,
  });
  assert.equal(loginDecision.send, false);

  const pluginDecision = shouldSendAuditEventEmail(criticalConfig, {
    category: 'plugin_lifecycle',
    severity: 'info',
    actorRole: 'administrator',
  });
  assert.equal(pluginDecision.send, false);

  const coreDecision = shouldSendAuditEventEmail(criticalConfig, {
    category: 'core_manual_update',
    severity: 'critical',
    actorRole: 'administrator',
  });
  assert.equal(coreDecision.send, true);
  assert.equal(isHighImpactCriticalEvent({ category: 'core_manual_update', severity: 'critical' }), true);

  const fsDecision = shouldSendAuditEventEmail(criticalConfig, {
    category: 'filesystem_change',
    severity: 'critical',
    actorRole: 'administrator',
  });
  assert.equal(fsDecision.send, true);
  assert.equal(isHighImpactCriticalEvent({ category: 'filesystem_change', severity: 'critical' }), true);

  const criticalPreview = buildUpdateNotificationEmailPreview(criticalConfig);
  assert.equal(criticalPreview.includedCount, 1);
  assert.equal(criticalPreview.subject.includes('CRITICAL ONLY'), true);
  assert.equal(criticalPreview.body.includes('wp-config.php'), true);
});

test('validateNewPostInput enforces required fields', () => {
  assert.equal(
    validateNewPostInput({ title: 'Rövid', date: '2026-11-10', time: '12:00', excerpt: 'Érvényes kivonat szöveg' }).valid,
    true
  );
  assert.equal(
    validateNewPostInput({ title: 'Ab', date: '2026-11-10', time: '12:00', excerpt: 'Érvényes kivonat szöveg' }).valid,
    false
  );
});

test('v0.6.0 Botvédelem (Google reCAPTCHA v3 & Cloudflare Turnstile): kulcsvalidáció, küszöbérték és szimuláció', () => {
  assert.equal(getCaptchaSensitivityLabel(0.3).badgeTone, 'emerald');
  assert.equal(getCaptchaSensitivityLabel(0.5).badgeTone, 'blue');
  assert.equal(getCaptchaSensitivityLabel(0.7).badgeTone, 'amber');
  assert.equal(getCaptchaSensitivityLabel(0.9).badgeTone, 'rose');

  const keyStatus = validateCaptchaKeys({
    provider: 'turnstile',
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    turnstileSiteKey: '0x4AAAAAAADnPIDROrmt1Wwj',
    turnstileSecretKey: '0x4AAAAAAADnPIDROrmt1Wwj_secret_demo_key',
  });
  assert.equal(keyStatus.readyForProduction, true);
  assert.equal(keyStatus.statusLabel.includes('Cloudflare Turnstile'), true);

  const strictConfig = {
    ...INITIAL_STATE.captcha,
    provider: 'recaptcha-v3' as const,
    scoreThreshold: 0.7,
    bypassLoggedInAdmins: true,
  };

  const botAttempt = evaluateCaptchaVerification(strictConfig, {
    score: 0.42,
    tokenProvided: true,
    isLoggedAdmin: false,
  });
  assert.equal(botAttempt.allowed, false);

  const humanAttempt = evaluateCaptchaVerification(strictConfig, {
    score: 0.85,
    tokenProvided: true,
    isLoggedAdmin: false,
  });
  assert.equal(humanAttempt.allowed, true);

  const adminBypass = evaluateCaptchaVerification(strictConfig, {
    score: 0.15,
    tokenProvided: false,
    isLoggedAdmin: true,
  });
  assert.equal(adminBypass.allowed, true);
});

test('v0.7.0 Hitelesítés: 2FA TOTP, időeltolódás-korrekció, frissítés-biztos adattárolás, rang-mátrix és IP fehérlista', () => {
  const baseTs = 1762158000;
  const adjusted = computeAdjustedTimestamp(baseTs, {
    timeDriftCorrectionEnabled: true,
    timeOffsetSeconds: 90,
  });
  assert.equal(adjusted, baseTs + 90);

  const codeCurrent = generateTotpCode('JBSWY3DPEHPK3PXPANDTK070', adjusted, 30);
  assert.equal(/^\d{6}$/.test(codeCurrent), true);

  // Verify with drift (+1 window = +30s) succeeds within toleranceWindows = 2
  const nextWindowCode = generateTotpCode('JBSWY3DPEHPK3PXPANDTK070', adjusted + 30, 30);
  const driftRes = verifyTotpCodeWithDrift(
    'JBSWY3DPEHPK3PXPANDTK070',
    nextWindowCode,
    baseTs,
    {
      timeDriftCorrectionEnabled: true,
      timeOffsetSeconds: 90,
      toleranceWindows: 2,
      totpPeriodSeconds: 30,
    }
  );
  assert.equal(driftRes.valid, true);
  assert.equal(driftRes.matchedWindowOffset, 1);

  // IP whitelist supports exact IP and /24 CIDR
  assert.equal(isIpWhitelisted('192.168.1.99', ['127.0.0.1', '192.168.1.0/24']), true);
  assert.equal(isIpWhitelisted('10.10.10.5', ['127.0.0.1', '192.168.1.0/24']), false);

  // Role matrix evaluation
  const adminEval = evaluateRoleAuthRequirement('administrator', INITIAL_STATE.auth, '203.0.113.5');
  assert.equal(adminEval.enforced, true);
  assert.equal(adminEval.requiredMethods.includes('totp'), true);

  const whitelistedEval = evaluateRoleAuthRequirement('administrator', INITIAL_STATE.auth, '127.0.0.1');
  assert.equal(whitelistedEval.bypassedByIpWhitelist, true);
  assert.equal(whitelistedEval.enforced, false);

  // Update-safe persistence preserves 2FA secret, Passkeys, and Offline codes across plugin updates
  const blankIncoming = {
    ...INITIAL_STATE.auth,
    totpSecretKey: '',
    passkeyCredentials: [],
    offlineSavedItems: [],
    whitelistedIps: [],
  };
  const preserved = preserveAuthDataAcrossPluginUpdate(INITIAL_STATE.auth, blankIncoming);
  assert.equal(preserved.totpSecretKey, INITIAL_STATE.auth.totpSecretKey);
  assert.equal(preserved.passkeyCredentials.length, 2);
  assert.equal(preserved.offlineSavedItems.length, 4);
});

test('v0.7.0 WP Rejtés & Mesterjelszó: titkosítás, admin felfedés, IP fehérlista, szerző maszkolás és forráskód-védelem', () => {
  const enc = encryptMasterPassword('SzuperTitkosMester#2026');
  assert.equal(enc.cipher.startsWith('atk_enc_v1:'), true);
  assert.equal(enc.cipher.includes('SzuperTitkosMester'), false);

  // Unauthorized user cannot decrypt, authorized admin can reveal
  assert.equal(decryptMasterPasswordForAdmin(enc.cipher, false), null);
  assert.equal(decryptMasterPasswordForAdmin(enc.cipher, true), 'SzuperTitkosMester#2026');

  const hideCfg = {
    ...INITIAL_STATE.wpHide,
    masterPasswordEnabled: true,
    masterPasswordCipher: enc.cipher,
    masterPasswordHash: enc.hash,
  };

  assert.equal(verifyMasterPasswordAccess('HibasJelszo', hideCfg, '203.0.113.99').granted, false);
  assert.equal(verifyMasterPasswordAccess('SzuperTitkosMester#2026', hideCfg, '203.0.113.99').granted, true);
  assert.equal(verifyMasterPasswordAccess('', hideCfg, '127.0.0.1').bypassedByIp, true);

  // Username & email masking
  const masked = maskUserIdentityForPublic(
    { userLogin: 'admin_login', email: 'admin@secret.hu', userId: 7 },
    INITIAL_STATE.wpHide
  );
  assert.equal(masked.loginExposed, false);
  assert.equal(masked.publicAuthorName.includes('admin_login'), false);
  assert.equal(masked.publicEmailDisplay.includes('admin@secret.hu'), false);

  // Zero-source-leak HTML protection when membersOnlyMode is active for guests
  const lockedCfg = {
    ...INITIAL_STATE.wpHide,
    membersOnlyMode: true,
    stripHtmlSourceForGuests: true,
  };
  const rawHtml = '<html><head><meta name="generator" content="WordPress 7.1"></head><body><article>Titkos Uzleti Tartalom</article><script src="/wp-content/themes/a/app.js"></script></body></html>';
  const guestResult = sanitizeAndMaskWpOutput(rawHtml, lockedCfg, {
    isUserLoggedIn: false,
    hasValidMasterPassword: true,
  });
  assert.equal(guestResult.blockedByGate, true);
  assert.equal(guestResult.sourceCodeProtected, true);
  assert.equal(guestResult.outputHtml.includes('Titkos Uzleti Tartalom'), false);

  // Logged-in member gets content with /wp-content/ rewritten to custom slug
  const memberResult = sanitizeAndMaskWpOutput(rawHtml, lockedCfg, {
    isUserLoggedIn: true,
    hasValidMasterPassword: true,
  });
  assert.equal(memberResult.blockedByGate, false);
  assert.equal(memberResult.outputHtml.includes('/assets-media/themes/a/app.js'), true);
  assert.equal(memberResult.outputHtml.includes('WordPress 7.1'), false);
});

test('generateWordPressPluginPhp és auditWordPressPhpCompatibility: v0.7.0 teljes körű ellenőrzés', () => {
  const php = generateWordPressPluginPhp(INITIAL_STATE);
  assert.equal(php.includes('Plugin Name:       And ToolKit'), true);
  assert.equal(php.includes('Version:           0.7.0'), true);
  assert.equal(php.includes('Requires at least: 6.3'), true);
  assert.equal(php.includes('Requires PHP:      8.0'), true);
  assert.equal(php.includes('declare(strict_types=1);'), true);
  assert.equal(php.includes("add_action( 'wp_login'"), true);
  assert.equal(php.includes("add_action( '_core_updated_successfully'"), true);
  assert.equal(php.includes('https://www.google.com/recaptcha/api/siteverify'), true);
  assert.equal(php.includes('https://challenges.cloudflare.com/turnstile/v0/siteverify'), true);
  assert.equal(php.includes("add_shortcode( 'wtk_auth_manager'"), true);
  assert.equal(php.includes("add_shortcode( 'wtk_custom_login'"), true);
  assert.equal(php.includes('/*{{DEFAULTS}}*/'), false);
  assert.equal(php.includes('@gmail.com'), false);

  const audit = auditWordPressPhpCompatibility(php, INITIAL_STATE);
  assert.deepEqual(
    audit.checks.filter((c) => !c.passed).map((c) => c.id),
    []
  );
  assert.equal(audit.allPassed, true);
  assert.equal(audit.passedCount, audit.totalCount);
  assert.equal(audit.totalCount, 15);
});

test('az audit nem engedi át a régi, üres vázat (regressziós védelem)', () => {
  const stub = "<?php declare(strict_types=1); if ( ! defined( 'ABSPATH' ) ) { exit; } final class And_ToolKit_Plugin { public const VERSION = '0.7.0'; }";
  const audit = auditWordPressPhpCompatibility(stub, INITIAL_STATE);
  assert.equal(audit.allPassed, false);
  assert.equal(audit.passedCount < 3, true);
});

test('a generátor PHP-escape-eli a szövegeket (aposztróf és visszaper nem törheti el a kódot)', () => {
  const state = structuredClone(INITIAL_STATE);
  state.banner.headline = "Ez egy 'idézőjeles' cím \\";
  state.auditLog.recipientEmail = "x'; system('id'); //@example.com";
  const php = generateWordPressPluginPhp(state);
  assert.equal(php.includes("=> 'Ez egy \\'idézőjeles\\' cím \\\\',"), true);
  assert.equal(php.includes("system('id')"), false);
});

test('a gyökér and-toolkit.php megegyezik a generátor kimenetével (nincs elcsúszás)', () => {
  const onDisk = readFileSync(new URL('../../and-toolkit.php', import.meta.url), 'utf8');
  assert.equal(onDisk, generateWordPressPluginPhp(INITIAL_STATE));
});

test('a Studio CSV exportja védett a képlet-injekció ellen', () => {
  const entries = [{ ...INITIAL_AUDIT_ENTRIES[0], details: '=HYPERLINK("http://evil")' }];
  const csv = formatAuditLogsForExport(entries, 'csv');
  assert.equal(csv.includes('"\'=HYPERLINK'), true);
});

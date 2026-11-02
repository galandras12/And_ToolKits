import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_POSTS,
  INITIAL_STATE,
  auditWordPressPhpCompatibility,
  calculatePerformanceMetrics,
  formatMetricValue,
  generateWordPressPluginPhp,
  getDaysUntilEvent,
  getFilteredCalendarPosts,
  searchPosts,
  validateNewPostInput,
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
  const fast = calculatePerformanceMetrics(INITIAL_STATE.performance, 5);
  const slow = calculatePerformanceMetrics(
    {
      minifyAssets: false,
      deferScripts: false,
      svgSpritesOnly: false,
      objectCacheTtlMinutes: 0,
      zeroJqueryDependency: false,
    },
    5
  );
  assert.equal(fast.bundleSizeKb < slow.bundleSizeKb, true);
  assert.equal(fast.lighthouseScore > slow.lighthouseScore, true);
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

test('generateWordPressPluginPhp and auditWordPressPhpCompatibility pass all v0.3.0 WordPress 7.1, PHP 8.0, GDPR & Info Banner checks', () => {
  const php = generateWordPressPluginPhp(INITIAL_STATE);
  assert.equal(php.includes('Plugin Name:       And ToolKit'), true);
  assert.equal(php.includes('Version:           0.3.0'), true);
  assert.equal(php.includes('Tested up to:      7.1'), true);
  assert.equal(php.includes('Requires PHP:      8.0'), true);
  assert.equal(php.includes('Author:            galandras12+AI'), true);
  assert.equal(php.includes('declare(strict_types=1);'), true);
  assert.equal(php.includes("add_shortcode( 'wtk_cookie_consent'"), true);
  assert.equal(php.includes("add_shortcode( 'wtk_info_banner'"), true);

  const audit = auditWordPressPhpCompatibility(php, INITIAL_STATE);
  assert.equal(audit.allPassed, true);
  assert.equal(audit.passedCount, 9);
});


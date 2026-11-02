import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { SearchConfig, SearchWidgetLayout } from '../types/toolkit';

interface SearchModulePanelProps {
  config: SearchConfig;
  onUpdateConfig: (patch: Partial<SearchConfig>) => void;
}

const LAYOUT_OPTIONS: Array<{
  id: SearchWidgetLayout;
  label: string;
  desc: string;
}> = [
  {
    id: 'detailed',
    label: 'Részletes Találati Lista',
    desc: 'Bélyegkép, kategória, dátum, kiemelt kulcsszavak és szöveges kivonat',
  },
  {
    id: 'compact-cards',
    label: 'Kompakt Kártyás Lista',
    desc: 'Keretezett kártyák letöltési gombbal és gyors áttekintéssel',
  },
  {
    id: 'minimal',
    label: 'Minimalista Gyorslista',
    desc: 'Kizárólag cím és dátum a maximális tömörség érdekében',
  },
];

export const SearchModulePanel: React.FC<SearchModulePanelProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [newTagInput, setNewTagInput] = useState('');

  const togglePostType = (type: 'post' | 'event' | 'page' | 'download') => {
    const exists = config.includedTypes.includes(type);
    if (exists && config.includedTypes.length === 1) return; // keep at least one
    const next = exists
      ? config.includedTypes.filter((t) => t !== type)
      : [...config.includedTypes, type];
    onUpdateConfig({ includedTypes: next });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim();
    if (!clean || config.popularTags.includes(clean)) return;
    onUpdateConfig({ popularTags: [...config.popularTags, clean] });
    setNewTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    onUpdateConfig({
      popularTags: config.popularTags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            02. Fejlett Keresőmotor és Testreszabható Találati Lista
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Valós idejű AJAX keresés az oldalsávban kulcsszó-kiemeléssel, tartalomtípus szűréssel és ajánlott címkékkel.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onUpdateConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Kereső widget aktív
          </span>
        </label>
      </div>

      {/* Layout Style Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Találati Lista Elrendezése
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LAYOUT_OPTIONS.map((opt) => {
            const active = config.layout === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdateConfig({ layout: opt.id })}
                className={`p-3.5 rounded-lg border text-left transition-colors ${
                  active
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Engine Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label
            htmlFor="search-widget-title"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Widget Címe
          </label>
          <input
            id="search-widget-title"
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onUpdateConfig({ widgetTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="search-placeholder"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Keresőmező Helyőrző Szövege (Placeholder)
          </label>
          <input
            id="search-placeholder"
            type="text"
            value={config.placeholder}
            onChange={(e) => onUpdateConfig({ placeholder: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="search-max-results"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Találatok száma az oldalsávban ({config.maxResults} találat)
          </label>
          <input
            id="search-max-results"
            type="range"
            min={2}
            max={6}
            value={config.maxResults}
            onChange={(e) => onUpdateConfig({ maxResults: Number(e.target.value) })}
            className="w-full accent-blue-600 mt-2"
          />
        </div>

        <div>
          <label
            htmlFor="search-debounce"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            AJAX Késleltetés / Debounce ({config.debounceMs} ms)
          </label>
          <input
            id="search-debounce"
            type="range"
            min={50}
            max={500}
            step={10}
            value={config.debounceMs}
            onChange={(e) => onUpdateConfig({ debounceMs: Number(e.target.value) })}
            className="w-full accent-blue-600 mt-2"
          />
        </div>
      </div>

      {/* Post Types & Result Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kereshető WordPress Tartalomtípusok (Post Types)
          </h3>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {[
              { id: 'post' as const, label: 'Bejegyzések (post)' },
              { id: 'event' as const, label: 'Események (event)' },
              { id: 'download' as const, label: 'Letöltések (download)' },
              { id: 'page' as const, label: 'Statikus oldalak (page)' },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={config.includedTypes.includes(item.id)}
                  onChange={() => togglePostType(item.id)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span className="text-slate-800 dark:text-slate-200 font-medium">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Találati Elem Mezők Testreszabása
          </h3>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.showThumbnail}
                onChange={(e) => onUpdateConfig({ showThumbnail: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Típus ikon / Bélyegkép</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.showCategory}
                onChange={(e) => onUpdateConfig({ showCategory: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Kategória név</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.showDate}
                onChange={(e) => onUpdateConfig({ showDate: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Közzététel dátuma</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.showExcerpt}
                onChange={(e) => onUpdateConfig({ showExcerpt: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Szöveges kivonat</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.highlightMatches}
                onChange={(e) => onUpdateConfig({ highlightMatches: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Találati szó kiemelése</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={config.showPopularTags}
                onChange={(e) => onUpdateConfig({ showPopularTags: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Népszerű gyors-címkék</span>
            </label>
          </div>
        </div>
      </div>

      {/* Popular Search Tags Customizer */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Ajánlott Gyorskereső Kulcsszavak az Oldalsávban</span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {config.popularTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Kulcsszó eltávolítása: ${tag}`}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddTag} className="flex items-center gap-2 max-w-md pt-1">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Új gyorskereső címke (pl. WooCommerce)"
            aria-label="Új gyorskereső címke"
            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Címke hozzáadása</span>
          </button>
        </form>
      </div>
    </div>
  );
};

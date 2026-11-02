import React, { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import {
  CalendarConfig,
  CalendarWidgetStyle,
  ScheduledPostItem,
} from '../types/toolkit';
import { validateNewPostInput } from '../utils/toolkitLogic';

interface CalendarModulePanelProps {
  config: CalendarConfig;
  posts: ScheduledPostItem[];
  onUpdateConfig: (patch: Partial<CalendarConfig>) => void;
  onAddPost: (newPost: ScheduledPostItem) => void;
  onDeletePost: (id: string) => void;
}

const STYLE_OPTIONS: Array<{
  id: CalendarWidgetStyle;
  label: string;
  desc: string;
}> = [
  {
    id: 'cards',
    label: 'Modern Kártyák',
    desc: 'Részletes kártyás elrendezés kivonattal és visszaszámlálóval',
  },
  {
    id: 'compact',
    label: 'Kompakt Dátum Lista',
    desc: 'Helytakarékos naptárjelvényes lista keskeny oldalsávokhoz',
  },
  {
    id: 'grid',
    label: 'Interaktív Havi Rács',
    desc: 'Teljes havi naptár nézet kattintható eseménynapokkal',
  },
  {
    id: 'timeline',
    label: 'Idővonal (Timeline)',
    desc: 'Kronológiai folyamnézet közelgő kiadásokhoz és webináriumokhoz',
  },
];

export const CalendarModulePanel: React.FC<CalendarModulePanelProps> = ({
  config,
  posts,
  onUpdateConfig,
  onAddPost,
  onDeletePost,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('15:00');
  const [category, setCategory] = useState<ScheduledPostItem['category']>('Konferencia');
  const [postType, setPostType] = useState<ScheduledPostItem['postType']>('event');
  const [excerpt, setExcerpt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validation = validateNewPostInput({ title, date, time, excerpt });
    if (!validation.valid) {
      setFormError(validation.error || 'Érvénytelen adatok.');
      return;
    }

    const newItem: ScheduledPostItem = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      date,
      time,
      category,
      author: 'Adminisztrátor',
      excerpt: excerpt.trim(),
      postType,
      views: 1,
      downloads: postType === 'download' ? 1 : undefined,
      featured: true,
    };

    onAddPost(newItem);
    setTitle('');
    setExcerpt('');
    setFormSuccess('Új közelgő bejegyzés sikeresen hozzáadva a naptárhoz!');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            01. Esemény Naptár és Közelgő Bejegyzések Widget
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Állítsa be az oldalsávban megjelenő naptár stílusát, szűrőit, és kezelje az ütemezett WordPress tartalmakat.
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
            Widget aktív az oldalsávban
          </span>
        </label>
      </div>

      {/* Style Selector Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Megjelenítési Stílus Választása (4 Sablon)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((opt) => {
            const active = config.style === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdateConfig({ style: opt.id })}
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
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {active ? 'Kiválasztva' : 'Választás'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label
            htmlFor="cal-widget-title"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Widget Fejléc Címe
          </label>
          <input
            id="cal-widget-title"
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onUpdateConfig({ widgetTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="cal-category-filter"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Kategória Szűrés
          </label>
          <select
            id="cal-category-filter"
            value={config.categoryFilter}
            onChange={(e) => onUpdateConfig({ categoryFilter: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          >
            <option value="all">Összes kategória megjelenítése</option>
            <option value="Konferencia">Konferencia</option>
            <option value="Webinárium">Webinárium</option>
            <option value="Kiadás">Kiadás</option>
            <option value="Workshop">Workshop</option>
            <option value="Hír">Hír</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cal-max-items"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Maximális elemszám ({config.maxItems} db)
          </label>
          <input
            id="cal-max-items"
            type="range"
            min={1}
            max={8}
            value={config.maxItems}
            onChange={(e) => onUpdateConfig({ maxItems: Number(e.target.value) })}
            className="w-full accent-blue-600 mt-2"
          />
        </div>

        {/* Field Visibility Checkboxes */}
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showCategory}
              onChange={(e) => onUpdateConfig({ showCategory: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Kategória megjelenítése</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTime}
              onChange={(e) => onUpdateConfig({ showTime: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Időpont (ÓÓ:PP)</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showExcerpt}
              onChange={(e) => onUpdateConfig({ showExcerpt: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Bejegyzés kivonat</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showCountdown}
              onChange={(e) => onUpdateConfig({ showCountdown: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Hátralévő napok számlálója</span>
          </label>
        </div>

        {/* Accent Color Picker */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Kiemelő szín:</span>
          {(['blue', 'emerald', 'amber', 'rose', 'slate'] as const).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onUpdateConfig({ accentColor: color })}
              aria-label={`Naptár kiemelő szín: ${color}`}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                config.accentColor === color
                  ? 'scale-110 border-slate-900 dark:border-white'
                  : 'border-transparent opacity-75 hover:opacity-100'
              } ${
                color === 'blue'
                  ? 'bg-blue-600'
                  : color === 'emerald'
                  ? 'bg-emerald-600'
                  : color === 'amber'
                  ? 'bg-amber-500'
                  : color === 'rose'
                  ? 'bg-rose-600'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Add New Scheduled Post / Event Form */}
      <form
        onSubmit={handleCreatePost}
        className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Új Közelgő Bejegyzés / Esemény Ütemezése</span>
          </h3>
          <span className="text-xs text-slate-500">wp_posts · post_status: future</span>
        </div>

        {formError && (
          <div
            role="alert"
            className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300"
          >
            {formError}
          </div>
        )}
        {formSuccess && (
          <div
            role="status"
            className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300"
          >
            {formSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="new-post-title"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Bejegyzés vagy Esemény Címe
            </label>
            <input
              id="new-post-title"
              type="text"
              placeholder="Pl. WordPress Biztonsági Audit Webinárium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-post-date"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Közzététel Dátuma
            </label>
            <input
              id="new-post-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-post-time"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Időpont
            </label>
            <input
              id="new-post-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-post-category"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Kategória
            </label>
            <select
              id="new-post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ScheduledPostItem['category'])}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            >
              <option value="Konferencia">Konferencia</option>
              <option value="Webinárium">Webinárium</option>
              <option value="Kiadás">Kiadás</option>
              <option value="Workshop">Workshop</option>
              <option value="Hír">Hír</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="new-post-type"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Tartalom Típusa
            </label>
            <select
              id="new-post-type"
              value={postType}
              onChange={(e) => setPostType(e.target.value as ScheduledPostItem['postType'])}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            >
              <option value="event">Esemény (event)</option>
              <option value="post">Bejegyzés (post)</option>
              <option value="download">Letölthető csomag (download)</option>
              <option value="page">Oldal (page)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="new-post-excerpt"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Rövid Kivonat az Oldalsávhoz
            </label>
            <input
              id="new-post-excerpt"
              type="text"
              placeholder="Rövid összefoglaló a látogatók számára..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Bejegyzés Hozzáadása a Naptárhoz</span>
          </button>
        </div>
      </form>

      {/* Scheduled Posts Management Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ütemezett Közelgő Tartalmak ({posts.length} db)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-950/50">
                <th className="py-2.5 px-4">Bejegyzés címe</th>
                <th className="py-2.5 px-3">Kategória</th>
                <th className="py-2.5 px-3">Dátum & Idő</th>
                <th className="py-2.5 px-3 text-right">Megtekintés</th>
                <th className="py-2.5 px-4 text-right">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {post.title}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {post.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {post.date} · {post.time}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-600 dark:text-slate-400">
                    {post.views}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      aria-label={`Törlés: ${post.title}`}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { SiteContent } from '@/types/content';

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      setMessage(res.ok ? '✅ Сохранено' : '❌ Ошибка сохранения');
    } catch { setMessage('❌ Сетевая ошибка'); }
    finally { setSaving(false); setShowConfirm(false); }
  };

  const updateField = (path: string[], value: string) => {
    if (!content) return;
    const nc = structuredClone(content);
    let obj: any = nc;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[path.length - 1]] = value;
    setContent(nc);
  };

  if (loading) return <div className="text-body text-(--color-text-muted) p-[40px]">Загрузка...</div>;
  if (!content) return <div className="text-body text-(--color-text-muted) p-[40px]">Ошибка загрузки</div>;

  return (
    <AdminLayout>
      {(tab) => (
        <div>
          <div className="flex items-center justify-between mb-[30px]">
            <h1 className="text-subtitle-tablet">
              {tab === 'home' && 'Главная'}
              {tab === 'about' && 'Обо мне'}
              {tab === 'projects' && 'Проекты'}
              {tab === 'footer' && 'Футер'}
              {tab === 'seo' && 'SEO'}
            </h1>
            <button onClick={() => setShowConfirm(true)} disabled={saving}
              className="px-[24px] py-[10px] bg-(--color-text) text-(--color-surface) text-link hover:opacity-90 transition-opacity disabled:opacity-30">
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>

          {message && <div className="mb-[20px] text-body">{message}</div>}

          <div className="flex flex-col gap-[20px] max-w-[600px]">
            {tab === 'home' && (
              <>
                <Field label="Hero — Заголовок" value={content.home.hero.title} onChange={(v) => updateField(['home', 'hero', 'title'], v)} />
                <Field label="Hero — Подзаголовок" value={content.home.hero.subtitle} onChange={(v) => updateField(['home', 'hero', 'subtitle'], v)} textarea />
                <Field label="CTA" value={content.home.cta} onChange={(v) => updateField(['home', 'cta'], v)} />
              </>
            )}
            {tab === 'about' && (
              <>
                <Field label="Имя" value={content.about.name} onChange={(v) => updateField(['about', 'name'], v)} />
                <Field label="Заголовок" value={content.about.headline} onChange={(v) => updateField(['about', 'headline'], v)} textarea />
                <Field label="Телефон" value={content.about.contact.phone} onChange={(v) => updateField(['about', 'contact', 'phone'], v)} />
              </>
            )}
            {tab === 'projects' && (
              <div className="flex flex-col gap-[30px]">
                {Object.entries(content.projects).map(([slug, project]) => (
                  <details key={slug} className="border border-(--color-text-muted)/20 p-[16px]">
                    <summary className="text-body cursor-pointer">{project.title}</summary>
                    <div className="mt-[16px] flex flex-col gap-[12px]">
                      <Field label="Название" value={project.title} onChange={(v) => updateField(['projects', slug, 'title'], v)} />
                      <Field label="Клиент" value={project.client} onChange={(v) => updateField(['projects', slug, 'client'], v)} />
                      <Field label="Описание" value={project.description} onChange={(v) => updateField(['projects', slug, 'description'], v)} textarea />
                    </div>
                  </details>
                ))}
              </div>
            )}
            {tab === 'footer' && (
              <>
                <Field label="Email" value={content.footer.email} onChange={(v) => updateField(['footer', 'email'], v)} />
                <Field label="Телефон" value={content.footer.phone} onChange={(v) => updateField(['footer', 'phone'], v)} />
              </>
            )}
            {tab === 'seo' && (
              <>
                <Field label="Home Title" value={content.seo.home?.title || ''} onChange={(v) => updateField(['seo', 'home', 'title'], v)} />
                <Field label="Home Description" value={content.seo.home?.description || ''} onChange={(v) => updateField(['seo', 'home', 'description'], v)} textarea />
              </>
            )}
          </div>

          {showConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-(--color-surface) p-[40px] max-w-[400px] w-full">
                <p className="text-body mb-[24px]">Сохранить изменения?</p>
                <div className="flex gap-[16px]">
                  <button onClick={handleSave} className="flex-1 py-[10px] bg-(--color-text) text-(--color-surface) text-link hover:opacity-90">Да</button>
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-[10px] border border-(--color-text-muted)/30 text-link text-(--color-text-muted) hover:text-(--color-text)">Нет</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const Comp = textarea ? 'textarea' : 'input';
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-label text-(--color-text-muted)">{label}</span>
      <Comp value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-[12px] py-[10px] border border-(--color-text-muted)/30 text-body bg-(--color-surface) focus:outline-none focus:border-(--color-text)"
        rows={textarea ? 4 : 1}
      />
    </label>
  );
}

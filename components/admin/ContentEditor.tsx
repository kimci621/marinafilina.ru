'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { SiteContent, ProjectContent } from '@/types/content';

const EMPTY_PROJECT: ProjectContent = {
  title: '', subtitle: '', description: '', images: [], blocks: [], category: '',
  client: '', task: '', concept: '', services: [], timeline: '', liveUrl: '',
};

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
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      setMessage(res.ok ? '✅ Сохранено' : '❌ Ошибка сохранения');
    } catch { setMessage('❌ Сетевая ошибка'); }
    finally { setSaving(false); setShowConfirm(false); }
  };

  const updateField = (path: (string | number)[], value: any) => {
    if (!content) return;
    const nc = structuredClone(content);
    let obj: any = nc;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[path.length - 1]] = value;
    setContent(nc);
    // Auto-save to server (partial update, not full content)
    fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value }),
    }).catch(() => {});
  };

  const moveItem = (path: (string | number)[], from: number, to: number) => {
    if (!content) return;
    const nc = structuredClone(content);
    let obj: any = nc;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    const arr = obj[path[path.length - 1]];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setContent(nc);
    fetch('/api/admin/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, value: arr }) }).catch(() => {});
  };

  const removeItem = (path: (string | number)[], index: number) => {
    if (!content) return;
    const nc = structuredClone(content);
    let obj: any = nc;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    const arr = obj[path[path.length - 1]];
    arr.splice(index, 1);
    setContent(nc);
    fetch('/api/admin/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, value: arr }) }).catch(() => {});
  };

  const addProject = () => {
    if (!content) return;
    const slug = 'project-' + Date.now();
    updateField(['projects', slug], { ...EMPTY_PROJECT, title: 'Новый проект' });
    updateField(['home', 'projects'], [...content.home.projects, slug]);
  };

  const removeProject = (slug: string) => {
    if (!content) return;
    const nc = structuredClone(content);
    delete nc.projects[slug];
    nc.home.projects = nc.home.projects.filter((s) => s !== slug);
    setContent(nc);
  };

  const addPhoto = async (file: File, isMobile: boolean = false) => {
    if (!content) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) return;
      const { url } = await res.json();
      const id = 'photo-' + Date.now();
      if (isMobile) {
        const photoIds = Object.keys(content.photos);
        const lastId = photoIds[photoIds.length - 1];
        if (lastId) {
          updateField(['photos', lastId, 'mobileUrl'], url);
          updateField(['photos', lastId, 'mobileFilename'], file.name);
          return;
        }
      }
      updateField(['photos', id], { id, url, filename: file.name });
    } catch {}
  };

  const removePhoto = (id: string) => {
    if (!content) return;
    const nc = structuredClone(content);
    delete nc.photos[id];
    setContent(nc);
  };

  if (loading) return <div className="text-body p-[40px]">Загрузка...</div>;
  if (!content) return <div className="text-body p-[40px]">Ошибка загрузки</div>;

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
              {tab === 'ui' && 'Интерфейс'}
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

                <SectionTitle label="Порядок проектов" />
                <ReorderList
                  items={content.home.projects.map((slug) => ({ key: slug, label: content.projects[slug]?.title || slug }))}
                  onMove={(f, t) => moveItem(['home', 'projects'], f, t)}
                  onRemove={(i) => {
                    const slug = content.home.projects[i];
                    removeProject(slug);
                  }}
                />
              </>
            )}

            {tab === 'about' && (
              <>
                <Field label="Имя" value={content.about.name} onChange={(v) => updateField(['about', 'name'], v)} />
                <Field label="Заголовок" value={content.about.headline} onChange={(v) => updateField(['about', 'headline'], v)} textarea />
                <Field label="Телефон" value={content.about.contact.phone} onChange={(v) => updateField(['about', 'contact', 'phone'], v)} />

                <SectionTitle label="Услуги" />
                {content.about.services.map((s, i) => (
                  <div key={i} className="border border-(--color-text-muted)/20 p-[12px]">
                    <Field label="Название" value={s.title} onChange={(v) => updateField(['about', 'services', i, 'title'], v)} />
                    <Field label="Описание" value={s.description} onChange={(v) => updateField(['about', 'services', i, 'description'], v)} textarea />
                    <OrderButtons i={i} total={content.about.services.length} onMove={(d) => moveItem(['about', 'services'], i, i + d)} onRemove={() => removeItem(['about', 'services'], i)} />
                  </div>
                ))}
                <button onClick={() => updateField(['about', 'services'], [...content.about.services, { title: '', description: '' }])}
                  className="text-link border border-(--color-text-muted)/30 px-[16px] py-[8px] hover:border-(--color-text)">+ Услуга</button>

                <SectionTitle label="Опыт" />
                <ReorderList
                  items={content.about.experience.map((t, i) => ({ key: String(i), label: t }))}
                  onMove={(f, t) => moveItem(['about', 'experience'], f, t)}
                  onRemove={(i) => removeItem(['about', 'experience'], i)}
                />
                <button onClick={() => updateField(['about', 'experience'], [...content.about.experience, ''])}
                  className="text-link border border-(--color-text-muted)/30 px-[16px] py-[8px] hover:border-(--color-text)">+ Пункт</button>

                <SectionTitle label="Блоки страницы (приоритет)" />
                <p className="text-[12px] text-(--color-text-muted)">Если блоки заполнены — страница рендерится из них. Иначе используется старая структура выше.</p>
                <ReorderList
                  items={content.about.blocks.map((b, i) => ({ key: String(i), label: `${b.type}: ${b.type === 'intro' ? b.title : b.type === 'list' ? b.title : b.type === 'services' ? b.items.length + ' услуг' : b.type === 'html' ? 'HTML ' + b.html.slice(0, 40) : b.type}` }))}
                  onMove={(f, t) => moveItem(['about', 'blocks'], f, t)}
                  onRemove={(i) => removeItem(['about', 'blocks'], i)}
                />
                <div className="flex flex-wrap gap-[8px]">
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'intro', title: '', subtitle: '' }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ Интро</button>
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'services', items: [] }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ Услуги</button>
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'list', title: '', items: [] }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ Список</button>
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'html', html: '' }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ HTML</button>
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'contact', phone: '', email: '' }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ Контакты</button>
                  <button onClick={() => updateField(['about', 'blocks'], [...content.about.blocks, { type: 'divider' }])}
                    className="text-link border px-[8px] py-[4px] text-[14px]">+ Разделитель</button>
                </div>
                {content.about.blocks.map((block, bi) => (
                  <details key={bi} className="border border-(--color-text-muted)/10 p-[8px]">
                    <summary className="text-[14px] cursor-pointer">{block.type} #{bi + 1}</summary>
                    <div className="mt-[8px] flex flex-col gap-[8px]">
                      {block.type === 'intro' && (<>
                        <Field label="Заголовок" value={block.title} onChange={(v) => updateField(['about', 'blocks', bi, 'title'], v)} />
                        <Field label="Подзаголовок" value={block.subtitle} onChange={(v) => updateField(['about', 'blocks', bi, 'subtitle'], v)} textarea />
                      </>)}
                      {block.type === 'services' && (<>
                        {block.items.map((s, si) => (
                          <div key={si} className="border p-[8px]">
                            <Field label="Название" value={s.title} onChange={(v) => updateField(['about', 'blocks', bi, 'items', si, 'title'], v)} />
                            <Field label="Описание" value={s.description} onChange={(v) => updateField(['about', 'blocks', bi, 'items', si, 'description'], v)} textarea />
                            <OrderButtons i={si} total={block.items.length} onMove={(d) => moveItem(['about', 'blocks', bi, 'items'], si, si + d)} onRemove={() => removeItem(['about', 'blocks', bi, 'items'], si)} />
                          </div>
                        ))}
                        <button onClick={() => updateField(['about', 'blocks', bi, 'items'], [...block.items, { title: '', description: '' }])}
                          className="text-link text-[14px] border px-[8px] py-[4px]">+ Услуга</button>
                      </>)}
                      {block.type === 'list' && (<>
                        <Field label="Заголовок" value={block.title} onChange={(v) => updateField(['about', 'blocks', bi, 'title'], v)} />
                        <ReorderList
                          items={block.items.map((t, li) => ({ key: String(li), label: t }))}
                          onMove={(f, t) => moveItem(['about', 'blocks', bi, 'items'], f, t)}
                          onRemove={(i) => removeItem(['about', 'blocks', bi, 'items'], i)}
                        />
                        <button onClick={() => updateField(['about', 'blocks', bi, 'items'], [...block.items, ''])}
                          className="text-link text-[14px] border px-[8px] py-[4px]">+ Пункт</button>
                      </>)}
                      {block.type === 'html' && (
                        <Field label="HTML" value={block.html} onChange={(v) => updateField(['about', 'blocks', bi, 'html'], v)} textarea />
                      )}
                      {block.type === 'contact' && (<>
                        <Field label="Телефон" value={block.phone} onChange={(v) => updateField(['about', 'blocks', bi, 'phone'], v)} />
                        <Field label="Email" value={block.email} onChange={(v) => updateField(['about', 'blocks', bi, 'email'], v)} />
                      </>)}
                    </div>
                  </details>
                ))}
              </>
            )}

            {tab === 'projects' && (
              <div className="flex flex-col gap-[30px]">
                <button onClick={addProject}
                  className="text-link border border-(--color-text-muted)/30 px-[16px] py-[8px] hover:border-(--color-text) self-start">+ Новый проект</button>
                {Object.entries(content.projects).map(([slug, project]) => (
                  <details key={slug} className="border border-(--color-text-muted)/20 p-[16px]">
                    <summary className="text-body cursor-pointer">{project.title || slug}</summary>
                    <div className="mt-[16px] flex flex-col gap-[12px]">
                      <Field label="Slug" value={slug} onChange={(v) => {
                        const nc = structuredClone(content);
                        const old = nc.projects[slug];
                        delete nc.projects[slug];
                        nc.projects[v] = old;
                        nc.home.projects = nc.home.projects.map((s) => s === slug ? v : s);
                        setContent(nc);
                      }} />
                      <Field label="Название" value={project.title} onChange={(v) => updateField(['projects', slug, 'title'], v)} />
                      <Field label="Клиент" value={project.client} onChange={(v) => updateField(['projects', slug, 'client'], v)} />
                      <Field label="Описание" value={project.description} onChange={(v) => updateField(['projects', slug, 'description'], v)} textarea />
                      <Field label="Задача" value={project.task} onChange={(v) => updateField(['projects', slug, 'task'], v)} textarea />
                      <Field label="Концепт" value={project.concept} onChange={(v) => updateField(['projects', slug, 'concept'], v)} textarea />

                      <SectionTitle label="Блоки страницы" />
                      <ReorderList
                        items={project.blocks.map((b, i) => ({ key: String(i), label: b.type === 'wide' ? `[Широкое] ${b.image?.slice(0,40)}...` : `[Сплит] L:${b.imageLeft?.slice(0,20)}... R:${b.imageRight?.slice(0,20)}...` }))}
                        onMove={(f, t) => moveItem(['projects', slug, 'blocks'], f, t)}
                        onRemove={(i) => removeItem(['projects', slug, 'blocks'], i)}
                      />
                      <div className="flex gap-[8px]">
                        <button onClick={() => updateField(['projects', slug, 'blocks'], [...project.blocks, { type: 'wide', image: '', height: 600 }])}
                          className="text-link border px-[8px] py-[4px] text-[14px]">+ Широкое фото</button>
                        <button onClick={() => updateField(['projects', slug, 'blocks'], [...project.blocks, { type: 'split', imageLeft: '', imageRight: '', height: 800 }])}
                          className="text-link border px-[8px] py-[4px] text-[14px]">+ Сплит (2 фото)</button>
                      </div>
                      {project.blocks.map((block, bi) => (
                        <details key={bi} className="border border-(--color-text-muted)/10 p-[8px]">
                          <summary className="text-[14px] cursor-pointer">{block.type === 'wide' ? 'Широкое фото' : 'Сплит (2 фото)'} #{bi + 1}</summary>
                          <div className="mt-[8px] flex flex-col gap-[8px]">
                            <Field label="Высота (px)" value={String(block.height)} onChange={(v) => updateField(['projects', slug, 'blocks', bi, 'height'], Number(v) || 600)} />
                            {block.type === 'wide' ? (
                              <PhotoSelect label="Фото" value={block.image} photos={Object.values(content.photos)} onChange={(v) => updateField(['projects', slug, 'blocks', bi, 'image'], v)} />
                            ) : (
                              <>
                                <PhotoSelect label="Левое фото" value={block.imageLeft} photos={Object.values(content.photos)} onChange={(v) => updateField(['projects', slug, 'blocks', bi, 'imageLeft'], v)} />
                                <PhotoSelect label="Правое фото" value={block.imageRight} photos={Object.values(content.photos)} onChange={(v) => updateField(['projects', slug, 'blocks', bi, 'imageRight'], v)} />
                              </>
                            )}
                          </div>
                        </details>
                      ))}

                      <div className="border-t border-(--color-text-muted)/20 pt-[12px] flex gap-[8px]">
                        <button onClick={() => removeProject(slug)}
                          className="text-link text-red-600 hover:opacity-70">Удалить проект</button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}

            {tab === 'photos' && (
              <div className="flex flex-col gap-[20px]">
                <div className="flex gap-[12px]">
                  <label className="flex flex-col gap-[8px] flex-1">
                    <span className="text-label text-(--color-text-muted)">Загрузить фото (десктоп)</span>
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f, false); }}
                      className="text-body" />
                  </label>
                  <label className="flex flex-col gap-[8px] flex-1">
                    <span className="text-label text-(--color-text-muted)">+ Мобильная версия (к последнему фото)</span>
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f, true); }}
                      className="text-body" />
                  </label>
                </div>
                <p className="text-[12px] text-(--color-text-muted)">Сначала загрузи десктоп-фото, затем мобильную версию для него. На мобильных устройствах (&lt;800px) покажется мобильный вариант.</p>
                <SectionTitle label={`Галерея (${Object.keys(content.photos).length} фото)`} />
                <div className="grid grid-cols-3 gap-[12px]">
                  {Object.values(content.photos).map((photo) => (
                    <div key={photo.id} className="relative border border-(--color-text-muted)/20 group">
                      <img src={photo.url} alt={photo.filename} className="w-full h-[120px] object-cover" />
                      {photo.mobileUrl && (
                        <div className="absolute top-[4px] left-[4px] bg-green-600 text-white text-[10px] px-[4px] py-[1px]">📱</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-[4px] truncate">{photo.filename}</div>
                      <button onClick={() => removePhoto(photo.id)}
                        className="absolute top-[4px] right-[4px] w-[20px] h-[20px] bg-red-600 text-white rounded-full text-[12px] opacity-0 group-hover:opacity-100 flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
                {Object.keys(content.photos).length === 0 && <p className="text-body text-(--color-text-muted)">Нет загруженных фото</p>}
              </div>
            )}

            {tab === 'footer' && (
              <>
                <Field label="Логотип" value={content.footer.logo} onChange={(v) => updateField(['footer', 'logo'], v)} />
                <Field label="Email" value={content.footer.email} onChange={(v) => updateField(['footer', 'email'], v)} />
                <Field label="Телефон" value={content.footer.phone} onChange={(v) => updateField(['footer', 'phone'], v)} />

                <SectionTitle label="Соцсети" />
                <ReorderList
                  items={content.footer.socials.map((s) => ({ key: s.label, label: `${s.label} (${s.url})` }))}
                  onMove={(f, t) => moveItem(['footer', 'socials'], f, t)}
                  onRemove={(i) => removeItem(['footer', 'socials'], i)}
                />
                <button onClick={() => updateField(['footer', 'socials'], [...content.footer.socials, { label: '', url: '' }])}
                  className="text-link border border-(--color-text-muted)/30 px-[16px] py-[8px] hover:border-(--color-text)">+ Соцсеть</button>

                <SectionTitle label="Нав-ссылки" />
                <ReorderList
                  items={content.nav.links.map((l) => ({ key: l.href, label: `${l.label} → ${l.href}` }))}
                  onMove={(f, t) => moveItem(['nav', 'links'], f, t)}
                  onRemove={(i) => removeItem(['nav', 'links'], i)}
                />
                <button onClick={() => updateField(['nav', 'links'], [...content.nav.links, { label: '', href: '' }])}
                  className="text-link border border-(--color-text-muted)/30 px-[16px] py-[8px] hover:border-(--color-text)">+ Ссылка</button>
              </>
            )}

            {tab === 'seo' && (
              <>
                <Field label="Home Title" value={content.seo.home?.title || ''} onChange={(v) => updateField(['seo', 'home', 'title'], v)} />
                <Field label="Home Description" value={content.seo.home?.description || ''} onChange={(v) => updateField(['seo', 'home', 'description'], v)} textarea />
                <Field label="About Title" value={content.seo.about?.title || ''} onChange={(v) => updateField(['seo', 'about', 'title'], v)} />
                <Field label="About Description" value={content.seo.about?.description || ''} onChange={(v) => updateField(['seo', 'about', 'description'], v)} textarea />
              </>
            )}

            {tab === 'ui' && (
              <>
                <SectionTitle label="Навигация" />
                <Field label="Меню (открыто)" value={content.ui.nav.menuOpen} onChange={(v) => updateField(['ui', 'nav', 'menuOpen'], v)} />
                <Field label="Меню (закрыто)" value={content.ui.nav.menuClosed} onChange={(v) => updateField(['ui', 'nav', 'menuClosed'], v)} />

                <SectionTitle label="Карточка проекта" />
                <Field label="Лейбл" value={content.ui.projectCard.label} onChange={(v) => updateField(['ui', 'projectCard', 'label'], v)} />
                <Field label="Текст ссылки" value={content.ui.projectCard.linkText} onChange={(v) => updateField(['ui', 'projectCard', 'linkText'], v)} />
                <Field label="Стрелка" value={content.ui.projectCard.linkArrow} onChange={(v) => updateField(['ui', 'projectCard', 'linkArrow'], v)} />

                <SectionTitle label="Футер" />
                <Field label="Заголовок соцсетей" value={content.ui.footer.socialsLabel} onChange={(v) => updateField(['ui', 'footer', 'socialsLabel'], v)} />

                <SectionTitle label="Обо мне" />
                <Field label="Опыт работы" value={content.ui.about.experienceLabel} onChange={(v) => updateField(['ui', 'about', 'experienceLabel'], v)} />
                <Field label="Образование" value={content.ui.about.educationLabel} onChange={(v) => updateField(['ui', 'about', 'educationLabel'], v)} />

                <SectionTitle label="Проект" />
                <Field label="Задача" value={content.ui.project.taskLabel} onChange={(v) => updateField(['ui', 'project', 'taskLabel'], v)} />
                <Field label="Концепт" value={content.ui.project.conceptLabel} onChange={(v) => updateField(['ui', 'project', 'conceptLabel'], v)} />
                <Field label="Услуги" value={content.ui.project.servicesLabel} onChange={(v) => updateField(['ui', 'project', 'servicesLabel'], v)} />
                <Field label="Предыдущий" value={content.ui.project.prevProject} onChange={(v) => updateField(['ui', 'project', 'prevProject'], v)} />
                <Field label="Следующий" value={content.ui.project.nextProject} onChange={(v) => updateField(['ui', 'project', 'nextProject'], v)} />

                <SectionTitle label="404" />
                <Field label="Заголовок" value={content.ui.notFound.title} onChange={(v) => updateField(['ui', 'notFound', 'title'], v)} />
                <Field label="Текст" value={content.ui.notFound.text} onChange={(v) => updateField(['ui', 'notFound', 'text'], v)} />
                <Field label="Ссылка" value={content.ui.notFound.linkText} onChange={(v) => updateField(['ui', 'notFound', 'linkText'], v)} />
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

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const Comp = textarea ? 'textarea' : 'input';
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-label text-(--color-text-muted)">{label}</span>
      <Comp value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-[12px] py-[10px] border border-(--color-text-muted)/30 text-body bg-(--color-surface) focus:outline-none focus:border-(--color-text)"
        rows={textarea ? 4 : 1} />
    </label>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <h3 className="text-h4 pt-[20px] border-t border-(--color-text-muted)/20">{label}</h3>;
}

function PhotoSelect({ label, value, photos, onChange }: { label: string; value: string; photos: { id: string; url: string; filename: string }[]; onChange: (v: string) => void }) {
  const selected = photos.find((p) => p.url === value);
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-label text-(--color-text-muted)">{label}</span>
      {selected && <img src={selected.url} alt={selected.filename} className="w-[80px] h-[60px] object-cover border" />}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-[12px] py-[10px] border border-(--color-text-muted)/30 text-body bg-(--color-surface) focus:outline-none focus:border-(--color-text)">
        <option value="">— Выбрать —</option>
        {photos.map((p) => (
          <option key={p.id} value={p.url}>{p.filename}</option>
        ))}
      </select>
    </label>
  );
}

function OrderButtons({ i, total, onMove, onRemove }: { i: number; total: number; onMove: (d: number) => void; onRemove: () => void }) {
  return (
    <div className="flex gap-[8px] mt-[8px]">
      <button disabled={i === 0} onClick={() => onMove(-1)}
        className="px-[8px] py-[4px] border border-(--color-text-muted)/20 text-[12px] disabled:opacity-20">↑</button>
      <button disabled={i === total - 1} onClick={() => onMove(1)}
        className="px-[8px] py-[4px] border border-(--color-text-muted)/20 text-[12px] disabled:opacity-20">↓</button>
      <button onClick={onRemove}
        className="px-[8px] py-[4px] border border-red-600/30 text-[12px] text-red-600 hover:bg-red-50">×</button>
    </div>
  );
}

function ReorderList({ items, onMove, onRemove }: { items: { key: string; label: string }[]; onMove: (f: number, t: number) => void; onRemove: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-[4px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-[8px] border border-(--color-text-muted)/20 px-[12px] py-[8px]">
          <span className="flex-1 text-body truncate">{item.label || '(пусто)'}</span>
          <button disabled={i === 0} onClick={() => onMove(i, i - 1)}
            className="px-[6px] py-[2px] border border-(--color-text-muted)/20 text-[12px] disabled:opacity-20">↑</button>
          <button disabled={i === items.length - 1} onClick={() => onMove(i, i + 1)}
            className="px-[6px] py-[2px] border border-(--color-text-muted)/20 text-[12px] disabled:opacity-20">↓</button>
          <button onClick={() => onRemove(i)}
            className="px-[6px] py-[2px] border border-red-600/30 text-[12px] text-red-600 hover:bg-red-50">×</button>
        </div>
      ))}
    </div>
  );
}

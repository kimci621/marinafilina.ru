'use client';

import { useState } from 'react';

type Tab = 'home' | 'about' | 'projects' | 'footer' | 'seo';
const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'projects', label: 'Projects' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
];

export default function AdminLayout({ children }: { children: (tab: Tab) => React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen flex">
      <aside className="w-[220px] bg-(--color-text-muted)/5 border-r border-(--color-text-muted)/10 p-[20px] flex flex-col">
        <h2 className="text-nav text-(--color-text) mb-[30px]">Админ-панель</h2>
        <nav className="flex flex-col gap-[4px]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-nav text-left px-[12px] py-[8px] transition-colors ${
                activeTab === tab.key ? 'text-(--color-text) bg-(--color-text)/5' : 'text-(--color-text-muted) hover:text-(--color-text)'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-[40px] overflow-y-auto">{children(activeTab)}</main>
    </div>
  );
}

'use client';

import { useState, FormEvent } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { window.location.reload(); }
      else {
        const data = await res.json();
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
      <form onSubmit={handleSubmit} className="w-full max-w-[400px] p-[40px]">
        <h1 className="text-subtitle-desktop mb-[32px] text-center">Вход</h1>
        <div className="flex flex-col gap-[16px]">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Мастер-пароль"
            className="w-full px-[16px] py-[12px] border border-(--color-text-muted)/30 text-body focus:outline-none focus:border-(--color-text)"
            autoFocus
          />
          {error && <p className="text-body text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-[12px] bg-(--color-text) text-(--color-surface) text-link hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
}

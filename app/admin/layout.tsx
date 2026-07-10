'use client';

import { useState, useEffect } from 'react';
import AdminLogin from './login';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => setAuthorized(res.ok))
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-body text-(--color-text-muted)">Загрузка...</div></div>;
  }

  if (!authorized) return <AdminLogin />;

  return <>{children}</>;
}

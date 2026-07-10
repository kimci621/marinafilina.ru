import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="content-container min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">404</h1>
      <p className="text-subtitle-mobile tablet:text-subtitle-tablet text-(--color-text-muted) mb-[40px]">
        Страница не найдена
      </p>
      <Link
        href="/"
        className="text-link border-b border-(--color-text) hover:opacity-70 transition-opacity"
      >
        На главную →
      </Link>
    </div>
  );
}

import { getContent } from '@/lib/content';
import Link from 'next/link';

export default async function NotFound() {
  const content = await getContent();
  const ui = content.ui.notFound;

  return (
    <div className="content-container min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">{ui.title}</h1>
      <p className="text-subtitle-mobile tablet:text-subtitle-tablet text-(--color-text-muted) mb-[40px]">{ui.text}</p>
      <Link href="/" className="text-link border-b border-(--color-text) hover:opacity-70 transition-opacity">
        {ui.linkText}
      </Link>
    </div>
  );
}

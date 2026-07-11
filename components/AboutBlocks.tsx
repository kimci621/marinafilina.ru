'use client';

import type { AboutBlock } from '@/types/content';

interface AboutBlocksProps {
  blocks: AboutBlock[];
}

export default function AboutBlocks({ blocks }: AboutBlocksProps) {
  if (!blocks.length) return null;

  return (
    <div className="flex flex-col">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'intro':
            return (
              <section key={i} className="content-container py-[60px]">
                <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">{block.title}</h1>
                <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop">{block.subtitle}</p>
              </section>
            );

          case 'services':
            return (
              <section key={i} className="content-container py-[60px]">
                <div className="grid grid-cols-1 tablet:grid-cols-3 gap-[30px]">
                  {block.items.map((s, j) => (
                    <div key={j}>
                      <h3 className="text-subtitle-tablet desktop:text-subtitle-desktop mb-[12px]">{s.title}</h3>
                      <p className="text-body">{s.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'list':
            return (
              <section key={i} className="content-container py-[60px]">
                <h2 className="text-subtitle-tablet desktop:text-subtitle-desktop mb-[24px]">{block.title}</h2>
                <ul className="flex flex-col gap-[12px]">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-body">{item}</li>
                  ))}
                </ul>
              </section>
            );

          case 'html':
            return (
              <section key={i} className="content-container py-[60px]">
                <div className="text-body prose" dangerouslySetInnerHTML={{ __html: block.html }} />
              </section>
            );

          case 'contact':
            return (
              <section key={i} className="content-container py-[60px]">
                <div className="divider mb-[30px]" />
                <div className="text-body">
                  {block.phone && (
                    <a href={`tel:${block.phone.replace(/\s/g, '')}`} className="block hover:opacity-70">{block.phone}</a>
                  )}
                  {block.email && (
                    <a href={`mailto:${block.email}`} className="block hover:opacity-70">{block.email}</a>
                  )}
                </div>
                <div className="divider mt-[30px]" />
              </section>
            );

          case 'divider':
            return <div key={i} className="content-container"><div className="divider" /></div>;

          default:
            return null;
        }
      })}
    </div>
  );
}

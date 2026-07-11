import { getContent } from '@/lib/content';
import { Metadata } from 'next';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Footer from '@/components/Footer';
import AboutBlocks from '@/components/AboutBlocks';
import { PhotosProvider } from '@/components/PhotosContext';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.seo.about?.title || 'Обо мне — Марина Филина',
    description: content.seo.about?.description || 'Бренд-дизайнер Марина Филина',
  };
}

export default async function AboutPage() {
  const content = await getContent();
  const { nav, about, footer, ui } = content;

  return (
    <PhotosProvider photos={content.photos || {}}>
      <Nav logo={nav.logo} links={nav.links} />
      <NavMobile logo={nav.logo} links={nav.links} ui={ui.nav} />

      <main className="pt-[80px]">
        {about.blocks && about.blocks.length > 0 ? (
          <AboutBlocks blocks={about.blocks} />
        ) : (
          <>
            <section className="content-container py-[60px]">
              <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">{about.name}</h1>
              <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop">{about.headline}</p>
            </section>
            <section className="content-container py-[60px]">
              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-[30px]">
                {about.services.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-subtitle-tablet desktop:text-subtitle-desktop mb-[12px]">{s.title}</h3>
                    <p className="text-body">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="content-container py-[60px]">
              <div className="flex flex-col tablet:flex-row gap-[60px]">
                <div className="tablet:w-1/2">
                  <h2 className="text-subtitle-tablet desktop:text-subtitle-desktop mb-[24px]">{ui.about.experienceLabel}</h2>
                  <ul className="flex flex-col gap-[12px]">{about.experience.map((item, i) => <li key={i} className="text-body">{item}</li>)}</ul>
                </div>
                <div className="tablet:w-1/2">
                  <h2 className="text-subtitle-tablet desktop:text-subtitle-desktop mb-[24px]">{ui.about.educationLabel}</h2>
                  <ul className="flex flex-col gap-[12px]">{about.education.map((item, i) => <li key={i} className="text-body">{item}</li>)}</ul>
                </div>
              </div>
            </section>
            <section className="content-container py-[60px]">
              <div className="divider mb-[30px]" />
              <div className="text-body">
                {about.contact.phone && <a href={`tel:${about.contact.phone.replace(/\s/g, '')}`} className="block hover:opacity-70">{about.contact.phone}</a>}
                {about.contact.email && <a href={`mailto:${about.contact.email}`} className="block hover:opacity-70">{about.contact.email}</a>}
              </div>
              <div className="divider mt-[30px]" />
            </section>
          </>
        )}
      </main>

      <Footer content={footer} ui={ui.footer} />
    </PhotosProvider>
  );
}

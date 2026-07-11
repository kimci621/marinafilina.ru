import { getHomeContent } from '@/lib/content';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { PhotosProvider } from '@/components/PhotosContext';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getHomeContent();
  const { nav, home, footer, ui, projects, photos } = content;

  return (
    <PhotosProvider photos={photos || {}}>
      <Nav logo={nav.logo} links={nav.links} />
      <NavMobile logo={nav.logo} links={nav.links} ui={ui.nav} />

      <main>
        <Hero title={home.hero.title} subtitle={home.hero.subtitle} />

        <section id="work">
          {home.projects.map((slug: string) => {
            const project = projects[slug];
            if (!project) return null;
            return (
              <ProjectCard
                key={slug}
                title={project.title}
                subtitle={project.subtitle}
                images={project.images}
                description={project.description}
                slug={slug}
                ui={ui.projectCard}
              />
            );
          })}
        </section>

        <CTASection text={home.cta} />

        <Footer content={footer} ui={ui.footer} />
      </main>
    </PhotosProvider>
  );
}

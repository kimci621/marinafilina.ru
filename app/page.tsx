import { getContent } from '@/lib/content';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default async function HomePage() {
  const content = await getContent();
  const { nav, home, footer } = content;

  return (
    <>
      <Nav logo={nav.logo} links={nav.links} />
      <NavMobile logo={nav.logo} links={nav.links} />

      <main>
        <Hero title={home.hero.title} subtitle={home.hero.subtitle} />

        <section id="work">
          {home.projects.map((slug) => {
            const project = content.projects[slug];
            if (!project) return null;
            return (
              <ProjectCard
                key={slug}
                title={project.title}
                subtitle={project.subtitle}
                images={project.images}
                description={project.description}
                slug={slug}
              />
            );
          })}
        </section>

        <CTASection text={home.cta} />

        <Footer content={footer} />
      </main>
    </>
  );
}

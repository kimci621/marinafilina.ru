import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getContent, getProject, getProjectSlugs } from '@/lib/content';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Footer from '@/components/Footer';
import ArrowIcon from '@/components/ArrowIcon';
import ProjectBlocks from '@/components/ProjectBlocks';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Проект не найден' };
  return {
    title: `${project.title} — Марина Филина`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const content = await getContent();
  const project = await getProject(slug);
  const { ui } = content;

  if (!project) notFound();

  const projectIndex = content.home.projects.indexOf(slug);
  const prevSlug = projectIndex > 0 ? content.home.projects[projectIndex - 1] : null;
  const nextSlug = projectIndex < content.home.projects.length - 1
    ? content.home.projects[projectIndex + 1]
    : null;

  return (
    <>
      <Nav logo={content.nav.logo} links={content.nav.links} />
      <NavMobile logo={content.nav.logo} links={content.nav.links} ui={ui.nav} />

      <main className="pt-[80px]">
        <section className="content-container py-[80px]">
          <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">{project.title}</h1>
          <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-(--color-text-muted) mb-[24px]">{project.client}</p>
          <span className="text-label text-(--color-text-muted)">{project.category}</span>
        </section>

        {project.blocks && project.blocks.length > 0 ? (
          <ProjectBlocks blocks={project.blocks} />
        ) : project.images.length > 0 ? (
          <section className="content-container py-[40px]">
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[16px]">
              {project.images.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  <Image src={src} alt={`${project.title} ${i + 1}`} fill className="object-cover" sizes="(max-width: 799px) 345px, (max-width: 1279px) 375px, 410px" unoptimized />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="content-container py-[40px]">
          <div className="flex flex-col tablet:flex-row tablet:justify-between">
            <div className="tablet:w-[341px]">
              <span className="text-label text-(--color-text-muted)">{ui.project.taskLabel}</span>
            </div>
            <div className="tablet:w-[360px]"><p className="text-body">{project.task}</p></div>
          </div>
        </section>

        <section className="content-container py-[40px]">
          <div className="flex flex-col tablet:flex-row tablet:justify-between">
            <div className="tablet:w-[341px]">
              <span className="text-label text-(--color-text-muted)">{ui.project.conceptLabel}</span>
            </div>
            <div className="tablet:w-[360px]"><p className="text-body">{project.concept}</p></div>
          </div>
        </section>

        {(project.services.length > 0 || project.timeline) && (
          <section className="content-container py-[40px]">
            <div className="flex flex-col tablet:flex-row tablet:justify-between">
              <div className="tablet:w-[341px]">
                <span className="text-label text-(--color-text-muted)">{ui.project.servicesLabel}</span>
                {project.timeline && <p className="text-body text-(--color-text-muted) mt-[12px]">{project.timeline}</p>}
              </div>
              <div className="tablet:w-[360px]">
                <ul className="flex flex-col gap-[8px]">
                  {project.services.map((s, i) => <li key={i} className="text-body">{s}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="content-container py-[60px]">
          <div className="divider mb-[30px]" />
          <div className="flex justify-between text-link text-(--color-text-muted)">
            {prevSlug ? (
              <a href={`/${prevSlug}`} className="flex items-center gap-[4px] hover:text-(--color-text) transition-colors">
                <ArrowIcon direction="left" /> {ui.project.prevProject}
              </a>
            ) : <span />}
            {nextSlug ? (
              <a href={`/${nextSlug}`} className="flex items-center gap-[4px] hover:text-(--color-text) transition-colors">
                {ui.project.nextProject} <ArrowIcon />
              </a>
            ) : <span />}
          </div>
          <div className="divider mt-[30px]" />
        </section>
      </main>

      <Footer content={content.footer} ui={ui.footer} />
    </>
  );
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageSlider from './ImageSlider';
import type { UIContent } from '@/types/content';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  slug: string;
  ui: UIContent['projectCard'];
}

export default function ProjectCard({ title, subtitle, images, description, slug, ui }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <motion.article
      ref={cardRef}
      className="content-container py-[20px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div style={{ y: parallaxY }} className="overflow-hidden">
        <ImageSlider images={images} />
      </motion.div>

      <div className="flex flex-col tablet:flex-row tablet:justify-between mt-[20px]">
        <div className="tablet:w-[341px]">
          <span data-testid="project-label" className="text-label text-(--color-text-muted) block mb-[4px]">
            {ui.label}
          </span>
          <h3 className="text-h3 text-(--color-text)">
            <Link href={`/${slug}`} className="hover:opacity-70 transition-opacity">
              {title}
            </Link>
          </h3>
        </div>

        <div className="tablet:w-[360px] mt-[16px] tablet:mt-0">
          <p className="text-body text-(--color-text) mb-[12px]">
            {description}
          </p>
          <Link
            href={`/${slug}`}
            data-testid="project-link"
            className="group inline-flex items-center gap-[4px] text-link text-(--color-text-muted) hover:text-(--color-text) transition-colors"
          >
            {ui.linkText}
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {ui.linkArrow}
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

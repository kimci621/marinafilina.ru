'use client';

import { motion } from 'framer-motion';
import type { FooterContent } from '@/types/content';

interface FooterProps {
  content: FooterContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <motion.footer
      id="contacts"
      className="content-container py-[35px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col tablet:flex-row tablet:justify-between">
        <div className="tablet:w-[625px] mb-[30px] tablet:mb-0">
          <span className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-(--color-text)">
            {content.logo}
          </span>
        </div>

        <div className="flex gap-[60px] tablet:w-[616px]">
          <div className="flex flex-col gap-[8px]">
            {content.email && (
              <a href={`mailto:${content.email}`} className="text-body text-(--color-text) hover:opacity-70 transition-opacity">
                {content.email}
              </a>
            )}
            {content.phone && (
              <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="text-body text-(--color-text) hover:opacity-70 transition-opacity">
                {content.phone}
              </a>
            )}
          </div>

          <div>
            <span className="text-nav text-(--color-text) block mb-[20px]">СОЦСЕТИ</span>
            <div className="flex flex-col gap-[10px]">
              {content.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-(--color-text) hover:opacity-70 transition-opacity"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

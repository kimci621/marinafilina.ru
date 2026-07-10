'use client';

import { motion } from 'framer-motion';

interface CTASectionProps {
  text: string;
}

export default function CTASection({ text }: CTASectionProps) {
  return (
    <motion.section
      className="content-container py-[30px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.div
        data-testid="divider-line"
        className="divider origin-center"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: 'easeOut' } },
        }}
      />

      <div className="py-[30px]">
        <a
          href="#contacts"
          className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-(--color-text) hover:opacity-70 transition-opacity"
        >
          {text}
        </a>
      </div>

      <motion.div
        data-testid="divider-line"
        className="divider origin-center"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
        }}
      />
    </motion.section>
  );
}

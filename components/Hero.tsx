'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="content-container flex items-center min-h-[280px] tablet:min-h-[326px] pt-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full"
      >
        <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[24px] text-(--color-text)">
          {title}
        </h1>
        <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop desktop:max-w-[1080px] text-(--color-text)">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}

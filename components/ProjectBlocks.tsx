'use client';

import ResponsiveImage from './ResponsiveImage';
import type { ProjectBlock } from '@/types/content';

interface ProjectBlocksProps {
  blocks: ProjectBlock[];
}

export default function ProjectBlocks({ blocks }: ProjectBlocksProps) {
  if (!blocks.length) return null;

  return (
    <div className="content-container flex flex-col gap-[20px] py-[20px]">
      {blocks.map((block, i) => {
        if (block.type === 'wide') {
          return (
            <div key={i} className="relative w-full" style={{ height: block.height || 600 }}>
              <ResponsiveImage src={block.image} alt={`Image ${i + 1}`} fill sizes="100vw" />
            </div>
          );
        }
        if (block.type === 'split') {
          return (
            <div key={i} className="flex gap-[20px] max-sm:flex-col" style={{ height: block.height || 800 }}>
              <div className="relative w-1/2 max-sm:w-full h-full">
                <ResponsiveImage src={block.imageLeft} alt={`Image ${i + 1}a`} fill sizes="50vw" />
              </div>
              <div className="relative w-1/2 max-sm:w-full h-full">
                <ResponsiveImage src={block.imageRight} alt={`Image ${i + 1}b`} fill sizes="50vw" />
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

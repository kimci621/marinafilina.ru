'use client';

import Image from 'next/image';
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
            <div
              key={i}
              className="relative w-full"
              style={{ height: block.height || 600 }}
            >
              <Image
                src={block.image}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          );
        }

        if (block.type === 'split') {
          return (
            <div
              key={i}
              className="flex gap-[20px]"
              style={{ height: block.height || 800 }}
            >
              <div className="relative w-1/2 h-full">
                <Image
                  src={block.imageLeft}
                  alt={`Image ${i + 1}a`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="relative w-1/2 h-full">
                <Image
                  src={block.imageRight}
                  alt={`Image ${i + 1}b`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

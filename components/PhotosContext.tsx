'use client';

import { createContext, useContext } from 'react';
import type { PhotoEntry } from '@/types/content';

const PhotosContext = createContext<Record<string, PhotoEntry>>({});

export function PhotosProvider({ photos, children }: { photos: Record<string, PhotoEntry>; children: React.ReactNode }) {
  return <PhotosContext.Provider value={photos}>{children}</PhotosContext.Provider>;
}

export function usePhotos() {
  return useContext(PhotosContext);
}

export function getPhotoVariants(dataUrl: string, photos: Record<string, PhotoEntry>) {
  for (const photo of Object.values(photos)) {
    if (photo.data === dataUrl || photo.mobileData === dataUrl) {
      return { src: photo.data, mobileSrc: photo.mobileData || undefined };
    }
  }
  return { src: dataUrl, mobileSrc: undefined };
}

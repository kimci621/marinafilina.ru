'use client';

import { usePhotos, getPhotoVariants } from './PhotosContext';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function ResponsiveImage({ src, alt, className = '', fill, sizes, style }: ResponsiveImageProps) {
  const photos = usePhotos();
  const { src: desktopSrc, mobileSrc } = getPhotoVariants(src, photos);

  const imgClass = fill ? `absolute inset-0 w-full h-full object-cover ${className}` : className;

  if (!mobileSrc) {
    return <img src={desktopSrc} alt={alt} className={imgClass} sizes={sizes} style={style} />;
  }

  return (
    <picture className={fill ? 'absolute inset-0 block' : 'block'}>
      <source media="(max-width: 799px)" srcSet={mobileSrc} />
      <img src={desktopSrc} alt={alt} className={imgClass} sizes={sizes} style={style} />
    </picture>
  );
}

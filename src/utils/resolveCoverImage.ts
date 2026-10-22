import weddingCover from '../assets/images/wedding_shoot_cover_1791184279985.jpg';
import fashionCover from '../assets/images/fashion_studio_cover_1791184291442.jpg';
import portraitCover from '../assets/images/portrait_session_cover_1791184304014.jpg';
import heroBanner from '../assets/images/studio_hero_banner_1791184265566.jpg';

const bundledImages: Record<string, string> = {
  'wedding_shoot_cover_1791184279985.jpg': weddingCover,
  'fashion_studio_cover_1791184291442.jpg': fashionCover,
  'portrait_session_cover_1791184304014.jpg': portraitCover,
  'studio_hero_banner_1791184265566.jpg': heroBanner,
};

export function resolveCoverImage(value: string | undefined | null): string {
  if (!value) return '';

  const cleanPath = value.split(/[?#]/)[0];
  const filename = cleanPath.split('/').pop() || '';
  const bundledImage = bundledImages[filename];

  // Repair legacy /src/assets/... paths while preserving other image URLs.
  if (bundledImage && (
    cleanPath.includes('/src/assets/') ||
    !/^https?:\/\//i.test(cleanPath)
  )) {
    return bundledImage;
  }

  return value;
}

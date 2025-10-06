import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const FullOnCafeLogo = 'https://i.ibb.co/9brc9Bw/full-on-cafe-logo.png';

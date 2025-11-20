export type StoreOffer = {
  id: string;
  product: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  originalPrice: string;
  location: string;
  locations: string[];
  badge?: string;
  startsAt?: string;
  endsAt?: string;
};

export type OfferRail = {
  id: string;
  title: string;
  description: string;
  offers: StoreOffer[];
};

export type OfferImage = {
  src: string;
  alt: string;
};

export type WeeklyOffer = {
  id: string;
  title: string;
  description?: string;
  location: string;
  locations?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageGallery?: OfferImage[];
  price: string;
  originalPrice: string;
  discount: string;
  validUntil: string;
  href: string;
  startsAt?: string;
  endsAt?: string;
};

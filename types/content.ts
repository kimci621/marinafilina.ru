export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
}

export type ImageBlock = {
  type: 'wide';
  image: string;
  height: number;
};

export type SplitBlock = {
  type: 'split';
  imageLeft: string;
  imageRight: string;
  height: number;
};

export type ProjectBlock = ImageBlock | SplitBlock;

export interface ProjectContent {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  blocks: ProjectBlock[];
  category: string;
  client: string;
  task: string;
  concept: string;
  services: string[];
  timeline: string;
  liveUrl: string;
}

export type AboutBlock =
  | { type: 'intro'; title: string; subtitle: string }
  | { type: 'services'; items: { title: string; description: string }[] }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'html'; html: string }
  | { type: 'contact'; phone: string; email: string }
  | { type: 'divider' };

export interface AboutContent {
  photo: string;
  name: string;
  headline: string;
  bio: string;
  services: { title: string; description: string }[];
  experience: string[];
  education: string[];
  blocks: AboutBlock[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface FooterContent {
  logo: string;
  email: string;
  phone: string;
  socials: SocialLink[];
}

export interface SEOContent {
  title: string;
  description: string;
}

export interface UIContent {
  nav: {
    menuOpen: string;
    menuClosed: string;
  };
  projectCard: {
    label: string;
    linkText: string;
    linkArrow: string;
  };
  footer: {
    socialsLabel: string;
  };
  about: {
    experienceLabel: string;
    educationLabel: string;
  };
  project: {
    taskLabel: string;
    conceptLabel: string;
    servicesLabel: string;
    prevProject: string;
    nextProject: string;
  };
  notFound: {
    title: string;
    text: string;
    linkText: string;
  };
}

export interface PhotoEntry {
  id: string;
  url: string;
  filename: string;
  mobileUrl?: string;
  mobileFilename?: string;
}

export interface SiteContent {
  nav: {
    logo: string;
    links: NavLink[];
  };
  home: {
    hero: HeroContent;
    projects: string[];
    cta: string;
  };
  about: AboutContent;
  projects: Record<string, ProjectContent>;
  footer: FooterContent;
  seo: Record<string, SEOContent>;
  ui: UIContent;
  photos: Record<string, PhotoEntry>;
}

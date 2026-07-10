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

export interface ProjectContent {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  category: string;
  client: string;
  task: string;
  concept: string;
  services: string[];
  timeline: string;
  liveUrl: string;
}

export interface AboutContent {
  photo: string;
  name: string;
  headline: string;
  bio: string;
  services: { title: string; description: string }[];
  experience: string[];
  education: string[];
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
}

export interface StaticData {
  faqs: ISubItem[];
  benefits: string[];
  stats?: IStat[];
  features?: IFeature[];
  steps?: IStep[];
  testimonials?: ITestimonial[];
  links?: ILink[];
  navItems?: INavItem[];
  subItems?: ISubItem[];
}
export interface IFaq {
  question: string;
  answer: string;
}

export interface IStat {
  value: string;
  label: string;
  icon: string | React.ReactNode;
}

export interface IFeature {
  title: string;
  description: string;
  image: string;
}

export interface ISubItem {
  id?: number | any;
  label?: string;
  question?: string;
  answer?: string;
}

export interface IStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface ITestimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

export interface ILink {
  label: string;
  href: string;
}

export interface INavItem {
  label: string;
}

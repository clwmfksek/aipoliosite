// ========== 공통 타입 정의 ==========
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type Color = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
export type Priority = 'high' | 'medium' | 'low';

// ========== 기본 UI 컴포넌트 Props ==========

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  target?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  class?: string;
  'aria-label'?: string;
}

/**
 * Card 컴포넌트 Props
 */
export interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: Size;
  hoverable?: boolean;
  clickable?: boolean;
  class?: string;
}

/**
 * Tag 컴포넌트 Props
 */
export interface TagProps {
  variant?: 'filled' | 'outline' | 'ghost';
  color?: Color | string; // 커스텀 색상 허용
  size?: Size;
  removable?: boolean;
  class?: string;
  onRemove?: () => void;
}

/**
 * Image 컴포넌트 Props
 */
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  format?: 'webp' | 'avif' | 'png' | 'jpeg';
  class?: string;
  placeholder?: boolean;
}

/**
 * Link 컴포넌트 Props
 */
export interface LinkProps {
  href: string;
  external?: boolean;
  variant?: 'default' | 'button' | 'underline';
  size?: Size;
  class?: string;
  'aria-label'?: string;
}

/**
 * Badge 컴포넌트 Props
 */
export interface BadgeProps {
  variant?: 'filled' | 'outline' | 'dot';
  color?: Color;
  size?: Size;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  class?: string;
}

// ========== 레이아웃 컴포넌트 Props ==========

/**
 * Header 컴포넌트 Props
 */
export interface HeaderProps {
  fixed?: boolean;
  transparent?: boolean;
  showLogo?: boolean;
  showThemeToggle?: boolean;
  class?: string;
}

/**
 * Footer 컴포넌트 Props
 */
export interface FooterProps {
  showSocial?: boolean;
  showCopyright?: boolean;
  class?: string;
}

/**
 * Sidebar 컴포넌트 Props
 */
export interface SidebarProps {
  position?: 'left' | 'right';
  collapsible?: boolean;
  collapsed?: boolean;
  class?: string;
}

/**
 * Container 컴포넌트 Props
 */
export interface ContainerProps {
  size?: 'narrow' | 'wide' | 'full';
  padding?: Size;
  center?: boolean;
  class?: string;
}

// ========== 콘텐츠 컴포넌트 Props ==========

/**
 * ProjectCard 컴포넌트 Props
 */
export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    tech: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
    date: Date;
  };
  variant?: 'grid' | 'list';
  showImage?: boolean;
  showTech?: boolean;
  showLinks?: boolean;
  class?: string;
}

/**
 * BlogCard 컴포넌트 Props
 */
export interface BlogCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    slug: string;
    image?: string;
    category: string;
    tags: string[];
    date: Date;
    readTime?: number;
  };
  variant?: 'grid' | 'list';
  showImage?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  class?: string;
}

/**
 * SkillItem 컴포넌트 Props
 */
export interface SkillItemProps {
  skill: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    experience: number;
    icon?: string;
    color?: string;
    category: string;
    description?: string;
  };
  variant?: 'card' | 'list' | 'compact';
  showLevel?: boolean;
  showExperience?: boolean;
  showDescription?: boolean;
  class?: string;
}

/**
 * ExperienceItem 컴포넌트 Props
 */
export interface ExperienceItemProps {
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current?: boolean;
    description: string;
    achievements?: string[];
    technologies?: string[];
  };
  variant?: 'timeline' | 'card';
  showAchievements?: boolean;
  showTechnologies?: boolean;
  class?: string;
}

// ========== 특수 컴포넌트 Props ==========

/**
 * ThemeToggle 컴포넌트 Props
 */
export interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'dropdown';
  size?: Size;
  showLabel?: boolean;
  class?: string;
}

/**
 * ContactForm 컴포넌트 Props
 */
export interface ContactFormProps {
  variant?: 'inline' | 'modal' | 'page';
  showSubject?: boolean;
  showPhone?: boolean;
  required?: ('name' | 'email' | 'message' | 'subject' | 'phone')[];
  submitText?: string;
  class?: string;
  onSubmit?: (data: FormData) => void;
}

/**
 * Timeline 컴포넌트 Props
 */
export interface TimelineProps {
  items: Array<{
    id: string;
    date: Date;
    title: string;
    description?: string;
    type?: 'work' | 'education' | 'project' | 'achievement';
    icon?: string;
  }>;
  variant?: 'vertical' | 'horizontal';
  showIcons?: boolean;
  showDates?: boolean;
  class?: string;
}

/**
 * Pagination 컴포넌트 Props
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  class?: string;
}

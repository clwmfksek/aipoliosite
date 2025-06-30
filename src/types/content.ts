import type { CollectionEntry } from 'astro:content';

// ========== Content Collections 타입 ==========
export type ProjectEntry = CollectionEntry<'projects'>;
export type BlogEntry = CollectionEntry<'blog'>;
export type ExperienceEntry = CollectionEntry<'experience'>;
export type SkillEntry = CollectionEntry<'skills'>;

// ========== Content Collections 데이터 타입 추출 ==========
export type ProjectData = ProjectEntry['data'];
export type BlogData = BlogEntry['data'];
export type ExperienceData = ExperienceEntry['data'];
export type SkillData = SkillEntry['data'];

// ========== 컴포넌트용 타입 변환 ==========

/**
 * ProjectCard 컴포넌트용 프로젝트 타입
 * Content Collections의 Project 데이터를 컴포넌트 Props에 맞게 변환
 */
export interface ProjectForCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  date: Date;
  slug: string;
}

/**
 * BlogCard 컴포넌트용 블로그 포스트 타입
 */
export interface BlogPostForCard {
  id: string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  category: string;
  tags: string[];
  date: Date;
  readTime?: number;
}

/**
 * SkillItem 컴포넌트용 스킬 타입
 */
export interface SkillForItem {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience: number;
  icon?: string;
  color?: string;
  category: string;
  description?: string;
}

/**
 * ExperienceItem 컴포넌트용 경력 타입
 */
export interface ExperienceForItem {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  description: string;
  achievements?: string[];
  technologies?: string[];
}

// ========== 타입 변환 헬퍼 함수 ==========

/**
 * Project Entry를 ProjectCard Props로 변환
 */
export function projectEntryToCard(entry: ProjectEntry): ProjectForCard {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    image: entry.data.image,
    tech: entry.data.tech,
    github: entry.data.github,
    demo: entry.data.demo,
    featured: entry.data.featured,
    date: entry.data.date,
    slug: entry.slug,
  };
}

/**
 * Blog Entry를 BlogCard Props로 변환
 */
export function blogEntryToCard(entry: BlogEntry): BlogPostForCard {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    slug: entry.slug,
    image: entry.data.image,
    category: entry.data.category,
    tags: entry.data.tags,
    date: entry.data.date,
    readTime: entry.data.readTime,
  };
}

/**
 * Skill Entry를 SkillItem Props로 변환
 */
export function skillEntryToItem(entry: SkillEntry): SkillForItem {
  return {
    name: entry.data.name,
    level: entry.data.level,
    experience: entry.data.experience,
    icon: entry.data.icon,
    color: entry.data.color,
    category: entry.data.category,
    description: entry.data.description,
  };
}

/**
 * Experience Entry를 ExperienceItem Props로 변환
 */
export function experienceEntryToItem(entry: ExperienceEntry): ExperienceForItem {
  return {
    company: entry.data.company,
    position: entry.data.position,
    location: entry.data.location,
    startDate: entry.data.startDate,
    endDate: entry.data.endDate,
    current: entry.data.current,
    description: entry.data.description,
    achievements: entry.data.achievements,
    technologies: entry.data.technologies,
  };
}

// ========== 유틸리티 타입 ==========

/**
 * 공통 메타데이터 타입
 */
export interface ContentMeta {
  slug: string;
  collection: string;
  featured?: boolean;
  published?: boolean;
  order?: number;
}

/**
 * 페이지네이션 타입
 */
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 필터링 옵션 타입
 */
export interface FilterOptions {
  category?: string;
  tags?: string[];
  featured?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
} 
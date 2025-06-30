import { getCollection, type CollectionEntry } from 'astro:content';
import type {
  ProjectEntry,
  BlogEntry,
  ExperienceEntry,
  SkillEntry,
  ProjectForCard,
  BlogPostForCard,
  SkillForItem,
  ExperienceForItem,
} from '../types/content';
import {
  projectEntryToCard,
  blogEntryToCard,
  skillEntryToItem,
  experienceEntryToItem,
} from '../types/content';

// 타입 정의 (레거시 호환성)
export type Project = ProjectEntry;
export type BlogPost = BlogEntry;
export type Experience = ExperienceEntry;
export type Skill = SkillEntry;

// 프로젝트 관련 유틸리티
export async function getAllProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects
    .filter((project: CollectionEntry<'projects'>) => project.data.published)
    .sort(
      (a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project: Project) => project.data.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getCollection('projects');
  return projects.find((project: CollectionEntry<'projects'>) => project.slug === slug);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project: Project) => project.data.category === category);
}

export async function getProjectsByTech(tech: string): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project: Project) =>
    project.data.tech.some((t: string) => t.toLowerCase().includes(tech.toLowerCase()))
  );
}

// 블로그 포스트 관련 유틸리티
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts
    .filter((post: CollectionEntry<'blog'>) => post.data.published && !post.data.draft)
    .sort(
      (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post: BlogPost) => post.data.featured);
}

export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getCollection('blog');
  return posts.find((post: CollectionEntry<'blog'>) => post.slug === slug);
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post: BlogPost) => post.data.category === category);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post: BlogPost) =>
    post.data.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function getAllBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  const allTags = posts.flatMap((post: BlogPost) => post.data.tags || []);
  return [...new Set(allTags)].sort();
}

export async function getAllBlogCategories(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  const categories = posts.map((post: BlogPost) => post.data.category);
  return [...new Set(categories)].sort();
}

// 경험 관련 유틸리티
export async function getAllExperiences(): Promise<Experience[]> {
  const experiences = await getCollection('experience');
  return experiences.sort((a: CollectionEntry<'experience'>, b: CollectionEntry<'experience'>) => {
    // 현재 직장이 먼저, 그 다음은 시작 날짜 역순
    if (a.data.current && !b.data.current) return -1;
    if (!a.data.current && b.data.current) return 1;
    return new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime();
  });
}

export async function getFeaturedExperiences(): Promise<Experience[]> {
  const experiences = await getAllExperiences();
  return experiences.filter((exp: Experience) => exp.data.featured);
}

export async function getCurrentExperience(): Promise<Experience | undefined> {
  const experiences = await getAllExperiences();
  return experiences.find((exp: Experience) => exp.data.current);
}

// 스킬 관련 유틸리티
export async function getAllSkills(): Promise<Skill[]> {
  const skills = await getCollection('skills');
  return skills.sort((a: CollectionEntry<'skills'>, b: CollectionEntry<'skills'>) => {
    // featured가 먼저, 그 다음은 order, 마지막은 이름
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return a.data.name.localeCompare(b.data.name);
  });
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const skills = await getAllSkills();
  return skills.filter((skill: Skill) => skill.data.category === category);
}

export async function getFeaturedSkills(): Promise<Skill[]> {
  const skills = await getAllSkills();
  return skills.filter((skill: Skill) => skill.data.featured);
}

export async function getSkillCategories(): Promise<string[]> {
  const skills = await getAllSkills();
  const categories = skills.map((skill: Skill) => skill.data.category);
  return [...new Set(categories)].sort();
}

// 페이지네이션 유틸리티
export function paginate<T>(items: T[], page: number, itemsPerPage: number = 10) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    totalItems: items.length,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}

// 검색 유틸리티
export function searchContent<
  T extends { data: { title: string; description?: string; tags?: string[] } },
>(items: T[], query: string): T[] {
  if (!query.trim()) return items;

  const searchTerm = query.toLowerCase().trim();
  return items.filter((item: T) => {
    const { title, description = '', tags = [] } = item.data;
    return (
      title.toLowerCase().includes(searchTerm) ||
      description.toLowerCase().includes(searchTerm) ||
      tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );
  });
}

// 관련 콘텐츠 유틸리티
export function getRelatedProjects(
  currentProject: Project,
  allProjects: Project[],
  limit: number = 3
): Project[] {
  const related = allProjects
    .filter((project: Project) => project.slug !== currentProject.slug)
    .map((project: Project) => {
      let score = 0;

      // 같은 카테고리면 점수 추가
      if (project.data.category === currentProject.data.category) score += 3;

      // 공통 기술 스택으로 점수 추가
      const commonTech = project.data.tech.filter((tech: string) =>
        currentProject.data.tech.includes(tech)
      );
      score += commonTech.length;

      // 공통 태그로 점수 추가
      const commonTags = project.data.tags.filter((tag: string) =>
        currentProject.data.tags.includes(tag)
      );
      score += commonTags.length * 0.5;

      return { project, score };
    })
    .filter((item: { project: Project; score: number }) => item.score > 0)
    .sort(
      (a: { project: Project; score: number }, b: { project: Project; score: number }) =>
        b.score - a.score
    )
    .slice(0, limit)
    .map((item: { project: Project; score: number }) => item.project);

  return related;
}

export function getRelatedBlogPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const related = allPosts
    .filter((post: BlogPost) => post.slug !== currentPost.slug)
    .map((post: BlogPost) => {
      let score = 0;

      // 같은 카테고리면 점수 추가
      if (post.data.category === currentPost.data.category) score += 2;

      // 공통 태그로 점수 추가
      const commonTags = (post.data.tags || []).filter((tag: string) =>
        (currentPost.data.tags || []).includes(tag)
      );
      score += commonTags.length;

      return { post, score };
    })
    .filter((item: { post: BlogPost; score: number }) => item.score > 0)
    .sort(
      (a: { post: BlogPost; score: number }, b: { post: BlogPost; score: number }) =>
        b.score - a.score
    )
    .slice(0, limit)
    .map((item: { post: BlogPost; score: number }) => item.post);

  return related;
}

// ========== 컴포넌트용 변환 함수 ==========

/**
 * 컴포넌트에서 사용할 수 있는 형태로 변환된 프로젝트 데이터 반환
 */
export async function getProjectsForCards(): Promise<ProjectForCard[]> {
  const projects = await getAllProjects();
  return projects.map(projectEntryToCard);
}

export async function getFeaturedProjectsForCards(): Promise<ProjectForCard[]> {
  const projects = await getProjectsForCards();
  return projects.filter(project => project.featured);
}

/**
 * 컴포넌트에서 사용할 수 있는 형태로 변환된 블로그 포스트 데이터 반환
 */
export async function getBlogPostsForCards(): Promise<BlogPostForCard[]> {
  const posts = await getAllBlogPosts();
  return posts.map(blogEntryToCard);
}

export async function getFeaturedBlogPostsForCards(): Promise<BlogPostForCard[]> {
  const posts = await getBlogPostsForCards();
  return posts.filter(post => post.tags.includes('featured'));
}

/**
 * 컴포넌트에서 사용할 수 있는 형태로 변환된 스킬 데이터 반환
 */
export async function getSkillsForItems(): Promise<SkillForItem[]> {
  const skills = await getAllSkills();
  return skills.map(skillEntryToItem);
}

export async function getFeaturedSkillsForItems(): Promise<SkillForItem[]> {
  const skills = await getSkillsForItems();
  return skills.filter(skill => skill.category === 'frontend');
}

/**
 * 컴포넌트에서 사용할 수 있는 형태로 변환된 경력 데이터 반환
 */
export async function getExperienceForItems(): Promise<ExperienceForItem[]> {
  const experiences = await getAllExperiences();
  return experiences.map(experienceEntryToItem);
}

export async function getFeaturedExperienceForItems(): Promise<ExperienceForItem[]> {
  const experiences = await getExperienceForItems();
  return experiences.slice(0, 3); // 최근 3개 경력만
}

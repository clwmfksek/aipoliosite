import { defineCollection, z } from 'astro:content';

// 프로젝트 컬렉션 스키마
const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // 기본 정보
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    
    // 기술 스택
    tech: z.array(z.string()),
    category: z.enum(['web', 'mobile', 'desktop', 'backend', 'fullstack', 'other']).default('web'),
    
    // 이미지 (임시로 문자열로 처리, 나중에 실제 이미지로 교체)
    image: z.string(),
    images: z.array(z.string()).optional(),
    
    // 링크
    github: z.string().url().optional(),
    githubUrl: z.string().url().optional(), // 호환성을 위한 별칭
    demo: z.string().url().optional(),
    demoUrl: z.string().url().optional(), // 호환성을 위한 별칭
    documentation: z.string().url().optional(),
    
    // 프로젝트 상태
    status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
    
    // 메타데이터
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    order: z.number().default(0),
    
    // SEO
    tags: z.array(z.string()).default([]),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
  }),
});

// 블로그 컬렉션 스키마
const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // 기본 정보
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    
    // 메타데이터
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Portfolio Owner'),
    
    // 분류
    category: z.enum(['development', 'design', 'tutorial', 'thoughts', 'news', 'other']).default('development'),
    tags: z.array(z.string()).default([]),
    
    // 이미지 (임시로 문자열로 처리)
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    
    // 상태
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    
    // 읽기 시간 (분)
    readTime: z.number().optional(),
    
    // SEO
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      noIndex: z.boolean().default(false),
    }).optional(),
    
    // 소셜 공유
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      facebook: z.string().optional(),
    }).optional(),
  }),
});

// 팀/경험 컬렉션 스키마 (추가)
const experienceCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    company: z.string(),
    position: z.string(),
    location: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    type: z.enum(['fulltime', 'parttime', 'contract', 'freelance', 'internship']).default('fulltime'),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// 스킬/기술 컬렉션 스키마 (추가)
const skillsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum(['frontend', 'backend', 'mobile', 'database', 'devops', 'design', 'other']),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    experience: z.number(), // 연수
    icon: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
    certifications: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]), // 관련 프로젝트 ID들
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// 컬렉션 내보내기
export const collections = {
  'projects': projectsCollection,
  'blog': blogCollection,
  'experience': experienceCollection,
  'skills': skillsCollection,
}; 
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // projects 컬렉션에서 모든 프로젝트 가져오기
    const projects = await getCollection('projects');

    // 필요한 정보만 추출
    const projectsData = projects.map(project => ({
      slug: project.slug,
      title: project.data.title,
      description: project.data.description,
      tech: project.data.tech,
      demo: project.data.demo,
      github: project.data.github,
      image: project.data.image,
      featured: project.data.featured,
      order: project.data.order,
      status: project.data.status,
      category: project.data.category,
    }));

    return new Response(JSON.stringify(projectsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Projects API error:', error);
    return new Response(JSON.stringify({ error: '프로젝트를 불러오는데 실패했습니다.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { title, description, tech, demo, github, image, category, status } = data;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Create markdown content
    const frontmatter = `---
title: '${title}'
description: '${description}'
longDescription: '${description}'
tech: [${tech.map((t: string) => `'${t}'`).join(', ')}]
category: '${category}'
image: '${image || '/placeholder-project.jpg'}'
demo: '${demo || ''}'
github: '${github || ''}'
status: '${status || 'planned'}'
date: ${new Date().toISOString().split('T')[0]}
featured: false
published: true
order: 999
tags: [${tech.map((t: string) => `'${t.toLowerCase()}'`).join(', ')}]
---

# ${title}

${description}

## 프로젝트 개요

이 프로젝트에 대한 자세한 설명을 작성해주세요.

## 주요 기능

- 기능 1
- 기능 2
- 기능 3

## 기술 스택

${tech.map((t: string) => `- ${t}`).join('\n')}

## 링크

${demo ? `- [라이브 데모](${demo})` : ''}
${github ? `- [GitHub 저장소](${github})` : ''}
`;

    const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');
    const filePath = path.join(projectsDir, `${slug}.md`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '같은 이름의 프로젝트가 이미 존재합니다.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Write file
    fs.writeFileSync(filePath, frontmatter);

    return new Response(
      JSON.stringify({
        success: true,
        message: '프로젝트가 성공적으로 생성되었습니다.',
        slug,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Project creation error:', error);
    return new Response(
      JSON.stringify({
        error: '프로젝트 생성 중 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { slug, title, description, tech, demo, github, image, category, status } = data;

    const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');
    const filePath = path.join(projectsDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '프로젝트를 찾을 수 없습니다.',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Read existing file to preserve content
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    const contentMatch = existingContent.split('---');
    const bodyContent =
      contentMatch.length > 2
        ? contentMatch.slice(2).join('---')
        : `

# ${title}

${description}

## 프로젝트 개요

이 프로젝트에 대한 자세한 설명을 작성해주세요.
`;

    // Update frontmatter
    const frontmatter = `---
title: '${title}'
description: '${description}'
longDescription: '${description}'
tech: [${tech.map((t: string) => `'${t}'`).join(', ')}]
category: '${category}'
image: '${image || '/placeholder-project.jpg'}'
demo: '${demo || ''}'
github: '${github || ''}'
status: '${status || 'planned'}'
date: ${new Date().toISOString().split('T')[0]}
featured: false
published: true
order: 999
tags: [${tech.map((t: string) => `'${t.toLowerCase()}'`).join(', ')}]
---${bodyContent}`;

    fs.writeFileSync(filePath, frontmatter);

    return new Response(
      JSON.stringify({
        success: true,
        message: '프로젝트가 성공적으로 업데이트되었습니다.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Project update error:', error);
    return new Response(
      JSON.stringify({
        error: '프로젝트 업데이트 중 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();

    const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');
    const filePath = path.join(projectsDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '프로젝트를 찾을 수 없습니다.',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    fs.unlinkSync(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        message: '프로젝트가 성공적으로 삭제되었습니다.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Project deletion error:', error);
    return new Response(
      JSON.stringify({
        error: '프로젝트 삭제 중 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

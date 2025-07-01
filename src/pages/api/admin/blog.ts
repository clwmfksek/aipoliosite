import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // blog 컬렉션에서 모든 블로그 글 가져오기
    const blogPosts = await getCollection('blog');

    // 필요한 정보만 추출하고 최신순으로 정렬
    const blogData = blogPosts
      .map(post => ({
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        date: post.data.date,
        author: post.data.author,
        tags: post.data.tags,
        featured: post.data.featured,
        published: post.data.published,
        category: post.data.category,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify(blogData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Blog API error:', error);
    return new Response(JSON.stringify({ error: '블로그 글을 불러오는데 실패했습니다.' }), {
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
    const { title, description, content, tags, author, published } = data;

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
author: '${author || '김개발'}'
pubDate: ${new Date().toISOString()}
tags: [${tags.map((t: string) => `'${t}'`).join(', ')}]
image: '/placeholder-blog.jpg'
draft: ${!published}
featured: false
category: 'general'
readingTime: '5분'
---

${
  content ||
  `# ${title}

${description}

블로그 내용을 작성해주세요.`
}
`;

    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    const filePath = path.join(blogDir, `${slug}.md`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '같은 제목의 블로그 글이 이미 존재합니다.',
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
        message: '블로그 글이 성공적으로 생성되었습니다.',
        slug,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Blog creation error:', error);
    return new Response(
      JSON.stringify({
        error: '블로그 글 생성 중 오류가 발생했습니다.',
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
    const { slug, title, description, content, tags, author, published } = data;

    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    const filePath = path.join(blogDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '블로그 글을 찾을 수 없습니다.',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Read existing file content if provided, or use new content
    const markdownContent =
      content ||
      `# ${title}

${description}

블로그 내용을 작성해주세요.`;

    // Update frontmatter
    const frontmatter = `---
title: '${title}'
description: '${description}'
author: '${author || '김개발'}'
pubDate: ${new Date().toISOString()}
tags: [${tags.map((t: string) => `'${t}'`).join(', ')}]
image: '/placeholder-blog.jpg'
draft: ${!published}
featured: false
category: 'general'
readingTime: '5분'
---

${markdownContent}`;

    fs.writeFileSync(filePath, frontmatter);

    return new Response(
      JSON.stringify({
        success: true,
        message: '블로그 글이 성공적으로 업데이트되었습니다.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Blog update error:', error);
    return new Response(
      JSON.stringify({
        error: '블로그 글 업데이트 중 오류가 발생했습니다.',
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

    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    const filePath = path.join(blogDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          error: '블로그 글을 찾을 수 없습니다.',
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
        message: '블로그 글이 성공적으로 삭제되었습니다.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Blog deletion error:', error);
    return new Response(
      JSON.stringify({
        error: '블로그 글 삭제 중 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

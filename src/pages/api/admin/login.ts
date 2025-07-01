import type { APIRoute } from 'astro';

export const prerender = false;

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'admin123';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ error: '비밀번호가 올바르지 않습니다' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

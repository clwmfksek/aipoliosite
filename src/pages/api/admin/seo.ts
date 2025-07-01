import type { APIRoute } from 'astro';
import { updateSEOInfo } from '../../../utils/portfolio-data';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const seoData = await request.json();

    // SEO 정보 업데이트
    updateSEOInfo(seoData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'SEO 정보가 성공적으로 업데이트되었습니다',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('SEO 정보 업데이트 오류:', error);

    return new Response(
      JSON.stringify({
        error: 'SEO 정보 업데이트 중 오류가 발생했습니다',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

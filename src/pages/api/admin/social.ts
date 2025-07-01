import type { APIRoute } from 'astro';
import { updateSocialLinks } from '../../../utils/portfolio-data';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const socialData = await request.json();

    // 소셜 링크 업데이트
    updateSocialLinks(socialData);

    return new Response(
      JSON.stringify({
        success: true,
        message: '소셜 링크가 성공적으로 업데이트되었습니다',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('소셜 링크 업데이트 오류:', error);

    return new Response(
      JSON.stringify({
        error: '소셜 링크 업데이트 중 오류가 발생했습니다',
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

import type { APIRoute } from 'astro';
import { updatePersonalInfo } from '../../../utils/portfolio-data';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const personalData = await request.json();

    // 개인 정보 업데이트
    updatePersonalInfo(personalData);

    return new Response(
      JSON.stringify({
        success: true,
        message: '개인 정보가 성공적으로 업데이트되었습니다',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('개인 정보 업데이트 오류:', error);

    return new Response(
      JSON.stringify({
        error: '개인 정보 업데이트 중 오류가 발생했습니다',
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

import type { APIRoute } from 'astro';
import { getPortfolioData } from '../../../utils/portfolio-data';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = getPortfolioData();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('데이터 로드 오류:', error);

    return new Response(
      JSON.stringify({
        error: '포트폴리오 데이터를 불러올 수 없습니다',
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

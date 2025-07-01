// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import compressor from 'astro-compressor';
import vercel from '@astrojs/vercel';

// Vercel 환경에서는 자체 압축 사용 (빌드 시간 단축)
const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.example.com', // 배포 시 실제 도메인으로 변경
  integrations: [
    tailwind({
      // Tailwind CSS 설정 파일 사용
      configFile: './tailwind.config.mjs',
    }),
    sitemap({
      // 간소화된 사이트맵 설정 (빌드 시간 최적화)
      filter: page => !page.includes('/components-test'),
    }),
    mdx(),
    // Vercel이 아닌 환경에서만 압축 사용 (빌드 시간 최적화)
    ...(isVercel
      ? []
      : [
          compressor({
            gzip: true,
            brotli: true,
          }),
        ]),
  ].filter(Boolean),
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  build: {
    // CSS를 별도 파일로 분리 (배포 문제 해결)
    inlineStylesheets: 'never',
    // 미사용 CSS 제거
    assets: '_astro',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
  vite: {
    build: {
      // 빌드 최적화
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          // 에셋 파일명 최적화
          assetFileNames: assetInfo => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
            let extType = assetInfo.name.split('.').at(1);
            if (extType && /png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType || 'misc'}/[name]-[hash][extname]`;
          },
          // 청크 분할 최적화
          manualChunks: id => {
            // 벤더 라이브러리 분리
            if (id.includes('node_modules')) {
              if (id.includes('astro')) {
                return 'astro-vendor';
              }
              if (id.includes('tailwind') || id.includes('css')) {
                return 'styles-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
      // 청크 크기 경고 임계값 증가
      chunkSizeWarningLimit: 600,
      // terser 설정 (프로덕션에서만 console 제거)
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: true,
        },
      },
    },
    // 개발 서버 최적화
    server: {
      fs: {
        strict: false,
      },
    },
    // CSS 최적화
    css: {
      devSourcemap: true,
    },
  },
});

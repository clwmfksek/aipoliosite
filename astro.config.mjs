// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.example.com', // 배포 시 실제 도메인으로 변경
  integrations: [
    tailwind({
      // Tailwind CSS 설정 파일 사용
      configFile: './tailwind.config.mjs',
    }),
    sitemap({
      // SEO 최적화를 위한 사이트맵 설정
      customPages: [
        'https://portfolio.example.com/', // 홈페이지 (최고 우선순위)
        'https://portfolio.example.com/about/',
        'https://portfolio.example.com/projects/',
        'https://portfolio.example.com/contact/',
        'https://portfolio.example.com/blog/',
      ],
      filter: page => {
        // components-test 페이지는 사이트맵에서 제외
        return !page.includes('/components-test');
      },
      serialize: item => {
        // 페이지별 우선순위 설정
        let priority = 0.5;

        if (item.url === 'https://portfolio.example.com/') {
          priority = 1.0;
        } else if (item.url.includes('/about/') || item.url.includes('/projects/')) {
          priority = 0.8;
        } else if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          priority = 0.7;
        } else if (item.url.includes('/blog/')) {
          priority = 0.9;
        } else if (item.url.includes('/contact/')) {
          priority = 0.6;
        }

        return {
          ...item,
          priority,
        };
      },
    }),
    mdx(),
    // 압축 최적화 (프로덕션 빌드시에만)
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  output: 'static',
  build: {
    // 인라인 CSS 최적화
    inlineStylesheets: 'auto',
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
      // terser 설정 (더 나은 압축)
      terserOptions: {
        compress: {
          drop_console: true,
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

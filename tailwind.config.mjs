/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    // 성능 최적화: 더 세밀한 검색 패턴
    extract: {
      astro: content => {
        // Astro 파일에서 클래스명을 더 정확하게 추출
        return content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      },
    },
  },
  darkMode: 'class',
  // JIT 모드로 성능 최적화
  mode: 'jit',
  // 중요: 사용하지 않는 스타일 제거
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  // 실험적 기능으로 성능 향상
  experimental: {
    optimizeUniversalDefaults: true,
  },
  theme: {
    extend: {
      colors: {
        // 포트폴리오 브랜드 색상
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      // 성능 최적화를 위한 커스텀 유틸리티
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    // 성능 최적화를 위한 커스텀 플러그인
    function ({ addUtilities }) {
      const newUtilities = {
        '.will-change-auto': {
          'will-change': 'auto',
        },
        '.will-change-scroll': {
          'will-change': 'scroll-position',
        },
        '.will-change-contents': {
          'will-change': 'contents',
        },
        '.gpu-accelerate': {
          transform: 'translateZ(0)',
          'backface-visibility': 'hidden',
          perspective: '1000px',
        },
        '.smooth-rendering': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          'text-rendering': 'optimizeLegibility',
        },
      };
      addUtilities(newUtilities);
    },
    // 타이포그래피 플러그인 (선택사항)
    // require('@tailwindcss/typography'),
  ],
  // 최적화 설정
  corePlugins: {
    // 사용하지 않는 핵심 플러그인 비활성화로 번들 크기 줄이기
    // container: false, // 컨테이너를 사용하지 않는다면 비활성화
  },
};

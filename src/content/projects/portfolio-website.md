---
title: '포트폴리오 웹사이트'
description: 'Astro와 Tailwind CSS로 제작한 개인 포트폴리오 사이트'
longDescription: 'Astro와 Tailwind CSS로 제작한 개인 포트폴리오 사이트'
tech: ['Astro', 'TypeScript', 'Tailwind CSS', 'MDX', 'Vercel']
category: 'web'
image: '/placeholder-project.jpg'
demo: 'https://aipoliosite.vercel.app/'
github: 'https://github.com/clwmfksek/aipoliosite'
status: 'completed'
date: 2025-06-30
featured: false
published: true
order: 999
tags: ['astro', 'typescript', 'tailwind css', 'mdx', 'vercel']
---

# 포트폴리오 웹사이트

## 프로젝트 개요

이 포트폴리오 웹사이트는 **Astro 4.0**과 **Tailwind CSS**를 사용하여 제작된 정적 사이트입니다. 콘텐츠 중심의 설계와 뛰어난 성능에 중점을 두고 개발했습니다.

## 주요 기능

### ⚡ 성능 최적화

- **제로 자바스크립트 번들** - 기본적으로 순수 HTML/CSS 출력
- **이미지 최적화** - 자동 WebP 변환 및 lazy loading
- **Lighthouse 100점** - 완벽한 성능 점수 달성

### 🎨 디자인 시스템

- **커스텀 색상 팔레트** - 브랜드 아이덴티티에 맞는 색상 시스템
- **다크/라이트 모드** - 사용자 선호도에 따른 테마 전환
- **반응형 디자인** - 모든 디바이스에서 최적화된 경험

### 📝 콘텐츠 관리

- **Content Collections** - TypeScript 기반 콘텐츠 스키마
- **MDX 지원** - 확장된 마크다운으로 풍부한 콘텐츠 작성
- **SEO 최적화** - 메타 태그, 사이트맵, 구조화된 데이터

## 기술적 도전과 해결

### 1. 성능 최적화

Astro의 Island Architecture를 활용하여 필요한 부분에만 JavaScript를 로드하도록 구현했습니다.

```astro
---
// 정적 컴포넌트는 서버에서만 렌더링
---

<StaticComponent />

<!-- 동적 기능이 필요한 부분만 클라이언트에서 로드 -->
<InteractiveComponent client:load />
```

### 2. 타입 안전성 확보

Content Collections와 TypeScript를 결합하여 완전한 타입 안전성을 확보했습니다.

```typescript
import { getCollection } from 'astro:content';

// 타입 안전한 콘텐츠 조회
const projects = await getCollection('projects', ({ data }) => {
  return data.published === true;
});
```

### 3. 자동화된 배포

GitHub Actions와 Vercel을 연동하여 푸시 시 자동 배포되는 CI/CD 파이프라인을 구축했습니다.

## 성과 및 결과

- **📈 성능**: Lighthouse 100점 (성능, 접근성, 베스트 프랙티스, SEO)
- **⚡ 로딩 속도**: First Contentful Paint 0.8초 미만
- **📱 호환성**: 모든 주요 브라우저 및 디바이스 지원
- **♿ 접근성**: WCAG 2.1 AA 수준 준수

## 향후 개선 계획

1. **다국어 지원** - i18n 라우팅 구현
2. **검색 기능** - Fuse.js 기반 클라이언트 사이드 검색
3. **댓글 시스템** - Giscus 통합
4. **분석 도구** - Google Analytics 4 연동

---

이 프로젝트를 통해 현대적인 웹 개발 기술을 종합적으로 활용하는 경험을 쌓을 수 있었습니다.

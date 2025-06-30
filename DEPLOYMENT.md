# Deployment Guide

이 문서는 Astro 포트폴리오 사이트의 배포 방법을 설명합니다.

## 🚀 지원하는 배포 플랫폼

### 1. Vercel (권장 - 프로덕션)

- **장점**:
  - Edge Functions 지원 (10ms 콜드 스타트)
  - 자동 Astro 감지 및 최적화
  - 30+ 글로벌 엣지 로케이션
  - 우수한 이미지 최적화
- **설정**: `vercel.json` 파일 사용

### 2. Netlify (스테이징)

- **장점**:
  - 관대한 무료 티어 (100GB 대역폭)
  - 네이티브 폼 처리
  - DPR (Distributed Persistent Rendering)
  - 뛰어난 플러그인 에코시스템
- **설정**: `netlify.toml` 파일 사용

## 📋 배포 전 체크리스트

### 환경 변수 설정

다음 환경 변수들을 배포 플랫폼에 설정하세요:

```bash
# 필수 변수
NODE_ENV=production
ASTRO_TELEMETRY_DISABLED=1

# 사이트 정보
SITE_URL=https://yourdomain.com
SITE_TITLE="Your Portfolio Name"

# 소셜 미디어 링크
SOCIAL_GITHUB=https://github.com/yourusername
SOCIAL_LINKEDIN=https://linkedin.com/in/yourusername
SOCIAL_EMAIL=contact@yourdomain.com

# 선택적 변수
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GITHUB_USERNAME=yourusername
```

### 빌드 설정

```json
{
  "buildCommand": "npm run build:production",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "nodeVersion": "20.x"
}
```

## 🔧 Vercel 배포 설정

### 1. Vercel CLI를 통한 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 설정
vercel

# 배포
vercel --prod
```

### 2. GitHub 연동 배포

1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정 확인:
   - Framework Preset: `Astro`
   - Build Command: `npm run build:production`
   - Output Directory: `dist`
   - Install Command: `npm ci`

### 3. 환경 변수 설정

Vercel 대시보드 > Settings > Environment Variables에서 설정

### 4. 도메인 설정

Settings > Domains에서 커스텀 도메인 추가

## 🌐 Netlify 배포 설정

### 1. Netlify CLI를 통한 배포

```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 로그인
netlify login

# 사이트 생성 및 배포
netlify init
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

### 2. GitHub 연동 배포

1. Netlify 대시보드에서 "New site from Git" 클릭
2. GitHub 저장소 선택
3. 빌드 설정 확인:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### 3. 환경 변수 설정

Site Settings > Environment Variables에서 설정

## 🔄 CI/CD 파이프라인

### GitHub Actions 워크플로우

프로젝트에는 `.github/workflows/deploy.yml` 파일이 포함되어 있습니다:

#### 워크플로우 특징:

- **다중 Node.js 버전 테스트** (18.x, 20.x)
- **품질 검사**: ESLint, TypeScript, Prettier
- **성능 테스트**: Lighthouse CI
- **보안 감사**: npm audit, audit-ci
- **자동 배포**: main 브랜치 푸시 시
- **번들 분석**: 주간 또는 수동 트리거

#### 필요한 GitHub Secrets:

**Vercel 배포용:**

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

**Netlify 배포용:**

```
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id
```

## 📊 성능 모니터링

### Lighthouse CI

- PR마다 자동 성능 테스트
- 성능 점수 90+ 유지
- 접근성 점수 95+ 유지
- SEO 점수 95+ 유지

### 번들 분석

```bash
# 번들 크기 분석
npm run build:analyze

# 커밋 메시지에 [analyze] 포함 시 자동 실행
git commit -m "Update component [analyze]"
```

## 🔒 보안 설정

### Content Security Policy (CSP)

두 플랫폼 모두 강화된 CSP 헤더가 설정되어 있습니다:

- `default-src 'self'`
- `script-src` 제한적 허용
- `img-src` HTTPS 및 data: URI 허용
- `frame-ancestors 'none'`

### HTTP 보안 헤더

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Referrer-Policy`

## 🚀 배포 최적화

### 캐싱 전략

- **정적 에셋**: 1년 캐시 (`max-age=31536000`)
- **HTML 파일**: 즉시 재검증 (`max-age=0`)
- **Service Worker**: 캐시 비활성화
- **Manifest**: 하루 캐시 (`max-age=86400`)

### 압축 설정

- **Brotli 압축**: 85-90% 압축률
- **Gzip 압축**: 대체 압축 지원
- **자동 압축**: 빌드 시 적용

## 🎯 성능 메트릭 목표

| 메트릭                   | 목표    | 임계값  |
| ------------------------ | ------- | ------- |
| Lighthouse Performance   | 90+     | 85+     |
| Lighthouse Accessibility | 95+     | 90+     |
| First Contentful Paint   | < 2초   | < 2.5초 |
| Largest Contentful Paint | < 2.5초 | < 3초   |
| Cumulative Layout Shift  | < 0.1   | < 0.25  |
| Total Blocking Time      | < 300ms | < 500ms |

## 🔧 트러블슈팅

### 일반적인 문제들

#### 1. 빌드 실패

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 타입 검사
npm run type-check

# 린팅 수정
npm run lint:fix
```

#### 2. 환경 변수 문제

- 배포 플랫폼에서 환경 변수 확인
- 대소문자 정확히 입력
- 따옴표 없이 값 입력

#### 3. 성능 문제

```bash
# 번들 분석 실행
npm run build:analyze

# Lighthouse 로컬 테스트
npx lighthouse http://localhost:4321 --view
```

#### 4. Service Worker 문제

- 브라우저 캐시 완전 삭제
- 개발자 도구에서 "Bypass for network" 체크
- Application 탭에서 Storage 완전 삭제

## 📞 지원

배포 과정에서 문제가 발생하면:

1. GitHub Issues에 문제 보고
2. Vercel/Netlify 공식 문서 확인
3. 프로젝트 Wiki 참조

---

**마지막 업데이트**: 2024년 6월

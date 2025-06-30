# 🏗️ 컴포넌트 아키텍처

이 문서는 Astro 포트폴리오 프로젝트의 컴포넌트 구조와 아키텍처를 설명합니다.

## 📁 디렉토리 구조

```
src/components/
├── ui/                     # 기본 UI 컴포넌트
│   ├── Button.astro       # ✅ 구현됨
│   ├── Card.astro         # ✅ 구현됨
│   ├── Tag.astro          # ✅ 구현됨
│   ├── Badge.astro        # ✅ 구현됨
│   ├── Link.astro         # ✅ 구현됨
│   └── Image.astro        # ✅ 구현됨
├── layout/                # 레이아웃 컴포넌트
│   ├── Header.astro       # 🔄 예정
│   ├── Footer.astro       # 🔄 예정
│   ├── Sidebar.astro      # 🔄 예정
│   └── Container.astro    # 🔄 예정
├── content/               # 콘텐츠 컴포넌트
│   ├── ProjectCard.astro  # 🔄 예정
│   ├── BlogCard.astro     # 🔄 예정
│   ├── SkillItem.astro    # 🔄 예정
│   └── ExperienceItem.astro # 🔄 예정
└── features/              # 특수 기능 컴포넌트
    ├── ThemeToggle.astro  # ✅ 구현됨
    ├── ContactForm.astro  # 🔄 예정
    ├── Timeline.astro     # 🔄 예정
    └── Pagination.astro   # 🔄 예정
```

## 🎯 설계 원칙

### 1. 원자적 설계 (Atomic Design)

- **UI 컴포넌트**: 재사용 가능한 기본 요소
- **Layout 컴포넌트**: 페이지 구조를 위한 컨테이너
- **Content 컴포넌트**: 특정 콘텐츠 타입을 위한 복합 컴포넌트
- **Feature 컴포넌트**: 특수 기능을 제공하는 고수준 컴포넌트

### 2. 타입 안전성

- 모든 컴포넌트는 TypeScript로 작성
- Props는 `src/types/components.ts`에 중앙 집중식 관리
- Content Collections와의 타입 매핑 제공

### 3. 일관성 있는 인터페이스

- 공통 Props: `size`, `variant`, `color`, `class`
- 표준화된 명명 규칙
- 일관된 기본값 설정

## 📝 구현된 컴포넌트

### UI 컴포넌트 (6/6 완료)

#### Button.astro

- **용도**: 기본 버튼과 링크 버튼
- **변형**: primary, secondary, outline, ghost
- **크기**: sm, md, lg
- **특징**: 로딩 상태, 비활성화, 전체 너비, 외부 링크 지원

#### Card.astro

- **용도**: 콘텐츠 컨테이너
- **변형**: default, bordered, elevated
- **패딩**: sm, md, lg
- **특징**: 호버 효과, 클릭 가능 상태

#### Tag.astro

- **용도**: 기술 스택, 카테고리 표시
- **변형**: filled, outline, ghost
- **색상**: primary, secondary, accent, success, warning, danger
- **특징**: 제거 가능, 커스텀 이벤트

#### Badge.astro

- **용도**: 상태, 알림 표시
- **변형**: filled, outline, soft
- **색상**: primary, secondary, accent, success, warning, danger, info
- **특징**: 점 형태, 펄스 애니메이션

#### Link.astro

- **용도**: 텍스트 링크
- **변형**: default, secondary, accent, muted
- **크기**: sm, md, lg
- **특징**: 외부 링크 자동 감지, 밑줄 옵션

#### Image.astro

- **용도**: 최적화된 이미지 표시
- **특징**: Lazy loading, 다양한 종횡비, 객체 맞춤, 둥근 모서리

### Feature 컴포넌트 (1/4 완료)

#### ThemeToggle.astro ✅

- **용도**: 다크/라이트 모드 전환
- **크기**: sm, md, lg
- **특징**: localStorage 지원, 시스템 선호도 감지, 커스텀 이벤트

## 🔮 예정된 컴포넌트

### Layout 컴포넌트 (0/4)

- **Header.astro**: 네비게이션 바
- **Footer.astro**: 페이지 하단
- **Sidebar.astro**: 사이드바 네비게이션
- **Container.astro**: 반응형 컨테이너

### Content 컴포넌트 (0/4)

- **ProjectCard.astro**: 프로젝트 표시 카드
- **BlogCard.astro**: 블로그 포스트 카드
- **SkillItem.astro**: 기술 스킬 아이템
- **ExperienceItem.astro**: 경험/경력 아이템

### Feature 컴포넌트 (1/4)

- **ContactForm.astro**: 연락처 폼
- **Timeline.astro**: 시간순 이벤트 표시
- **Pagination.astro**: 페이지네이션

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* 기본 색상 */
primary: blue (600/700)
secondary: gray (500/600)
accent: purple (600/700)

/* 의미적 색상 */
success: green (500/600)
warning: yellow (500/600)
danger: red (500/600)
info: cyan (500/600)
```

### 크기 시스템

```css
/* 텍스트 크기 */
sm: text-sm (14px)
md: text-base (16px)
lg: text-lg (18px)

/* 패딩/여백 */
sm: 0.75rem (12px)
md: 1rem (16px)
lg: 1.5rem (24px)
```

### 애니메이션

```css
/* 전환 효과 */
transition-all duration-200

/* 호버 효과 */
hover:scale-[1.02]
hover:shadow-lg
hover:-translate-y-1
```

## 📊 타입 시스템

### 공통 타입

```typescript
type Size = 'sm' | 'md' | 'lg';
type Color = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
type Variant = 'default' | 'filled' | 'outline' | 'ghost';
```

### 컴포넌트별 Props

- 모든 Props는 `src/types/components.ts`에 정의
- Content Collections 타입과 매핑
- 선택적 속성에 기본값 제공

## 🚀 성능 최적화

### Astro 최적화

- **Static Generation**: 가능한 한 정적 생성
- **Partial Hydration**: 필요한 컴포넌트만 JavaScript 실행
- **Component Islands**: 독립적인 상호작용 영역

### CSS 최적화

- **Tailwind Purge**: 사용하지 않는 스타일 제거
- **Critical CSS**: 주요 스타일 인라인
- **Lazy Loading**: 지연 로딩 지원

## 📋 사용 가이드

자세한 사용법은 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)를 참조하세요.

### 빠른 시작

```astro
---
import Button from './components/ui/Button.astro';
import Card from './components/ui/Card.astro';
import Tag from './components/ui/Tag.astro';
---

<Card variant="bordered" hoverable>
  <h3>프로젝트 제목</h3>
  <div class="flex gap-2 mb-4">
    <Tag color="primary">React</Tag>
    <Tag color="success">TypeScript</Tag>
  </div>
  <Button href="/projects/1" variant="outline"> 자세히 보기 </Button>
</Card>
```

## 🧪 테스트

컴포넌트 테스트는 `/components-test` 페이지에서 확인할 수 있습니다:

- 모든 구현된 컴포넌트의 라이브 데모
- 다양한 Props 조합 테스트
- 인터랙션 기능 검증

---

**다음 구현 단계**: Layout 컴포넌트 → Content 컴포넌트 → Feature 컴포넌트

# 🎨 UI 컴포넌트 가이드

이 문서는 Astro 포트폴리오 프로젝트의 모든 UI 컴포넌트 사용법을 설명합니다.

## 📋 목차
- [기본 사용법](#기본-사용법)
- [UI 컴포넌트](#ui-컴포넌트)
  - [Button](#button)
  - [Card](#card)
  - [Tag](#tag)
  - [Badge](#badge)
  - [Link](#link)
  - [Image](#image)
- [Feature 컴포넌트](#feature-컴포넌트)
  - [ThemeToggle](#themetoggle)
- [타입 시스템](#타입-시스템)
- [베스트 프랙티스](#베스트-프랙티스)

## 기본 사용법

모든 컴포넌트는 TypeScript로 작성되었으며 완전한 타입 안전성을 제공합니다.

```astro
---
import Button from '../components/ui/Button.astro';
import Card from '../components/ui/Card.astro';
---

<Card>
  <Button>클릭하세요</Button>
</Card>
```

## UI 컴포넌트

### Button

다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다.

#### Props
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'` (기본값: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `href`: `string` - 링크 버튼으로 사용 시
- `external`: `boolean` - 외부 링크 여부 (기본값: `false`)
- `disabled`: `boolean` - 비활성화 상태 (기본값: `false`)
- `loading`: `boolean` - 로딩 상태 (기본값: `false`)
- `fullWidth`: `boolean` - 전체 너비 (기본값: `false`)

#### 사용 예시

```astro
<!-- 기본 버튼 -->
<Button>기본 버튼</Button>

<!-- 다양한 변형 -->
<Button variant="secondary">보조 버튼</Button>
<Button variant="outline">외곽선 버튼</Button>
<Button variant="ghost">고스트 버튼</Button>

<!-- 크기 변형 -->
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>

<!-- 상태 -->
<Button disabled>비활성화</Button>
<Button loading>로딩 중</Button>
<Button fullWidth>전체 너비</Button>

<!-- 링크 버튼 -->
<Button href="/about">내부 링크</Button>
<Button href="https://example.com" external>외부 링크</Button>
```

### Card

콘텐츠를 감싸는 카드 컨테이너 컴포넌트입니다.

#### Props
- `variant`: `'default' | 'bordered' | 'elevated'` (기본값: `'default'`)
- `padding`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `hoverable`: `boolean` - 호버 효과 (기본값: `false`)
- `clickable`: `boolean` - 클릭 가능 (기본값: `false`)

#### 사용 예시

```astro
<!-- 기본 카드 -->
<Card>
  <h3>제목</h3>
  <p>내용</p>
</Card>

<!-- 테두리와 호버 효과 -->
<Card variant="bordered" hoverable>
  <h3>호버해보세요</h3>
</Card>

<!-- 그림자와 클릭 가능 -->
<Card variant="elevated" clickable>
  <h3>클릭 가능한 카드</h3>
</Card>
```

### Tag

기술 스택이나 카테고리를 표시하는 태그 컴포넌트입니다.

#### Props
- `variant`: `'filled' | 'outline' | 'ghost'` (기본값: `'filled'`)
- `color`: `'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'` (기본값: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `removable`: `boolean` - 제거 가능 여부 (기본값: `false`)

#### 사용 예시

```astro
<!-- 기본 태그 -->
<Tag>React</Tag>
<Tag color="success">TypeScript</Tag>

<!-- 제거 가능한 태그 -->
<Tag removable>JavaScript</Tag>
<Tag removable color="warning">Vue.js</Tag>

<!-- 다양한 변형 -->
<Tag variant="outline" color="accent">Astro</Tag>
<Tag variant="ghost" color="secondary">Tailwind</Tag>
```

#### 이벤트
태그가 제거되면 `tag-removed` 커스텀 이벤트가 발생합니다:

```javascript
document.addEventListener('tag-removed', (e) => {
  console.log('제거된 태그:', e.detail.text);
});
```

### Badge

상태나 알림을 표시하는 배지 컴포넌트입니다.

#### Props
- `variant`: `'filled' | 'outline' | 'soft'` (기본값: `'filled'`)
- `color`: `'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'` (기본값: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `dot`: `boolean` - 점 형태 (기본값: `false`)
- `pulse`: `boolean` - 펄스 애니메이션 (기본값: `false`)

#### 사용 예시

```astro
<!-- 기본 배지 -->
<Badge>새로운</Badge>
<Badge color="success">온라인</Badge>

<!-- 점 형태 배지 -->
<Badge dot color="success">활성</Badge>
<Badge dot color="danger" pulse>오프라인</Badge>

<!-- 다양한 변형 -->
<Badge variant="outline" color="warning">경고</Badge>
<Badge variant="soft" color="info">정보</Badge>
```

### Link

다양한 스타일을 지원하는 링크 컴포넌트입니다.

#### Props
- `href`: `string` - 링크 주소 (필수)
- `variant`: `'default' | 'secondary' | 'accent' | 'muted'` (기본값: `'default'`)
- `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `external`: `boolean` - 외부 링크 여부 (자동 감지)
- `underline`: `'always' | 'hover' | 'never'` (기본값: `'hover'`)

#### 사용 예시

```astro
<!-- 기본 링크 -->
<Link href="/">홈으로</Link>
<Link href="/about" variant="secondary">소개 페이지</Link>

<!-- 외부 링크 -->
<Link href="https://astro.build" external>Astro 공식 사이트</Link>

<!-- 밑줄 옵션 -->
<Link href="/" underline="always">항상 밑줄</Link>
<Link href="/" underline="never">밑줄 없음</Link>
```

### Image

최적화와 lazy loading을 지원하는 이미지 컴포넌트입니다.

#### Props
- `src`: `string | ImageMetadata` - 이미지 소스 (필수)
- `alt`: `string` - 대체 텍스트 (필수)
- `width`: `number` - 너비
- `height`: `number` - 높이
- `lazy`: `boolean` - 지연 로딩 (기본값: `true`)
- `rounded`: `boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full'` - 둥근 모서리 (기본값: `false`)
- `aspectRatio`: `'auto' | 'square' | 'video' | 'portrait' | 'landscape'` (기본값: `'auto'`)
- `objectFit`: `'cover' | 'contain' | 'fill' | 'scale-down'` (기본값: `'cover'`)

#### 사용 예시

```astro
---
import projectImage from '../assets/project.jpg';
---

<!-- 기본 이미지 -->
<Image src={projectImage} alt="프로젝트 스크린샷" />

<!-- 둥근 모서리와 종횡비 -->
<Image 
  src="/avatar.jpg" 
  alt="프로필 사진"
  width={200}
  height={200}
  rounded="full"
  aspectRatio="square"
/>
```

## Feature 컴포넌트

### ThemeToggle

다크/라이트 모드를 전환하는 테마 토글 컴포넌트입니다.

#### Props
- `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
- `showLabel`: `boolean` - 라벨 표시 여부 (기본값: `false`)

#### 사용 예시

```astro
<!-- 기본 테마 토글 -->
<ThemeToggle />

<!-- 라벨과 함께 -->
<ThemeToggle showLabel />

<!-- 큰 크기 -->
<ThemeToggle size="lg" />
```

#### 이벤트
테마가 변경되면 `theme-changed` 커스텀 이벤트가 발생합니다:

```javascript
document.addEventListener('theme-changed', (e) => {
  console.log('테마 변경:', e.detail.theme);
  console.log('이전 테마:', e.detail.previousTheme);
});
```

## 타입 시스템

모든 컴포넌트는 TypeScript로 작성되었으며 완전한 타입 안전성을 제공합니다.

### 주요 타입들

```typescript
// 기본 크기 타입
type Size = 'sm' | 'md' | 'lg';

// 색상 타입
type Color = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';

// 변형 타입 (컴포넌트별로 다름)
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type CardVariant = 'default' | 'bordered' | 'elevated';
```

### Props 인터페이스

모든 컴포넌트 Props는 `src/types/components.ts`에 정의되어 있습니다:

```typescript
interface ButtonProps {
  variant?: ButtonVariant;
  size?: Size;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  class?: string;
}
```

## 베스트 프랙티스

### 1. 일관성 있는 크기 사용
```astro
<!-- 좋은 예 -->
<Button size="md">버튼</Button>
<Tag size="md">태그</Tag>

<!-- 피할 예 -->
<Button size="lg">버튼</Button>
<Tag size="sm">태그</Tag>
```

### 2. 의미 있는 색상 사용
```astro
<!-- 좋은 예 -->
<Badge color="success">완료</Badge>
<Badge color="warning">대기 중</Badge>
<Badge color="danger">오류</Badge>

<!-- 피할 예 -->
<Badge color="primary">오류</Badge>
```

### 3. 접근성 고려
```astro
<!-- 좋은 예 -->
<Button aria-label="메뉴 열기">
  <MenuIcon />
</Button>

<!-- 이미지에 alt 텍스트 제공 -->
<Image src={photo} alt="팀 사진" />
```

### 4. 반응형 디자인
```astro
<!-- 모바일에서는 전체 너비 버튼 사용 -->
<Button fullWidth class="md:w-auto">
  액션 버튼
</Button>
```

### 5. 컴포넌트 조합
```astro
<!-- 카드 안에 다양한 컴포넌트 조합 -->
<Card variant="bordered" hoverable>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">프로젝트 제목</h3>
    <div class="flex flex-wrap gap-2">
      <Tag color="primary">React</Tag>
      <Tag color="success">TypeScript</Tag>
    </div>
    <Button href="/projects/1" variant="outline">
      자세히 보기
    </Button>
  </div>
</Card>
```

## 성능 고려사항

1. **부분 하이드레이션**: JavaScript가 필요한 컴포넌트만 클라이언트에서 실행됩니다.
2. **CSS 최적화**: Tailwind CSS의 purge 기능으로 사용하지 않는 스타일은 제거됩니다.
3. **이미지 최적화**: Astro의 이미지 최적화 기능을 활용합니다.
4. **Lazy Loading**: 이미지와 무거운 컴포넌트는 지연 로딩됩니다.

## 테스트

모든 컴포넌트는 `/components-test` 페이지에서 테스트할 수 있습니다:

```bash
npm run dev
# http://localhost:4321/components-test 방문
```

---

더 자세한 정보는 각 컴포넌트의 소스 코드를 참조하거나 [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)를 확인하세요. 
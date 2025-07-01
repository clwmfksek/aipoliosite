# 🛡️ Admin 시스템 가이드

포트폴리오 사이트의 모든 하드코딩된 정보를 동적으로 관리할 수 있는 Admin 시스템입니다.

## 🚀 Admin 페이지 접속

1. 브라우저에서 `http://localhost:4321/admin` 또는 `https://yourdomain.com/admin` 접속
2. 관리자 비밀번호 입력 (기본값: `admin123`)
3. 로그인 후 관리 대시보드 접근

## 🔑 비밀번호 설정

환경변수 `ADMIN_PASSWORD`로 관리자 비밀번호를 설정할 수 있습니다:

```bash
# .env 파일에 추가
ADMIN_PASSWORD=your_secure_password
```

## 📊 관리 가능한 정보

### 1. 개인 정보 (Personal Info)

- **이름**: 포트폴리오 소유자 이름
- **직책**: 현재 직책 (예: "5년 경력 풀스택 웹 개발자")
- **이메일**: 연락처 이메일
- **전화번호**: 연락처 전화번호
- **자기소개**: 메인 소개 텍스트

### 2. 소셜 링크 (Social Links)

- **GitHub**: GitHub 프로필 URL 및 사용자명
- **LinkedIn**: LinkedIn 프로필 URL 및 사용자명
- **Instagram**: Instagram 프로필 URL 및 사용자명
- **Discord**: Discord 프로필 URL 및 사용자명

### 3. SEO 설정 (SEO Settings)

- **기본 제목**: 웹사이트 기본 타이틀
- **기본 설명**: 웹사이트 기본 메타 설명

### 4. 포트폴리오 관리 (Portfolio Management)

- **프로젝트 추가/수정/삭제**: 새로운 프로젝트를 생성하거나 기존 프로젝트를 편집
- **프로젝트 정보**:
  - 제목: 프로젝트명
  - 설명: 프로젝트에 대한 간단한 설명
  - 기술 스택: 사용된 기술들 (콤마로 구분)
  - 카테고리: 웹 개발, 모바일 앱, 데스크톱 앱, 기타
  - 데모 URL: 실제 동작하는 프로젝트 링크
  - GitHub URL: 소스 코드 저장소 링크
  - 상태: 계획됨, 진행중, 완료됨, 보관됨

### 5. 블로그 관리 (Blog Management)

- **블로그 글 추가/수정/삭제**: 새로운 블로그 글을 작성하거나 기존 글을 편집
- **블로그 글 정보**:
  - 제목: 블로그 글 제목
  - 설명: 블로그 글에 대한 간단한 설명
  - 태그: 글 분류를 위한 태그들 (콤마로 구분)
  - 작성자: 글 작성자명
  - 내용: 마크다운 형식의 글 내용
  - 게시 상태: 즉시 게시 또는 임시저장

## 💾 데이터 저장

모든 데이터는 `src/data/portfolio.json` 파일에 저장됩니다:

```json
{
  "personal": {
    "name": "김개발",
    "title": "5년 경력 풀스택 웹 개발자",
    "subtitle": "React • Node.js • TypeScript 전문가",
    "email": "dev.kim@example.com",
    "phone": "+82 10-1234-5678",
    "location": "서울, 대한민국"
  },
  "social": {
    "github": {
      "url": "https://github.com/yourusername",
      "username": "@yourusername"
    }
  },
  "seo": {
    "defaultTitle": "김개발 - 풀스택 개발자 포트폴리오",
    "defaultDescription": "혁신적인 웹 경험을 만드는 풀스택 개발자"
  }
}
```

## 🔄 변경사항 반영

Admin에서 데이터를 수정하면:

1. **즉시 반영**: 개발 환경에서는 자동으로 페이지가 새로고침됩니다
2. **프로덕션 환경**: 사이트 재배포가 필요할 수 있습니다

## 📱 반영되는 페이지

변경된 정보는 다음 페이지들에 자동으로 반영됩니다:

- **홈페이지** (`/`): Hero 섹션, About 섹션, Contact 섹션
- **소개 페이지** (`/about`): 개인 정보, 연락처
- **연락처 페이지** (`/contact`): 이메일, 전화번호, 소셜 링크
- **Footer**: 소셜 링크, 이메일

## 🛠️ API 엔드포인트

Admin 시스템은 다음 API를 사용합니다:

### 기본 데이터 관리

- `POST /api/admin/login` - 관리자 로그인
- `GET /api/admin/data` - 포트폴리오 데이터 조회
- `POST /api/admin/personal` - 개인 정보 업데이트
- `POST /api/admin/social` - 소셜 링크 업데이트
- `POST /api/admin/seo` - SEO 정보 업데이트

### 프로젝트 관리

- `GET /api/admin/projects` - 프로젝트 목록 조회
- `POST /api/admin/projects` - 새 프로젝트 생성
- `PUT /api/admin/projects` - 기존 프로젝트 수정
- `DELETE /api/admin/projects` - 프로젝트 삭제

### 블로그 관리

- `GET /api/admin/blog` - 블로그 글 목록 조회
- `POST /api/admin/blog` - 새 블로그 글 작성
- `PUT /api/admin/blog` - 기존 블로그 글 수정
- `DELETE /api/admin/blog` - 블로그 글 삭제

## 🔒 보안 고려사항

1. **비밀번호 보호**: 강력한 비밀번호 사용 권장
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **접근 제한**: 필요시 IP 제한 또는 추가 인증 계층 구현

## 🐛 문제 해결

### 로그인이 안될 때

- 비밀번호가 올바른지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 개발자 도구 Network 탭에서 API 응답 확인

### 데이터가 저장되지 않을 때

- 파일 권한 확인 (`src/data/portfolio.json`)
- 서버 로그 확인
- JSON 형식이 올바른지 확인

### 변경사항이 반영되지 않을 때

- 브라우저 캐시 삭제
- 개발 서버 재시작
- 프로덕션에서는 사이트 재배포

## 🚀 기능 현황

### ✅ 완료된 기능

- 개인 정보 관리 (이름, 직책, 연락처 등)
- 소셜 링크 관리 (GitHub, LinkedIn, Instagram, Discord)
- SEO 설정 관리 (제목, 설명)
- 프로젝트 관리 (추가, 수정, 삭제)
- 블로그 포스트 관리 (추가, 수정, 삭제)

### 🔄 향후 확장 가능한 기능

- 기술 스택 관리 (태그 시스템 고도화)
- 이미지 업로드 (프로젝트 이미지, 프로필 사진)
- 다국어 지원 (영어/한국어 등)
- 사용자 관리 (다중 사용자 지원)
- 통계 및 분석 (방문자, 조회수 등)
- 백업 및 복원 기능

## 📞 지원

Admin 시스템 사용 중 문제가 있거나 새로운 기능이 필요하면 개발팀에 문의하세요.

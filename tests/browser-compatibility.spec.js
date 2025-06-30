import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:4321';

test.describe('크로스 브라우저 호환성 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('홈페이지 기본 요소 렌더링 확인', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/포트폴리오|Portfolio/);
    
    // 네비게이션 메뉴 확인
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="/"]')).toBeVisible();
    await expect(page.locator('a[href="/projects"]')).toBeVisible();
    
    // 메인 콘텐츠 확인
    await expect(page.locator('main')).toBeVisible();
    
    // 다크모드 토글 확인
    const themeToggle = page.locator('[data-theme-toggle]');
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('프로젝트 페이지 접근 및 렌더링', async ({ page }) => {
    await page.click('a[href="/projects"]');
    await page.waitForLoadState('networkidle');
    
    // 프로젝트 목록 확인
    await expect(page.locator('h1')).toContainText(/프로젝트|Projects/);
    
    // 프로젝트 카드 확인
    const projectCards = page.locator('[data-project-card]');
    if (await projectCards.count() > 0) {
      await expect(projectCards.first()).toBeVisible();
    }
  });

  test('프로젝트 세부 페이지 접근', async ({ page }) => {
    await page.goto(`${baseUrl}/projects`);
    await page.waitForLoadState('networkidle');
    
    // 첫 번째 프로젝트 링크 클릭
    const firstProjectLink = page.locator('a[href*="/projects/"]').first();
    if (await firstProjectLink.count() > 0) {
      await firstProjectLink.click();
      await page.waitForLoadState('networkidle');
      
      // 세부 페이지 요소 확인
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      
      // 액션 버튼 확인
      const actionButtons = page.locator('[data-action-button]');
      if (await actionButtons.count() > 0) {
        await expect(actionButtons.first()).toBeVisible();
      }
    }
  });

  test('반응형 디자인 확인', async ({ page }) => {
    // 모바일 뷰포트
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('nav')).toBeVisible();
    
    // 태블릿 뷰포트
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('nav')).toBeVisible();
    
    // 데스크톱 뷰포트
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('다크모드 토글 기능', async ({ page }) => {
    // 다크모드 토글 찾기
    const themeToggle = page.locator('[data-theme-toggle]').or(
      page.locator('button:has-text("Dark")').or(
        page.locator('button:has-text("Light")').or(
          page.locator('button[aria-label*="theme"]')
        )
      )
    );
    
    if (await themeToggle.count() > 0) {
      // 현재 테마 상태 확인
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('class');
      
      // 토글 클릭
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // 테마 변경 확인
      const newTheme = await htmlElement.getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('이미지 로딩 확인', async ({ page }) => {
    await page.goto(`${baseUrl}/projects`);
    await page.waitForLoadState('networkidle');
    
    // 이미지 요소 확인
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // 각 이미지가 로드되었는지 확인
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        // 이미지 로드 상태 확인
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('폼 및 인터랙션 요소 확인', async ({ page }) => {
    // 링크 클릭 확인
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && href.startsWith('/')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(href.replace('#', ''));
      }
    }
  });
}); 
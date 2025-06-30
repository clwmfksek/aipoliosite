// 테마 관리 시스템
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'portfolio-theme';
    this.THEME_ATTRIBUTE = 'data-theme';
    this.DARK_CLASS = 'dark';
    
    // 기본값은 시스템 선호도
    this.defaultTheme = this.getSystemPreference();
    
    // 초기화
    this.init();
  }

  // 시스템 테마 선호도 감지
  getSystemPreference() {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  // 저장된 테마 가져오기
  getSavedTheme() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.STORAGE_KEY);
    }
    return null;
  }

  // 현재 테마 가져오기
  getCurrentTheme() {
    const saved = this.getSavedTheme();
    return saved || this.defaultTheme;
  }

  // 테마 저장
  saveTheme(theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  // 테마 적용
  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add(this.DARK_CLASS);
    } else {
      html.classList.remove(this.DARK_CLASS);
    }
    
    // 데이터 속성으로도 설정 (CSS에서 사용 가능)
    html.setAttribute(this.THEME_ATTRIBUTE, theme);
    
    // 커스텀 이벤트 발생 (다른 컴포넌트에서 리스닝 가능)
    document.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme } 
    }));
  }

  // 테마 토글
  toggleTheme() {
    const current = this.getCurrentTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    
    return newTheme;
  }

  // 특정 테마로 설정
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Invalid theme:', theme);
      return;
    }
    
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  // 시스템 선호도 변경 감지
  watchSystemPreference() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // 사용자가 수동으로 설정하지 않은 경우에만 시스템 설정을 따름
        const savedTheme = this.getSavedTheme();
        if (!savedTheme) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme);
        }
      });
    }
  }

  // 초기화
  init() {
    // 저장된 테마 또는 시스템 선호도 적용
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);
    
    // 시스템 선호도 변경 감지 시작
    this.watchSystemPreference();
    
    // 전역 객체로 등록 (다른 스크립트에서 접근 가능)
    if (typeof window !== 'undefined') {
      window.themeManager = this;
    }
  }

  // 현재 상태 반환
  getState() {
    return {
      current: this.getCurrentTheme(),
      saved: this.getSavedTheme(),
      system: this.getSystemPreference(),
      isDark: this.getCurrentTheme() === 'dark'
    };
  }
}

// IIFE로 즉시 실행하여 플래시 방지
(function() {
  // 가능한 한 빨리 테마 적용 (플래시 방지)
  const STORAGE_KEY = 'portfolio-theme';
  const DARK_CLASS = 'dark';
  
  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }
  
  // 즉시 테마 적용
  const savedTheme = getSavedTheme();
  const theme = savedTheme || getSystemPreference();
  
  if (theme === 'dark') {
    document.documentElement.classList.add(DARK_CLASS);
  }
  
  // DOM이 로드된 후 전체 시스템 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ThemeManager();
    });
  } else {
    new ThemeManager();
  }
})();

// 다른 스크립트에서 사용할 수 있도록 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
} 
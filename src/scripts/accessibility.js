// 접근성 관리 시스템
class AccessibilityManager {
  constructor() {
    this.announceElement = null;
    this.focusableElements = [];
    this.lastFocusedElement = null;

    this.init();
  }

  init() {
    // 공지사항 요소 찾기
    this.announceElement = document.getElementById('accessibility-announcements');

    // 포커스 가능한 요소들 찾기
    this.updateFocusableElements();

    // 이벤트 리스너 설정
    this.setupEventListeners();

    console.log('접근성 관리자 초기화 완료');
  }

  // 스크린 리더에게 메시지 공지
  announce(message, priority = 'polite') {
    if (!this.announceElement) return;

    // 이전 메시지 지우기
    this.announceElement.textContent = '';

    // aria-live 속성 설정
    this.announceElement.setAttribute('aria-live', priority);

    // 짧은 지연 후 메시지 설정 (스크린 리더가 변경사항을 감지하도록)
    setTimeout(() => {
      this.announceElement.textContent = message;
    }, 100);

    // 메시지 자동 지우기
    setTimeout(() => {
      this.announceElement.textContent = '';
    }, 5000);
  }

  // 포커스 가능한 요소들 업데이트
  updateFocusableElements() {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    this.focusableElements = Array.from(document.querySelectorAll(selectors.join(', '))).filter(
      el => {
        // 숨겨진 요소들은 제외
        const style = window.getComputedStyle(el);
        return (
          style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null
        );
      }
    );
  }

  // 키보드 내비게이션 개선
  setupEventListeners() {
    // ESC 키로 포커스 해제
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }

      // Tab 키 순환 관리
      if (e.key === 'Tab') {
        this.handleTabKey(e);
      }
    });

    // 포커스 추적
    document.addEventListener('focusin', e => {
      this.lastFocusedElement = e.target;
    });

    // 모바일 메뉴 포커스 트랩
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      this.setupMobileMenuAccessibility(mobileMenuButton, mobileMenu);
    }

    // 테마 토글 공지사항
    document.addEventListener('themechange', e => {
      const theme = e.detail.theme;
      const message =
        theme === 'dark' ? '다크 모드가 활성화되었습니다' : '라이트 모드가 활성화되었습니다';
      this.announce(message);
    });
  }

  // ESC 키 처리
  handleEscapeKey(e) {
    // 활성화된 모달이나 드롭다운 닫기
    const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    const openDropdown = document.querySelector('[aria-expanded="true"]');
    const mobileMenu = document.getElementById('mobile-menu');

    if (openModal) {
      this.closeModal(openModal);
      e.preventDefault();
    } else if (mobileMenu && mobileMenu.style.display !== 'none') {
      this.closeMobileMenu();
      e.preventDefault();
    } else if (openDropdown) {
      openDropdown.setAttribute('aria-expanded', 'false');
      e.preventDefault();
    }
  }

  // Tab 키 순환 관리
  handleTabKey(e) {
    // 현재 포커스된 요소가 마지막 요소인 경우
    const currentIndex = this.focusableElements.indexOf(document.activeElement);

    if (e.shiftKey) {
      // Shift + Tab (역방향)
      if (currentIndex === 0) {
        e.preventDefault();
        this.focusableElements[this.focusableElements.length - 1].focus();
      }
    } else {
      // Tab (순방향)
      if (currentIndex === this.focusableElements.length - 1) {
        e.preventDefault();
        this.focusableElements[0].focus();
      }
    }
  }

  // 모바일 메뉴 접근성 설정
  setupMobileMenuAccessibility(button, menu) {
    button.addEventListener('click', () => {
      const isOpen = menu.style.display !== 'none';

      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });
  }

  // 모바일 메뉴 열기
  openMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');

    if (!menu || !button) return;

    // 포커스 트랩 설정
    const menuFocusableElements = menu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (menuFocusableElements.length > 0) {
      // 첫 번째 메뉴 항목에 포커스
      setTimeout(() => {
        menuFocusableElements[0].focus();
      }, 100);

      // 포커스 트랩 이벤트 리스너
      const trapFocus = e => {
        if (e.key === 'Tab') {
          const firstElement = menuFocusableElements[0];
          const lastElement = menuFocusableElements[menuFocusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      menu.addEventListener('keydown', trapFocus);
      menu.setAttribute('data-focus-trap-active', 'true');
    }

    this.announce('메뉴가 열렸습니다. ESC 키로 닫을 수 있습니다.');
  }

  // 모바일 메뉴 닫기
  closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');

    if (!menu || !button) return;

    // 포커스 트랩 해제
    const trapActive = menu.getAttribute('data-focus-trap-active');
    if (trapActive) {
      menu.removeAttribute('data-focus-trap-active');
      // 포커스를 버튼으로 되돌리기
      button.focus();
    }

    this.announce('메뉴가 닫혔습니다.');
  }

  // 모달 닫기
  closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');

    // 이전 포커스 요소로 되돌리기
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    this.announce('모달이 닫혔습니다.');
  }

  // 페이지 로드 완료 공지
  announcePageLoad() {
    const title = document.title;
    this.announce(`${title} 페이지가 로드되었습니다.`);
  }

  // 동적 콘텐츠 로드 공지
  announceContentChange(message) {
    this.announce(message, 'assertive');
  }

  // 에러 공지
  announceError(message) {
    this.announce(`오류: ${message}`, 'assertive');
  }

  // 성공 공지
  announceSuccess(message) {
    this.announce(`성공: ${message}`, 'polite');
  }
}

// 전역 접근성 관리자 초기화
let accessibilityManager;

// DOM 준비 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager = new AccessibilityManager();

    // 페이지 로드 완료 공지
    setTimeout(() => {
      accessibilityManager.announcePageLoad();
    }, 1000);
  });
} else {
  accessibilityManager = new AccessibilityManager();
  accessibilityManager.announcePageLoad();
}

// 전역 접근 허용
window.accessibilityManager = accessibilityManager;

// 유용한 접근성 유틸리티 함수들
window.accessibility = {
  announce: (message, priority = 'polite') => {
    accessibilityManager?.announce(message, priority);
  },

  announceError: message => {
    accessibilityManager?.announceError(message);
  },

  announceSuccess: message => {
    accessibilityManager?.announceSuccess(message);
  },

  announceContentChange: message => {
    accessibilityManager?.announceContentChange(message);
  },
};

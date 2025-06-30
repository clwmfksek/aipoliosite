// 키보드 내비게이션 향상 스크립트
class KeyboardNavigationEnhancer {
  constructor() {
    this.currentSectionIndex = 0;
    this.sections = [];
    this.currentFocusableIndex = 0;
    this.focusableElements = [];

    this.init();
  }

  init() {
    // 주요 섹션들 식별
    this.identifySections();

    // 이벤트 리스너 설정
    this.setupKeyboardShortcuts();

    // 포커스 표시 개선
    this.enhanceFocusIndicators();

    console.log('키보드 내비게이션 향상 기능 초기화 완료');
  }

  // 주요 섹션들 식별
  identifySections() {
    const sectionSelectors = [
      'header[role="banner"]',
      'section[role="banner"]', // Hero section
      'section[aria-label*="소개"]',
      'section[aria-label*="기술"]',
      'section[aria-label*="프로젝트"]',
      'section[aria-label*="연락"]',
      'footer[role="contentinfo"]',
    ];

    this.sections = sectionSelectors
      .map(selector => document.querySelector(selector))
      .filter(section => section !== null);

    console.log(`발견된 섹션 수: ${this.sections.length}`);
  }

  // 키보드 단축키 설정
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Alt 키와 조합된 단축키들
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.navigateToSection(0); // Header
            window.accessibility?.announce('헤더로 이동했습니다');
            break;
          case '2':
            e.preventDefault();
            this.navigateToSection(1); // Hero
            window.accessibility?.announce('메인 섹션으로 이동했습니다');
            break;
          case '3':
            e.preventDefault();
            this.navigateToSection(2); // About
            window.accessibility?.announce('소개 섹션으로 이동했습니다');
            break;
          case '4':
            e.preventDefault();
            this.navigateToSection(3); // Skills
            window.accessibility?.announce('기술 섹션으로 이동했습니다');
            break;
          case '5':
            e.preventDefault();
            this.navigateToSection(4); // Projects
            window.accessibility?.announce('프로젝트 섹션으로 이동했습니다');
            break;
          case '6':
            e.preventDefault();
            this.navigateToSection(5); // Contact
            window.accessibility?.announce('연락처 섹션으로 이동했습니다');
            break;
          case '0':
            e.preventDefault();
            this.navigateToSection(this.sections.length - 1); // Footer
            window.accessibility?.announce('푸터로 이동했습니다');
            break;
        }
      }

      // 섹션 간 이동 (Ctrl + 화살표)
      if (e.ctrlKey) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this.navigateToNextSection();
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.navigateToPreviousSection();
            break;
          case 'Home':
            e.preventDefault();
            this.navigateToSection(0);
            window.accessibility?.announce('페이지 상단으로 이동했습니다');
            break;
          case 'End':
            e.preventDefault();
            this.navigateToSection(this.sections.length - 1);
            window.accessibility?.announce('페이지 하단으로 이동했습니다');
            break;
        }
      }

      // 스킵 링크 활성화 (Tab 키 첫 번째 누름)
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
          skipLink.focus();
        }
      }

      // 도움말 표시 (F1 또는 Ctrl + ?)
      if (e.key === 'F1' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        this.showKeyboardHelp();
      }
    });
  }

  // 특정 섹션으로 이동
  navigateToSection(index) {
    if (index >= 0 && index < this.sections.length) {
      this.currentSectionIndex = index;
      const section = this.sections[index];

      // 섹션에 포커스 설정
      section.setAttribute('tabindex', '-1');
      section.focus();

      // 스무스 스크롤
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // 섹션 내 첫 번째 포커스 가능한 요소 찾기
      setTimeout(() => {
        const firstFocusable = this.findFirstFocusableInSection(section);
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 500);
    }
  }

  // 다음 섹션으로 이동
  navigateToNextSection() {
    const nextIndex = (this.currentSectionIndex + 1) % this.sections.length;
    this.navigateToSection(nextIndex);

    const sectionName = this.getSectionName(nextIndex);
    window.accessibility?.announce(`다음 섹션으로 이동: ${sectionName}`);
  }

  // 이전 섹션으로 이동
  navigateToPreviousSection() {
    const prevIndex =
      this.currentSectionIndex === 0 ? this.sections.length - 1 : this.currentSectionIndex - 1;
    this.navigateToSection(prevIndex);

    const sectionName = this.getSectionName(prevIndex);
    window.accessibility?.announce(`이전 섹션으로 이동: ${sectionName}`);
  }

  // 섹션 내 첫 번째 포커스 가능한 요소 찾기
  findFirstFocusableInSection(section) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = section.querySelectorAll(focusableSelectors.join(', '));
    return focusableElements.length > 0 ? focusableElements[0] : null;
  }

  // 섹션 이름 가져오기
  getSectionName(index) {
    const sectionNames = [
      '헤더',
      '메인 소개',
      '자기소개',
      '기술 스택',
      '프로젝트',
      '연락처',
      '푸터',
    ];
    return sectionNames[index] || `섹션 ${index + 1}`;
  }

  // 포커스 표시 개선
  enhanceFocusIndicators() {
    // 마우스 사용 중일 때는 포커스 링 숨기기
    let usingMouse = false;

    document.addEventListener('mousedown', () => {
      usingMouse = true;
      document.body.classList.add('using-mouse');
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        usingMouse = false;
        document.body.classList.remove('using-mouse');
      }
    });

    // 포커스 추적 및 스크롤
    document.addEventListener('focusin', e => {
      const focusedElement = e.target;

      // 포커스된 요소가 화면에 보이도록 스크롤
      if (focusedElement && typeof focusedElement.scrollIntoView === 'function') {
        // 헤더 높이를 고려한 오프셋
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;

        setTimeout(() => {
          focusedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // 헤더와 겹치지 않도록 추가 스크롤
          window.scrollBy(0, -headerHeight / 2);
        }, 100);
      }
    });
  }

  // 키보드 도움말 표시
  showKeyboardHelp() {
    const helpModal = this.createHelpModal();
    document.body.appendChild(helpModal);

    // 모달에 포커스
    const closeButton = helpModal.querySelector('.help-close-button');
    if (closeButton) {
      closeButton.focus();
    }

    window.accessibility?.announce('키보드 단축키 도움말이 열렸습니다. ESC 키로 닫을 수 있습니다.');
  }

  // 도움말 모달 생성
  createHelpModal() {
    const modal = document.createElement('div');
    modal.className =
      'keyboard-help-modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'help-title');
    modal.setAttribute('aria-describedby', 'help-content');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h2 id="help-title" class="text-xl font-bold text-secondary-900 dark:text-white">
            키보드 단축키
          </h2>
          <button 
            type="button" 
            class="help-close-button text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
            aria-label="도움말 닫기"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div id="help-content" class="space-y-3 text-sm text-secondary-700 dark:text-secondary-300">
          <div><strong>Alt + 1-6, 0:</strong> 섹션 직접 이동</div>
          <div><strong>Ctrl + ↑/↓:</strong> 섹션 간 이동</div>
          <div><strong>Ctrl + Home/End:</strong> 페이지 상단/하단</div>
          <div><strong>Tab:</strong> 다음 요소로 이동</div>
          <div><strong>Shift + Tab:</strong> 이전 요소로 이동</div>
          <div><strong>ESC:</strong> 메뉴/모달 닫기</div>
          <div><strong>Enter/Space:</strong> 링크/버튼 활성화</div>
          <div><strong>F1 또는 Ctrl + /:</strong> 이 도움말</div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            type="button" 
            class="help-ok-button px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            확인
          </button>
        </div>
      </div>
    `;

    // 모달 닫기 기능
    const closeModal = () => {
      modal.remove();
      window.accessibility?.announce('도움말이 닫혔습니다.');
    };

    modal.querySelector('.help-close-button').addEventListener('click', closeModal);
    modal.querySelector('.help-ok-button').addEventListener('click', closeModal);

    // 모달 외부 클릭으로 닫기
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC 키로 닫기
    const handleEsc = e => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    return modal;
  }

  // 키보드 내비게이션 상태 업데이트
  updateNavigationState() {
    this.identifySections();
  }
}

// 전역 키보드 내비게이션 향상 기능 초기화
let keyboardNavigationEnhancer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    keyboardNavigationEnhancer = new KeyboardNavigationEnhancer();
  });
} else {
  keyboardNavigationEnhancer = new KeyboardNavigationEnhancer();
}

// 전역 접근 허용
window.keyboardNavigationEnhancer = keyboardNavigationEnhancer;

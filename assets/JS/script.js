let data = {
  en: {
    title: 'FAQ',
    footerTitle: 'FAQ',
    footerSubtitle: 'Your guide',
    copyright: 'All rights reserved',
    questions: [
      { title: 'Example question', items: ['This is a sample answer.'] },
    ],
  },
  ar: {
    title: 'الأسئلة الشائعة',
    footerTitle: 'الأسئلة الشائعة',
    footerSubtitle: 'دليلك الشامل',
    copyright: 'جميع الحقوق محفوظة',
    questions: [
      {
        title: 'مثال سؤال',
        items: ['هذا مثال لإجابة - غيّر البيانات عبر data.js'],
      },
    ],
  },
};

try {
  const mod = await import('./data.js');
  if (mod && mod.faqData) {
    data = mod.faqData;
  } else {
    console.warn('data.js loaded but `faqData` not found — using fallback');
  }
} catch (err) {
  console.warn('Could not load data.js, using fallback data. Error:', err);
}

let currentLang = 'en';
let isDark = false;

// Initialize
function init() {
  const savedLang = localStorage.getItem('lang') || 'en';
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const html = document.documentElement;
  if (savedLang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
  }

  currentLang = savedLang;
  isDark = savedTheme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);

  // set initial icon for theme
  document.getElementById('themeIcon').className = isDark
    ? 'fas fa-sun'
    : 'fas fa-moon';
  document
    .getElementById('themeToggleBtn')
    .setAttribute('aria-pressed', isDark ? 'true' : 'false');

  // wire up simple event listeners
  document
    .getElementById('langToggleBtn')
    .addEventListener('click', toggleLanguage);
  document
    .getElementById('themeToggleBtn')
    .addEventListener('click', toggleTheme);

  updateContent();
}

// Toggle Language
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  const html = document.documentElement;

  if (currentLang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
  } else {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
  }

  localStorage.setItem('lang', currentLang);
  updateContent();
}

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').className = isDark
    ? 'fas fa-sun'
    : 'fas fa-moon';
  document
    .getElementById('themeToggleBtn')
    .setAttribute('aria-pressed', isDark ? 'true' : 'false');
}

function updateContent() {
  const content = data[currentLang] || data['ar'];
  document.getElementById('pageTitle').textContent = content.title;
  document.getElementById('langBtn').textContent =
    currentLang === 'ar' ? 'EN' : 'AR';
  document.getElementById('footerTitle').textContent = content.footerTitle;
  document.getElementById('footerSubtitle').textContent =
    content.footerSubtitle;
  document.getElementById('copyrightText').textContent = content.copyright;
  document.getElementById('copyrightYear').textContent =
    new Date().getFullYear();
  document.title = content.title;

  renderAccordion(content.questions || []);
}

function renderAccordion(questions) {
  const container = document.getElementById('accordionContainer');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const headerId = `accordion-header-${index}`;
    const contentId = `content-${index}`;

    const accordionItem = document.createElement('div');
    accordionItem.className =
      'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden slide-in';
    accordionItem.style.animationDelay = `${index * 0.06}s`;

    const itemsHtml =
      (q.items || [])
        .map(
          (item, i) => `
                <li class="flex gap-3">
                    <span class="text-blue-500 font-bold flex-shrink-0">${
                      i + 1
                    }.</span>
                    <span class="text-gray-700 dark:text-gray-300">${item}</span>
                </li>`
        )
        .join('') || '<li class="text-gray-500">لا توجد بنود</li>';

    accordionItem.innerHTML = `
            <div>
              <button id="${headerId}" aria-expanded="false" aria-controls="${contentId}"
                class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                type="button">
                  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">${q.title}</h2>
                  <svg id="icon-${index}" class="w-6 h-6 text-blue-500 rotate-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
              </button>
              <div id="${contentId}" class="accordion-content" role="region" aria-labelledby="${headerId}">
                  <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                      <ul class="space-y-3">
                          ${itemsHtml}
                      </ul>
                  </div>
              </div>
            </div>
          `;

    container.appendChild(accordionItem);

    const headerBtn = document.getElementById(headerId);
    headerBtn.addEventListener('click', () => toggleAccordion(index));
    headerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(index);
      }
    });
  });
}

function toggleAccordion(index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);
  const header = document.getElementById(`accordion-header-${index}`);
  if (!content || !header || !icon) return;

  const isOpen = header.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    content.style.maxHeight = content.scrollHeight + 'px';
    requestAnimationFrame(() => {
      content.style.maxHeight = '0';
      header.setAttribute('aria-expanded', 'false');
      icon.classList.remove('active');
    });
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    header.setAttribute('aria-expanded', 'true');
    icon.classList.add('active');

    content.addEventListener(
      'transitionend',
      function handler() {
        if (header.getAttribute('aria-expanded') === 'true') {
          content.style.maxHeight = 'none';
        }
        content.removeEventListener('transitionend', handler);
      },
      { once: true }
    );
  }
}

window.toggleLanguage = toggleLanguage;
window.toggleTheme = toggleTheme;
window.toggleAccordion = toggleAccordion;

// Start
init();

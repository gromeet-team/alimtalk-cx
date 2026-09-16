(function () {
  const sourceUrl = new URL('../index.html', window.location.href);
  const root = document.getElementById('ad-root');

  function normalizeUrls(element) {
    element.querySelectorAll('[src]').forEach(function (node) {
      const value = node.getAttribute('src');
      if (value) node.setAttribute('src', new URL(value, sourceUrl).href);
    });
    element.querySelectorAll('a[href]').forEach(function (node) {
      const value = node.getAttribute('href');
      if (value && !value.startsWith('#')) node.setAttribute('href', new URL(value, sourceUrl).href);
    });
  }

  function cloneSection(source, selector) {
    const section = source.querySelector(selector);
    if (!section) throw new Error(selector + ' 영역을 찾지 못했습니다.');
    const clone = section.cloneNode(true);
    normalizeUrls(clone);
    return clone;
  }

  function createBenefits() {
    const section = document.createElement('section');
    section.className = 'ad-benefits';
    section.innerHTML = [
      '<div class="ad-benefits-inner">',
      '<h2>신청 전 핵심혜택 3가지</h2>',
      '<div class="ad-benefit-grid">',
      '<div class="ad-benefit"><strong>최대 249,000원 상당</strong><span>미션 완료 시 유비드 선패드 증정</span></div>',
      '<div class="ad-benefit"><strong>UV카메라 무료 체험</strong><span>도포 전·후 모습을 직접 촬영</span></div>',
      '<div class="ad-benefit"><strong>간단한 콘텐츠 미션</strong><span>가이드에 따라 촬영·인증하면 완료</span></div>',
      '</div>',
      '<p class="ad-return">UV카메라는 체험 후 반납 · 선패드는 증정</p>',
      '</div>'
    ].join('');
    return section;
  }

  function createDetails(label, contentFactory) {
    const details = document.createElement('details');
    details.className = 'ad-details';
    details.innerHTML = '<summary>' + label + '</summary><div class="ad-detail-content"></div>';
    details.addEventListener('toggle', function () {
      const content = details.querySelector('.ad-detail-content');
      if (!details.open || content.childElementCount) return;
      contentFactory().forEach(function (section) {
        section.querySelectorAll('img').forEach(function (image) { image.loading = 'lazy'; });
        content.appendChild(section);
      });
      bindFaq(content);
    });
    return details;
  }

  function bindFaq(scope) {
    scope.querySelectorAll('.faq-item').forEach(function (item) {
      item.classList.remove('active');
      const button = item.querySelector('.faq-question');
      if (!button) return;
      button.addEventListener('click', function () {
        item.classList.toggle('active');
      });
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function initStickyCta() {
    const cta = document.querySelector('.sticky-apply-cta');
    const apply = document.getElementById('apply');
    if (!cta || !apply || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      const formVisible = entries[0].isIntersecting;
      cta.classList.toggle('is-hidden', formVisible);
      cta.setAttribute('aria-hidden', formVisible ? 'true' : 'false');
      if (formVisible) cta.setAttribute('tabindex', '-1');
      else cta.removeAttribute('tabindex');
    }, { threshold: 0.01 }).observe(apply);
  }

  fetch(sourceUrl)
    .then(function (response) {
      if (!response.ok) throw new Error('원본 신청 페이지를 불러오지 못했습니다.');
      return response.text();
    })
    .then(function (html) {
      const source = new DOMParser().parseFromString(html, 'text/html');
      const hero = cloneSection(source, '#main');
      hero.querySelectorAll('iframe, .video').forEach(function (node) { node.remove(); });

      const apply = cloneSection(source, '#apply');
      const accordions = document.createElement('section');
      accordions.className = 'ad-accordions';
      accordions.appendChild(createDetails('미션 상세 보기', function () {
        return [cloneSection(source, '.steps-section'), cloneSection(source, '.notice-section')];
      }));
      accordions.appendChild(createDetails('자주 묻는 질문 보기', function () {
        return [cloneSection(source, '.faq-section')];
      }));

      root.replaceChildren(hero, createBenefits(), apply, accordions);
      initStickyCta();

      return loadScript(new URL('../app.js', window.location.href).href);
    })
    .then(function () {
      window.showSuccess = function (typeValue) {
        markApplied();
        window.location.href = '../complete.html?type=' + encodeURIComponent(typeValue || '');
      };
      document.dispatchEvent(new Event('DOMContentLoaded'));
    })
    .catch(function (error) {
      root.innerHTML = '<p class="ad-loading">신청 페이지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
      console.error(error);
    });
})();

// ----------------------------------------------------------------
// foremong-register API 엔드포인트 (register.uvid.co.kr 도메인 별칭)
// ----------------------------------------------------------------
const FORM_ENDPOINT = 'https://register.uvid.co.kr/api/uvid/uv-camera-event';

const PACKAGE_LABEL = {
  free_trial:           '무료 콘텐츠 챌린지 — Single Pack 49,000원 상당',
  influencer_challenge: '인플루언서 챌린지 — Max Pack 249,000원 상당',
};

const PACKAGE_VALUE = {
  free_trial:           49000,
  influencer_challenge: 249000,
};


// ----------------------------------------------------------------
// 신청 유형 라디오 (참여형 / SNS형 분기)
// ----------------------------------------------------------------
function applyTypeChange() {
  const checked = document.querySelector('input[name="type"]:checked');
  const value   = checked ? checked.value : 'free_trial';
  const isSNS   = value === 'influencer_challenge';

  document.querySelectorAll('.type-radio').forEach(label => {
    const input = label.querySelector('input[name="type"]');
    label.classList.toggle('active', input && input.checked);
  });

  document.body.classList.toggle('sns-active', isSNS);

  // SNS 필드 required 토글
  const snsInputs = ['snsUrlInput', 'categoryInput'];
  snsInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.required = isSNS;
      if (!isSNS) {
        el.value = '';
        clearFieldError(id.replace('Input', ''));
      }
    }
  });

  // 메타 파트너십 동의 토글 (SNS형 필수, 참여형 비표시)
  const partnership = document.getElementById('partnershipInput');
  if (partnership) {
    partnership.required = isSNS;
    if (!isSNS) {
      partnership.checked = false;
      clearFieldError('partnership');
    }
  }
}


// ----------------------------------------------------------------
// 다음 주소검색 API
// ----------------------------------------------------------------
function searchAddress() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('postcodeInput').value = data.zonecode;
      document.getElementById('addressInput').value  = data.roadAddress || data.jibunAddress;
      document.getElementById('addressDetailInput').focus();
      clearFieldError('address');
    }
  }).open();
}


// ----------------------------------------------------------------
// 전화번호 자동 하이픈 포맷
// ----------------------------------------------------------------
function formatPhone(input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) {
    input.value = digits;
  } else if (digits.length <= 7) {
    input.value = digits.slice(0, 3) + '-' + digits.slice(3);
  } else {
    input.value = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
  }
}


// ----------------------------------------------------------------
// 필드 에러 표시 / 초기화
// ----------------------------------------------------------------
function setFieldError(fieldId, message) {
  const field   = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (field) field.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field   = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (field) field.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}


// ----------------------------------------------------------------
// 유효성 검사
// ----------------------------------------------------------------
function validateForm() {
  let isValid = true;

  ['name', 'tel', 'email', 'mallId', 'snsUrl', 'category', 'address', 'consent', 'marketing', 'partnership']
    .forEach(clearFieldError);

  const name     = document.getElementById('nameInput').value.trim();
  const tel      = document.getElementById('telInput').value.trim();
  const email    = document.getElementById('emailInput').value.trim();
  const postcode = document.getElementById('postcodeInput').value.trim();
  const consent  = document.getElementById('consentInput').checked;
  const marketing = document.getElementById('marketingInput').checked;
  const checked  = document.querySelector('input[name="type"]:checked');
  const isSNS    = checked && checked.value === 'influencer_challenge';

  if (!name) {
    setFieldError('name', '성명을 입력해 주세요.');
    isValid = false;
  }

  if (!tel) {
    setFieldError('tel', '연락처를 입력해 주세요.');
    isValid = false;
  } else if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(tel)) {
    setFieldError('tel', '올바른 연락처를 입력해 주세요. (예: 010-1234-5678)');
    isValid = false;
  }

  if (!email) {
    setFieldError('email', '이메일을 입력해 주세요.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('email', '올바른 이메일 형식을 입력해 주세요.');
    isValid = false;
  }

  if (isSNS) {
    const snsUrl   = document.getElementById('snsUrlInput').value.trim();
    const category = document.getElementById('categoryInput').value;

    if (!snsUrl) {
      setFieldError('snsUrl', '인스타그램 URL을 입력해 주세요.');
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(snsUrl)) {
      setFieldError('snsUrl', 'http:// 또는 https://로 시작하는 URL을 입력해 주세요.');
      isValid = false;
    }

    if (!category) {
      setFieldError('category', '카테고리를 선택해 주세요.');
      isValid = false;
    }
  }

  if (!postcode) {
    setFieldError('address', '주소검색 버튼을 눌러 주소를 선택해 주세요.');
    isValid = false;
  }

  if (!consent) {
    setFieldError('consent', '개인정보 수집·이용에 동의해 주세요.');
    isValid = false;
  }

  if (!marketing) {
    setFieldError('marketing', '콘텐츠 2차 마케팅 활용에 동의해 주세요.');
    isValid = false;
  }

  if (isSNS) {
    const partnership = document.getElementById('partnershipInput').checked;
    if (!partnership) {
      setFieldError('partnership', '메타 파트너십 광고 동의가 필요합니다.');
      isValid = false;
    }
  }

  return isValid;
}


// ----------------------------------------------------------------
// 쿠키 읽기 (Facebook 픽셀 매칭용)
// ----------------------------------------------------------------
function getCookie(name) {
  return document.cookie.split(';').reduce(function(acc, c) {
    var parts = c.trim().split('=');
    acc[parts[0]] = parts[1];
    return acc;
  }, {})[name] || null;
}


// ----------------------------------------------------------------
// foremong API 전송
// ----------------------------------------------------------------
async function submitForm(data) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  let result = {};
  try {
    result = text ? JSON.parse(text) : {};
  } catch (_) {
    throw new Error('서버 응답을 처리할 수 없습니다. 관리자에게 문의해 주세요.');
  }

  if (!res.ok) {
    throw new Error(result.error || '서버 오류가 발생했습니다. (' + res.status + ')');
  }

  return result;
}


// ----------------------------------------------------------------
// Meta Pixel Lead 이벤트
// ----------------------------------------------------------------
function trackLead(typeValue) {
  if (typeof fbq !== 'function') return;

  try {
    fbq('track', 'Lead', {
      content_name:     'uv_camera_event',
      content_category: typeValue === 'influencer_challenge' ? 'influencer_challenge' : 'free_trial',
      value:            PACKAGE_VALUE[typeValue] || 49000,
      currency:         'KRW',
    });
  } catch (err) {
    console.warn('fbq Lead failed:', err);
  }
}


// ----------------------------------------------------------------
// 완료 화면 표시 / 폼 초기화
// ----------------------------------------------------------------
function showSuccess(typeValue) {
  document.getElementById('applicationForm').style.display = 'none';
  document.getElementById('successPackage').textContent    = '신청 패키지: ' + (PACKAGE_LABEL[typeValue] || '');
  document.getElementById('success-screen').style.display  = 'flex';

  document.getElementById('main').style.display             = 'none';
  document.getElementById('scarcity-banner').style.display  = 'none';
  document.getElementById('cards').style.display            = 'none';
  document.getElementById('conditions').style.display       = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  const form = document.getElementById('applicationForm');
  form.reset();

  // 라디오 기본값 (참여형)
  const freeTrialRadio = document.querySelector('input[name="type"][value="free_trial"]');
  if (freeTrialRadio) freeTrialRadio.checked = true;
  applyTypeChange();

  document.querySelectorAll('.field.error').forEach(f => f.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => { el.textContent = ''; });

  const feedback = document.getElementById('formFeedback');
  feedback.textContent  = '';
  feedback.style.display = 'none';

  document.getElementById('success-screen').style.display = 'none';
  form.style.display = 'block';

  document.getElementById('main').style.display             = '';
  document.getElementById('scarcity-banner').style.display  = '';
  document.getElementById('cards').style.display            = '';
  document.getElementById('conditions').style.display       = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ----------------------------------------------------------------
// 이벤트 바인딩
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

  // 신청 유형 라디오
  document.querySelectorAll('input[name="type"]').forEach(input => {
    input.addEventListener('change', applyTypeChange);
  });
  applyTypeChange();

  // 전화번호 자동 하이픈
  document.getElementById('telInput').addEventListener('input', function() {
    formatPhone(this);
    clearFieldError('tel');
  });

  // 입력 시 해당 필드 에러 초기화
  ['nameInput', 'emailInput', 'mallIdInput', 'snsUrlInput', 'categoryInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, function() {
        clearFieldError(id.replace('Input', ''));
      });
    }
  });

  ['postcodeInput', 'addressDetailInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function() { clearFieldError('address'); });
  });

  ['consentInput', 'marketingInput', 'partnershipInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', function() {
      clearFieldError(id.replace('Input', ''));
    });
  });

  // 폼 제출
  document.getElementById('applicationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
      var firstError = document.querySelector('.field.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var submitBtn = document.getElementById('submitBtn');
    var btnLabel  = submitBtn.querySelector('.btn-label');
    var feedback  = document.getElementById('formFeedback');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    if (btnLabel) btnLabel.textContent = '신청 중...';
    feedback.style.display = 'none';

    var typeValue = (document.querySelector('input[name="type"]:checked') || {}).value || 'free_trial';

    var payload = {
      applicantName:       document.getElementById('nameInput').value.trim(),
      contact:             document.getElementById('telInput').value.trim(),
      email:               document.getElementById('emailInput').value.trim(),
      type:                typeValue,
      packageType:         PACKAGE_LABEL[typeValue],
      mallId:              document.getElementById('mallIdInput').value.trim(),
      snsUrl:              document.getElementById('snsUrlInput').value.trim(),
      category:            document.getElementById('categoryInput').value,
      postcode:            document.getElementById('postcodeInput').value.trim(),
      address:             document.getElementById('addressInput').value.trim(),
      addressDetail:       document.getElementById('addressDetailInput').value.trim(),
      consent:             document.getElementById('consentInput').checked,
      marketingConsent:    document.getElementById('marketingInput').checked,
      partnershipConsent:  document.getElementById('partnershipInput').checked,
      // 메타 픽셀 서버 사이드 매칭용
      fbp:                 getCookie('_fbp'),
      fbc:                 getCookie('_fbc'),
    };

    try {
      await submitForm(payload);
      trackLead(typeValue);
      showSuccess(typeValue);
    } catch (err) {
      feedback.textContent = err.message || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      feedback.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      if (btnLabel) btnLabel.textContent = '이벤트 신청하기';
    }
  });

});

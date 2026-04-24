// ----------------------------------------------------------------
// foremong 어드민 연동 엔드포인트
// 개발자가 /api/uvid/uv-camera-event 생성 후 아래 주소로 교체
// ----------------------------------------------------------------
const FORM_ENDPOINT = 'https://register.foremong.com/api/uvid/uv-camera-event';


// ----------------------------------------------------------------
// 신청 유형 토글
// ----------------------------------------------------------------
function selectType(btn) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('typeInput').value = btn.textContent.trim();

  const isSNS = btn.textContent.includes('SNS형');
  document.querySelectorAll('.sns-field').forEach(function(field) {
    const input = field.querySelector('input');
    const label = field.querySelector('label');
    if (isSNS) {
      input.required = true;
      if (!label.querySelector('.req')) {
        label.insertAdjacentHTML('beforeend', '<span class="req">*</span>');
      }
    } else {
      input.required = false;
      input.value = '';
      clearFieldError(field.id.replace('field-', ''));
      const req = label.querySelector('.req');
      if (req) req.remove();
    }
  });
}


// ----------------------------------------------------------------
// 다음 주소검색 API
// ----------------------------------------------------------------
function searchAddress() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('postcodeInput').value = data.zonecode;
      document.getElementById('addressInput').value = data.roadAddress || data.jibunAddress;
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
  const field = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (field) field.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (field) field.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}


// ----------------------------------------------------------------
// 유효성 검사
// ----------------------------------------------------------------
function validateForm() {
  let isValid = true;

  ['name', 'tel', 'email', 'mallId', 'snsAccount', 'snsUrl', 'address', 'consent'].forEach(clearFieldError);

  const name     = document.getElementById('nameInput').value.trim();
  const tel      = document.getElementById('telInput').value.trim();
  const email    = document.getElementById('emailInput').value.trim();
  const mallId   = document.getElementById('mallIdInput').value.trim();
  const postcode = document.getElementById('postcodeInput').value.trim();
  const consent  = document.getElementById('consentInput').checked;
  const isSNS    = document.querySelector('.toggle-btn.active').textContent.includes('SNS형');

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

  if (!mallId) {
    setFieldError('mallId', '공식몰 아이디를 입력해 주세요.');
    isValid = false;
  }

  if (isSNS) {
    const snsAccount = document.getElementById('snsAccountInput').value.trim();
    const snsUrl     = document.getElementById('snsUrlInput').value.trim();

    if (!snsAccount) {
      setFieldError('snsAccount', 'SNS 계정을 입력해 주세요.');
      isValid = false;
    }
    if (!snsUrl) {
      setFieldError('snsUrl', 'SNS URL을 입력해 주세요.');
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(snsUrl)) {
      setFieldError('snsUrl', 'http:// 또는 https://로 시작하는 URL을 입력해 주세요.');
      isValid = false;
    }
  }

  if (!postcode) {
    setFieldError('address', '주소검색 버튼을 눌러 주소를 선택해 주세요.');
    isValid = false;
  }

  if (!consent) {
    setFieldError('consent', '개인정보 수집 및 이용에 동의해 주세요.');
    isValid = false;
  }

  return isValid;
}


// ----------------------------------------------------------------
// 쿠키 읽기 (Facebook 픽셀용)
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
// 완료 화면 표시 / 폼 초기화
// ----------------------------------------------------------------
function showSuccess(packageType) {
  document.getElementById('applicationForm').style.display = 'none';
  document.getElementById('successPackage').textContent = '신청 패키지: ' + packageType;
  document.getElementById('success-screen').style.display = 'flex';

  document.getElementById('main').style.display = 'none';
  document.getElementById('title').style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  const form = document.getElementById('applicationForm');
  form.reset();

  document.getElementById('typeInput').value = '참여형 (유비드 선패드 180일 패키지)';
  document.querySelectorAll('.toggle-btn').forEach((btn, i) => btn.classList.toggle('active', i === 0));

  document.querySelectorAll('.sns-field input').forEach(input => { input.required = false; });
  document.querySelectorAll('.sns-field label .req').forEach(el => el.remove());

  document.querySelectorAll('.field.error').forEach(f => f.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => { el.textContent = ''; });

  const feedback = document.getElementById('formFeedback');
  feedback.textContent = '';
  feedback.style.display = 'none';

  document.getElementById('success-screen').style.display = 'none';
  form.style.display = 'block';

  document.getElementById('main').style.display = '';
  document.getElementById('title').style.display = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ----------------------------------------------------------------
// 이벤트 바인딩
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

  // 전화번호 자동 하이픈
  document.getElementById('telInput').addEventListener('input', function() {
    formatPhone(this);
    clearFieldError('tel');
  });

  // 입력 시 해당 필드 에러 초기화
  ['nameInput', 'emailInput', 'mallIdInput', 'snsAccountInput', 'snsUrlInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function() {
      clearFieldError(id.replace('Input', ''));
    });
  });

  ['postcodeInput', 'addressDetailInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function() { clearFieldError('address'); });
  });

  document.getElementById('consentInput').addEventListener('change', function() {
    clearFieldError('consent');
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
    var feedback  = document.getElementById('formFeedback');
    submitBtn.disabled = true;
    submitBtn.textContent = '신청 중...';
    feedback.style.display = 'none';

    var packageType = document.getElementById('typeInput').value;

    // /api/uvid/uv-camera-event 필드
    var payload = {
      applicantName: document.getElementById('nameInput').value.trim(),
      contact:       document.getElementById('telInput').value.trim(),
      packageType:   packageType,
      consent:       document.getElementById('consentInput').checked,
      email:         document.getElementById('emailInput').value.trim(),
      mallId:        document.getElementById('mallIdInput').value.trim(),
      snsAccount:    document.getElementById('snsAccountInput').value.trim(),
      snsUrl:        document.getElementById('snsUrlInput').value.trim(),
      postcode:      document.getElementById('postcodeInput').value.trim(),
      address:       document.getElementById('addressInput').value.trim(),
      addressDetail: document.getElementById('addressDetailInput').value.trim(),
    };

    try {
      await submitForm(payload);
      showSuccess(packageType);
    } catch (err) {
      feedback.textContent = err.message || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      feedback.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '이벤트 신청하기';
    }
  });

});

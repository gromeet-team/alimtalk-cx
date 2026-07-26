# UVID UV 카메라 랜딩 CRO v2 — 디자인 보존

- 상태: 진행 중
- 기준: `a6abc08` 기존 랜딩
- 작업 브랜치: `feat/uvid-uv-camera-cro-preserve-design`
- 배포 원칙: Vercel Preview만 배포, 승인 전 프로덕션 금지

## 절대 조건

- 엘렌의 기존 디자인·레이아웃·타이포그래피를 변경하지 않는다.
- Pretendard는 동일 정적 폰트 파일의 사용 글리프 서브셋으로만 최적화한다.
- 이미지는 원본과 픽셀이 같은 lossless WebP만 사용한다.
- 기존 Meta Pixel `PageView`·신청 성공 후 `Lead` 흐름을 유지한다.

## 작업

- [x] Pretendard 5개 원본 weight를 동일 글리프의 로컬 subset WOFF2로 생성
- [x] `font-display: swap` 유지 및 기존 font-family/weight 보존
- [x] step/sunpad 이미지 lossless WebP 생성·픽셀 동일 검증
- [x] 기존 디자인 컴포넌트 안에서 신청폼을 3단계로 분리
- [x] sticky `지금 신청하기` CTA 추가
- [x] 카페 닉네임 선택 처리 및 완료·알림톡 사후 인증 안내
- [x] 무료 표현을 조건부 체험 문구로 정정
- [x] 기존 Vimeo 영상 프레임 기반 fallback 적용
- [x] 원본 대비 PC·모바일 시각 회귀 및 기능 검증
- [x] Vercel Preview 배포

## 검증 결과

- Preview: `https://alimtalk-1nu5habl3-gromeetceo-6165s-projects.vercel.app/event/uv-camera/index.html`
- 모바일 초기 전송량: 927KB
- Pretendard: 3,914,876B → 233,956B (94.0% 절감)
- 이미지: 원본 RGBA와 동일한 lossless WebP 7종
- 원본 대비 신청폼 이전 주요 섹션의 위치·높이·폰트·패딩 동일
- 모바일 가로 넘침·깨진 이미지·비-Vimeo 4xx 없음
- 카페 닉네임 공란으로 1→2→3단계 이동 확인
- 기존 API payload와 신청 성공 후 Meta `Lead` 순서 유지
- 프로덕션 배포 ID·별칭 미변경, 운영 URL 200 확인

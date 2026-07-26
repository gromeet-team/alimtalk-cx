# UVID UV 카메라 랜딩 CRO 프리뷰

- 상태: 진행 중
- 기준 브랜치: `main`
- 작업 브랜치: `feat/uvid-uv-camera-cro-preview`
- 배포 원칙: Vercel Preview만 배포하며, 사용자 승인 전 프로덕션 배포·별칭 변경 금지

## 목표

- 폰트·이미지 전송량을 줄여 초기 로딩 개선
- 신청폼 이탈 요인 제거 및 폼 이동 CTA 추가
- 조건부 체험임을 명확히 안내
- 회색으로 보이는 히어로 영상 실패 상태 보완

## 작업

- [x] Pretendard 동적 서브셋 적용 및 불필요한 5개 정적 폰트 제거
- [x] step/sunpad PNG를 WebP로 변환하고 문서 참조 변경
- [x] 동결단 카페 닉네임 선택 처리 및 개인정보 문구 정합성 수정
- [x] sticky `지금 신청하기` CTA 추가
- [x] 히어로·혜택·FAQ의 조건부 체험 문구 수정
- [x] 완료 화면에 `[UV인증]닉네임` 카페 업로드 안내 추가
- [x] 알림톡 운영 템플릿 위치 확인 및 가능한 범위 반영
- [x] Vimeo 실패 원인 확인 및 시각적 fallback 적용
- [x] PC·모바일·폼 검증 및 전송량 측정
- [x] Vercel Preview 배포 후 URL 공유

## 완료 기준

- 필수 신청 정보는 유지되고 카페 닉네임 없이 프론트 검증 통과
- sticky CTA가 폼으로 이동
- 미션·촬영·인증 조건이 히어로와 FAQ에서 명확함
- Vimeo 로드 실패 시에도 회색 빈 화면이 노출되지 않음
- 기존 PNG 대비 이미지 전송량 감소
- 프로덕션 URL과 별칭에 변경 없음

## 검증 결과

- Preview: `https://alimtalk-aztddhwci-gromeetceo-6165s-projects.vercel.app/event/uv-camera/index.html`
- 이미지: 820,526B → 85,280B (89.6% 절감)
- 브라우저 실측: 1st-party 79KB, 폰트 13KB, Vimeo 제외 351KB
- PC·모바일 깨진 이미지 0, 모바일 가로 넘침 0
- 카페 닉네임 공란 상태에서 나머지 필수값 입력 시 검증 통과
- sticky CTA 폼 이동 및 폼 구간 비노출·키보드 포커스 제외 확인
- Vimeo 준비 실패 시 제품 이미지 fallback 노출 확인
- 프로덕션 URL `https://event.uvid.co.kr/uv-camera` 200 응답 확인

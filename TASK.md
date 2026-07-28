# TASK.md — UVID UV카메라 신청 연결 단자 표기 변경
> 2026-07-28 | 신청자가 휴대폰 OS가 아니라 카메라 연결 단자를 선택하도록 고객 화면 문구를 정정한다.

## 목표

- 신청 3단계의 `아이폰 / 안드로이드` 표기를 `8핀 / C타입`으로 변경한다.
- 기존 API·과거 데이터·관리자 집계 호환성을 위해 radio value `iphone / android`는 유지한다.

## 레퍼런스

- 운영: https://event.uvid.co.kr/uv-camera
- 파일: `event/uv-camera/index.html`, `event/uv-camera/app.js`
- 현재 내부 값:
  - `value="iphone"`
  - `value="android"`

## 제약

- 수정 범위는 고객 신청 페이지의 표시·검증 문구로 한정한다.
- radio name/value와 제출 payload 스키마를 변경하지 않는다.
- 관리자 페이지·API·DB·기존 신청 데이터는 변경하지 않는다.
- 기존 사용자 변경사항을 건드리지 않는다.

## 태스크

### T1. 신청 기기 표기 변경 → frontend-dev

- 파일 소유권: `event/uv-camera/index.html`, `event/uv-camera/app.js`
- 의존: 없음
- 완료 기준:
  - [x] 필드 라벨을 연결 단자 선택 의미로 정정
  - [x] `아이폰` 표시를 `8핀`으로 변경
  - [x] `안드로이드` 표시를 `C타입`으로 변경
  - [x] 안내문·FAQ·개인정보 수집 문구를 연결 단자 기준으로 정정
  - [x] 미선택 오류 문구를 연결 단자 기준으로 정정
  - [x] radio value `iphone/android` 유지

## 검증

- [x] 변경 문자열과 기존 value 정적 검사
- [x] 모바일·PC 신청 3단계 UI 확인
- [x] 가로 넘침·브라우저 오류 없음
- [x] 최종 코드 리뷰
- [ ] Production 배포 및 운영 확인

# ICM Benchmarked Website - MVP Todo

## 핵심 기능 구현 목록:
1. **헤더 네비게이션** - 로고, 메인 메뉴 (ABOUT, ARTIST, NOTICE, ICM CLOUD), 언어 토글 (KOR/ENG), 소셜 링크
2. **히어로 섹션** - "REPUBLIC OF PASSION, ICM" 메인 비주얼과 스크롤 다운 인디케이터
3. **회사 소개 섹션** - ICM 뮤직 회사 소개 및 비전
4. **아티스트 섹션** - 소속 아티스트들의 그리드 레이아웃 (이미지, 이름, SNS 링크)
6. **공지사항 섹션** - 최신 공지사항 및 뉴스
8. **ICM 클라우드 섹션** - 클라우드 서비스 소개 및 링크
9. **푸터** - 연락처 정보, 개인정보처리방침, 저작권 정보


## Design Approach:
- Korean/English 버전 
- HOME 화면의 YOUTUBE 영상 주소 정보.
- CONTACT US의 이메일, 회사 주소 등의 정보.
- 도메인 주소 
- Artists 정보들 알아야함.
    - 사진, SNS 계정 등
- Notice / ICM CLOUD 의 DB 사용 및 관리자 페이지 필요 여부.
- 로고 디자인 사진 필요.

## Admin Page
- Notice 글쓰기 등록
- ICM CLOUD 글쓰기 등록
    - text editor 선택 및 글 내용 어떻게 할 지 정해야함.
- 메인페이지 배너 / 영상 관리
- 소셜미디어 피드 연동 관리
- Artists페이지 아티스트 프로필 수정

디자인 진행

1. 폰트 
 - 통일된 폰트
 - helvetica neue 폰트 적용 -> 완료.

2. Artists detail 뮤비 슬라이드 -> 완료.

3. MUSIX 삭제 -> 완료.

4. Notice 는 admin 페이지 만들 때 만들어야함.

5. 카페 24 퀵 스타트업 Pro로 호스팅

6. 인스타 계정은 api를 이용해야하는데 제한이 있으니 admin 페이지에서 관리 하도록 하자.

7. Notice 페이지 준비중 작업완료

8. 데이터셋 완료.
    - 홈 화면 Youtube 영상
    - 홈 화면 인스타 계정
    - Artists 정보들 전부.

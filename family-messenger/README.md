# 가족 메신저 PWA 📱

우리 가족만의 안전한 메신저 앱입니다. Firebase를 활용하여 실시간 채팅, 사진 공유, 위치 추적, 일정 관리, 음성 메시지 기능을 제공합니다.

## ✨ 주요 기능

- 🗨️ **실시간 채팅**: 가족들과 실시간으로 메시지를 주고받을 수 있습니다
- 📸 **사진첩**: 가족 사진을 업로드하고 공유할 수 있습니다
- 📍 **위치 공유**: GPS를 통해 가족 구성원의 위치를 실시간으로 확인할 수 있습니다
- 📅 **가족 일정**: 달력 형태로 가족 일정을 추가하고 관리할 수 있습니다
- 🎤 **음성 메시지**: 녹음한 음성을 메시지로 전송할 수 있습니다
- 🔒 **가족 코드 인증**: 코드를 아는 가족만 접근할 수 있어 안전합니다

## 🚀 빠른 시작

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다
2. "프로젝트 추가"를 클릭하여 새 프로젝트를 만듭니다
3. 프로젝트 이름을 입력합니다 (예: "family-messenger")
4. Google Analytics는 선택사항입니다 (필요시 활성화)

### 2. Firebase 웹 앱 등록

1. Firebase 콘솔에서 프로젝트 설정 > 일반으로 이동합니다
2. "앱 추가" 버튼을 클릭하고 웹(</>) 아이콘을 선택합니다
3. 앱 닉네임을 입력하고 "앱 등록"을 클릭합니다
4. Firebase SDK 구성 정보를 복사합니다

### 3. Firebase 서비스 활성화

#### Realtime Database 설정
1. Firebase 콘솔 > Build > Realtime Database로 이동
2. "데이터베이스 만들기" 클릭
3. 위치 선택 (예: us-central1)
4. 보안 규칙에서 "테스트 모드로 시작" 선택
5. 규칙을 다음과 같이 수정 (선택사항, 더 안전하게):
```json
{
  "rules": {
    "families": {
      "$familyCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

#### Storage 설정
1. Firebase 콘솔 > Build > Storage로 이동
2. "시작하기" 클릭
3. 보안 규칙에서 "테스트 모드로 시작" 선택
4. 완료 클릭

#### Authentication 설정
1. Firebase 콘솔 > Build > Authentication으로 이동
2. "시작하기" 클릭
3. Sign-in method 탭에서 "익명" 로그인 활성화

### 4. Firebase 설정 파일 업데이트

`app.js` 파일을 열고 Firebase 구성 정보를 업데이트합니다:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Firebase 콘솔에서 복사한 설정 정보로 각 값을 대체합니다.

### 5. 아이콘 생성

PWA가 제대로 작동하려면 다양한 크기의 아이콘이 필요합니다. 다음 방법 중 하나를 선택하세요:

#### 방법 1: 온라인 도구 사용 (추천)
1. [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) 방문
2. 제공된 `icons/icon.svg` 파일을 업로드
3. 모든 크기의 아이콘을 자동으로 생성
4. 다운로드한 아이콘을 `icons/` 폴더에 복사

#### 방법 2: 직접 만들기
원하는 디자인 도구(Figma, Canva 등)를 사용하여 다음 크기의 PNG 아이콘을 만듭니다:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

각 파일을 `icons/` 폴더에 `icon-[크기].png` 형식으로 저장합니다 (예: `icon-192x192.png`).

### 6. GitHub Pages 배포

이 프로젝트는 이미 GitHub Pages에 배포할 준비가 되어 있습니다!

#### GitHub Pages 활성화
1. GitHub 저장소로 이동
2. Settings > Pages로 이동
3. Source에서 "Deploy from a branch" 선택
4. Branch에서 현재 브랜치 선택
5. 폴더는 `/` (root) 또는 `/family-messenger` 선택
6. Save 클릭

#### 접속 URL
배포가 완료되면 다음 URL로 접속할 수 있습니다:
```
https://[username].github.io/family-messenger/
```

## 📱 사용 방법

### 첫 접속
1. 웹사이트에 접속합니다
2. 가족 코드를 입력합니다 (처음 방문 시 새로운 코드를 만들 수 있습니다)
3. 이름을 입력합니다
4. "입장하기" 버튼을 클릭합니다

### 채팅하기
1. 하단의 "채팅" 탭을 선택합니다
2. 메시지를 입력하고 전송 버튼을 클릭합니다
3. 마이크 아이콘을 클릭하여 음성 메시지를 녹음할 수 있습니다

### 사진 공유
1. 하단의 "사진첩" 탭을 선택합니다
2. "사진 업로드" 버튼을 클릭합니다
3. 갤러리에서 사진을 선택합니다
4. 업로드된 사진을 클릭하면 크게 볼 수 있습니다

### 위치 공유
1. 하단의 "위치" 탭을 선택합니다
2. "내 위치 공유" 버튼을 클릭합니다
3. 위치 권한을 허용합니다
4. 가족 구성원의 위치가 목록에 표시됩니다
5. "지도에서 보기"를 클릭하면 Google Maps에서 확인할 수 있습니다

### 일정 관리
1. 하단의 "일정" 탭을 선택합니다
2. "일정 추가" 버튼을 클릭합니다
3. 제목, 날짜, 시간, 설명을 입력합니다
4. "일정 추가" 버튼을 클릭합니다
5. 달력과 목록에서 일정을 확인할 수 있습니다

### PWA 설치 (홈 화면에 추가)

#### iOS (iPhone/iPad)
1. Safari로 웹사이트에 접속합니다
2. 공유 버튼(아래쪽 화살표)을 탭합니다
3. "홈 화면에 추가"를 선택합니다
4. 이름을 확인하고 "추가"를 탭합니다

#### Android
1. Chrome으로 웹사이트에 접속합니다
2. 메뉴(⋮)를 탭합니다
3. "홈 화면에 추가"를 선택합니다
4. 이름을 확인하고 "추가"를 탭합니다

또는 브라우저가 자동으로 설치 프롬프트를 표시할 수 있습니다.

## 🔒 보안 및 프라이버시

- **가족 코드 인증**: 코드를 아는 사람만 접근 가능합니다
- **Firebase 익명 인증**: 개인정보 없이 안전하게 사용할 수 있습니다
- **데이터 암호화**: Firebase는 전송 중인 모든 데이터를 암호화합니다
- **로컬 저장**: 가족 코드와 이름은 기기에만 저장됩니다

### 보안 강화 팁
1. 가족 코드는 복잡하게 설정하세요 (예: `family2024!secure`)
2. Firebase 보안 규칙을 더 엄격하게 설정하세요
3. 정기적으로 가족 코드를 변경하세요

## 💰 Firebase 무료 플랜 한도

Firebase Spark 플랜(무료)의 한도:

### Realtime Database
- 저장용량: 1GB
- 다운로드: 10GB/월
- 동시 연결: 100개

### Storage
- 저장용량: 5GB
- 다운로드: 1GB/일
- 업로드: 20,000회/일

### Authentication
- 익명 인증: 무제한

가족용으로 사용하기에는 충분한 용량입니다!

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase
  - Realtime Database (채팅, 일정)
  - Cloud Storage (사진, 음성)
  - Authentication (익명 인증)
- **PWA**: Service Worker, Web App Manifest
- **APIs**: Geolocation API, MediaRecorder API

## 🔧 문제 해결

### Firebase 연결 오류
- Firebase 설정 정보가 올바른지 확인하세요
- Firebase 서비스(Database, Storage, Authentication)가 모두 활성화되었는지 확인하세요
- 브라우저 콘솔에서 오류 메시지를 확인하세요

### 음성 녹음이 작동하지 않음
- 브라우저에서 마이크 권한을 허용했는지 확인하세요
- HTTPS 연결을 사용하고 있는지 확인하세요 (localhost 제외)

### 위치 공유가 작동하지 않음
- 브라우저에서 위치 권한을 허용했는지 확인하세요
- HTTPS 연결을 사용하고 있는지 확인하세요

### PWA 설치 옵션이 표시되지 않음
- HTTPS 연결을 사용하고 있는지 확인하세요
- manifest.json과 service-worker.js 파일이 올바르게 로드되는지 확인하세요
- 모든 필수 아이콘이 존재하는지 확인하세요

## 📝 라이선스

MIT License

## 🤝 기여

이슈나 풀 리퀘스트를 환영합니다!

## 📧 문의

문제가 있거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**가족과 함께하는 행복한 시간을 보내세요! ❤️**

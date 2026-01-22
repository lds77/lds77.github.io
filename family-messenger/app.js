// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyD1RZgCM0DCpm0KMXrSJfO6fC76lEiV-N8",
    authDomain: "family-messenger-63ffc.firebaseapp.com",
    databaseURL: "https://family-messenger-63ffc-default-rtdb.firebaseio.com/",
    projectId: "family-messenger-63ffc",
    storageBucket: "family-messenger-63ffc.firebasestorage.app",
    messagingSenderId: "218378501344",
    appId: "1:218378501344:web:945f84362e19a052aba485"
};

// Firebase 초기화
let app, database, storage, auth;
let currentUser = null;
let currentFamilyCode = null;
let mediaRecorder = null;
let audioChunks = [];

// Firebase 초기화 시도
try {
    app = firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    auth = firebase.auth();

    // Storage는 선택사항 (나중에 활성화 가능)
    try {
        storage = firebase.storage();
    } catch (storageError) {
        console.log('Storage는 현재 비활성화되어 있습니다. 사진첩과 음성 메시지 기능은 사용할 수 없습니다.');
        storage = null;
    }
} catch (error) {
    console.log('Firebase 초기화 실패:', error);
}

// DOM 요소
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const familyCodeInput = document.getElementById('family-code');
const userNameInput = document.getElementById('user-name');

// 탭 전환
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const headerTitle = document.getElementById('header-title');

// 채팅 요소
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const voiceRecordBtn = document.getElementById('voice-record-btn');
const voiceRecordingIndicator = document.getElementById('voice-recording-indicator');
const stopRecordingBtn = document.getElementById('stop-recording-btn');

// 사진첩 요소
const photoUploadBtn = document.getElementById('photo-upload-btn');
const photoUpload = document.getElementById('photo-upload');
const photosGrid = document.getElementById('photos-grid');

// 위치 공유 요소
const shareLocationBtn = document.getElementById('share-location-btn');
const locationsList = document.getElementById('locations-list');

// 일정 요소
const addScheduleBtn = document.getElementById('add-schedule-btn');
const calendarContainer = document.getElementById('calendar-container');
const scheduleList = document.getElementById('schedule-list');

// 모달 요소
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// 로그인 처리
loginBtn.addEventListener('click', async () => {
    const familyCode = familyCodeInput.value.trim();
    const userName = userNameInput.value.trim();

    if (!familyCode || !userName) {
        alert('가족 코드와 이름을 입력해주세요.');
        return;
    }

    try {
        // Firebase 익명 인증
        await auth.signInAnonymously();

        currentUser = {
            name: userName,
            id: auth.currentUser.uid
        };
        currentFamilyCode = familyCode;

        // 로컬 스토리지에 저장
        localStorage.setItem('familyCode', familyCode);
        localStorage.setItem('userName', userName);

        // 화면 전환
        loginScreen.classList.remove('active');
        appScreen.classList.add('active');

        // 데이터 로드
        loadMessages();
        loadPhotos();
        loadLocations();
        loadSchedules();
    } catch (error) {
        console.error('로그인 실패:', error);
        alert('로그인에 실패했습니다. Firebase 설정을 확인해주세요.');
    }
});

// 로그아웃
logoutBtn.addEventListener('click', () => {
    if (confirm('로그아웃 하시겠습니까?')) {
        auth.signOut();
        localStorage.removeItem('familyCode');
        localStorage.removeItem('userName');
        currentUser = null;
        currentFamilyCode = null;
        appScreen.classList.remove('active');
        loginScreen.classList.add('active');
    }
});

// 자동 로그인
window.addEventListener('load', async () => {
    const savedFamilyCode = localStorage.getItem('familyCode');
    const savedUserName = localStorage.getItem('userName');

    if (savedFamilyCode && savedUserName) {
        try {
            await auth.signInAnonymously();
            currentUser = {
                name: savedUserName,
                id: auth.currentUser.uid
            };
            currentFamilyCode = savedFamilyCode;
            loginScreen.classList.remove('active');
            appScreen.classList.add('active');
            loadMessages();
            loadPhotos();
            loadLocations();
            loadSchedules();
        } catch (error) {
            console.error('자동 로그인 실패:', error);
        }
    }
});

// 탭 전환
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // 모든 탭 비활성화
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));

        // 선택된 탭 활성화
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // 헤더 제목 변경
        const titles = {
            'chat': '채팅',
            'photos': '사진첩',
            'location': '위치 공유',
            'schedule': '일정'
        };
        headerTitle.textContent = titles[tabName];
    });
});

// === 채팅 기능 ===
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentUser || !currentFamilyCode) return;

    const messageData = {
        text: message,
        sender: currentUser.name,
        senderId: currentUser.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        type: 'text'
    };

    database.ref(`families/${currentFamilyCode}/messages`).push(messageData);
    messageInput.value = '';
}

function loadMessages() {
    if (!currentFamilyCode) return;

    const messagesRef = database.ref(`families/${currentFamilyCode}/messages`).limitToLast(50);

    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        displayMessage(message);
    });
}

function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === currentUser.id ? 'own' : 'other'}`;

    const time = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (message.type === 'voice') {
        messageDiv.innerHTML = `
            ${message.senderId !== currentUser.id ? `<div class="message-sender">${message.sender}</div>` : ''}
            <div class="message-bubble">
                <div class="voice-message">
                    <button onclick="playVoiceMessage('${message.audioUrl}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                    <span class="voice-duration">${message.duration || '0:00'}</span>
                </div>
            </div>
            <div class="message-time">${time}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            ${message.senderId !== currentUser.id ? `<div class="message-sender">${message.sender}</div>` : ''}
            <div class="message-bubble">${escapeHtml(message.text)}</div>
            <div class="message-time">${time}</div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 음성 녹음
voiceRecordBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await uploadVoiceMessage(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        voiceRecordingIndicator.classList.remove('hidden');
    } catch (error) {
        console.error('녹음 시작 실패:', error);
        alert('마이크 권한이 필요합니다.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        voiceRecordingIndicator.classList.add('hidden');
    }
}

async function uploadVoiceMessage(audioBlob) {
    if (!currentFamilyCode || !currentUser) return;

    if (!storage) {
        alert('음성 메시지 기능은 현재 사용할 수 없습니다.\nFirebase Storage 설정이 필요합니다.');
        return;
    }

    try {
        const timestamp = Date.now();
        const fileName = `voice_${timestamp}.webm`;
        const storageRef = storage.ref(`families/${currentFamilyCode}/voice/${fileName}`);

        await storageRef.put(audioBlob);
        const audioUrl = await storageRef.getDownloadURL();

        const messageData = {
            audioUrl: audioUrl,
            sender: currentUser.name,
            senderId: currentUser.id,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            type: 'voice',
            duration: '0:00'
        };

        database.ref(`families/${currentFamilyCode}/messages`).push(messageData);
    } catch (error) {
        console.error('음성 메시지 업로드 실패:', error);
        alert('음성 메시지 전송에 실패했습니다.');
    }
}

function playVoiceMessage(url) {
    const audio = new Audio(url);
    audio.play();
}

// === 사진첩 기능 ===
photoUploadBtn.addEventListener('click', () => {
    photoUpload.click();
});

photoUpload.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !currentFamilyCode || !currentUser) return;

    for (const file of files) {
        await uploadPhoto(file);
    }

    photoUpload.value = '';
});

async function uploadPhoto(file) {
    if (!storage) {
        alert('사진 업로드 기능은 현재 사용할 수 없습니다.\nFirebase Storage 설정이 필요합니다.');
        return;
    }

    try {
        const timestamp = Date.now();
        const fileName = `photo_${timestamp}_${file.name}`;
        const storageRef = storage.ref(`families/${currentFamilyCode}/photos/${fileName}`);

        await storageRef.put(file);
        const photoUrl = await storageRef.getDownloadURL();

        const photoData = {
            url: photoUrl,
            uploader: currentUser.name,
            uploaderId: currentUser.id,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref(`families/${currentFamilyCode}/photos`).push(photoData);
    } catch (error) {
        console.error('사진 업로드 실패:', error);
        alert('사진 업로드에 실패했습니다.');
    }
}

function loadPhotos() {
    if (!currentFamilyCode) return;

    const photosRef = database.ref(`families/${currentFamilyCode}/photos`).limitToLast(50);

    photosGrid.innerHTML = '';

    photosRef.on('child_added', (snapshot) => {
        const photo = snapshot.val();
        displayPhoto(photo);
    });
}

function displayPhoto(photo) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-item';

    const time = new Date(photo.timestamp).toLocaleDateString('ko-KR');

    photoDiv.innerHTML = `
        <img src="${photo.url}" alt="Family photo" loading="lazy">
        <div class="photo-info">
            <div>${photo.uploader}</div>
            <div>${time}</div>
        </div>
    `;

    photoDiv.addEventListener('click', () => {
        window.open(photo.url, '_blank');
    });

    photosGrid.insertBefore(photoDiv, photosGrid.firstChild);
}

// === 위치 공유 기능 ===
shareLocationBtn.addEventListener('click', shareLocation);

async function shareLocation() {
    if (!navigator.geolocation) {
        alert('위치 서비스를 지원하지 않는 브라우저입니다.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                user: currentUser.name,
                userId: currentUser.id,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            try {
                await database.ref(`families/${currentFamilyCode}/locations/${currentUser.id}`).set(locationData);
                alert('위치가 공유되었습니다!');
            } catch (error) {
                console.error('위치 공유 실패:', error);
                alert('위치 공유에 실패했습니다.');
            }
        },
        (error) => {
            console.error('위치 가져오기 실패:', error);
            alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
    );
}

function loadLocations() {
    if (!currentFamilyCode) return;

    const locationsRef = database.ref(`families/${currentFamilyCode}/locations`);

    locationsRef.on('value', (snapshot) => {
        locationsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const location = childSnapshot.val();
            displayLocation(location);
        });
    });
}

function displayLocation(location) {
    const locationDiv = document.createElement('div');
    locationDiv.className = 'location-item';

    const time = new Date(location.timestamp).toLocaleString('ko-KR');
    const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    locationDiv.innerHTML = `
        <div class="location-header">
            <div class="location-name">${location.user}</div>
            <div class="location-time">${time}</div>
        </div>
        <div class="location-coords">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</span>
        </div>
        <a href="${mapUrl}" target="_blank" class="location-link">지도에서 보기</a>
    `;

    locationsList.appendChild(locationDiv);
}

// === 일정 기능 ===
addScheduleBtn.addEventListener('click', showScheduleModal);

function showScheduleModal() {
    modalTitle.textContent = '일정 추가';
    modalBody.innerHTML = `
        <form id="schedule-form">
            <div class="form-group">
                <label>일정 제목</label>
                <input type="text" id="schedule-title" required>
            </div>
            <div class="form-group">
                <label>날짜</label>
                <input type="date" id="schedule-date" required>
            </div>
            <div class="form-group">
                <label>시간</label>
                <input type="time" id="schedule-time">
            </div>
            <div class="form-group">
                <label>설명</label>
                <textarea id="schedule-description"></textarea>
            </div>
            <button type="submit" class="primary-btn">일정 추가</button>
        </form>
    `;

    modal.classList.remove('hidden');

    document.getElementById('schedule-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addSchedule();
    });
}

async function addSchedule() {
    const title = document.getElementById('schedule-title').value.trim();
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const description = document.getElementById('schedule-description').value.trim();

    if (!title || !date) {
        alert('제목과 날짜는 필수입니다.');
        return;
    }

    const scheduleData = {
        title,
        date,
        time,
        description,
        creator: currentUser.name,
        creatorId: currentUser.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        await database.ref(`families/${currentFamilyCode}/schedules`).push(scheduleData);
        modal.classList.add('hidden');
        alert('일정이 추가되었습니다!');
    } catch (error) {
        console.error('일정 추가 실패:', error);
        alert('일정 추가에 실패했습니다.');
    }
}

function loadSchedules() {
    if (!currentFamilyCode) return;

    const schedulesRef = database.ref(`families/${currentFamilyCode}/schedules`).orderByChild('date');

    schedulesRef.on('value', (snapshot) => {
        scheduleList.innerHTML = '';
        const schedules = [];

        snapshot.forEach((childSnapshot) => {
            schedules.push(childSnapshot.val());
        });

        // 날짜순 정렬
        schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

        schedules.forEach(schedule => displaySchedule(schedule));

        // 캘린더 생성
        renderCalendar(schedules);
    });
}

function displaySchedule(schedule) {
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'schedule-item';

    const date = new Date(schedule.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    scheduleDiv.innerHTML = `
        <div class="schedule-date">${date} ${schedule.time || ''}</div>
        <div class="schedule-title">${escapeHtml(schedule.title)}</div>
        ${schedule.description ? `<div class="schedule-description">${escapeHtml(schedule.description)}</div>` : ''}
    `;

    scheduleList.appendChild(scheduleDiv);
}

function renderCalendar(schedules) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    let calendarHTML = `
        <div class="calendar">
            <div class="calendar-header">
                <div class="calendar-month">${year}년 ${monthNames[month]}</div>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-name">일</div>
                <div class="calendar-day-name">월</div>
                <div class="calendar-day-name">화</div>
                <div class="calendar-day-name">수</div>
                <div class="calendar-day-name">목</div>
                <div class="calendar-day-name">금</div>
                <div class="calendar-day-name">토</div>
    `;

    // 빈 칸 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = schedules.some(s => s.date === dateStr);
        const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                ${day}
            </div>
        `;
    }

    calendarHTML += '</div></div>';
    calendarContainer.innerHTML = calendarHTML;
}

// 모달 닫기
modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// 유틸리티 함수
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// PWA 설치 프롬프트
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // 설치 안내 표시 (선택사항)
    console.log('PWA 설치 가능');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA 설치 완료');
    deferredPrompt = null;
});

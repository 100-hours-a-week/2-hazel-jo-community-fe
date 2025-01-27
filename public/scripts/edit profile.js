import { editProfile } from '../api/user-api.js';
import { withdrawUser } from '../api/user-api.js';
import { resizeImage, centerImage } from '../utils/imageUtils.js';
import { API_URLS } from '../utils/config.js';
import { redirectLogin } from '../utils/redirectLogin.js';
const baseUrl = API_URLS.base;

const { 
    profileBtn, 
    profileInput, 
    imgTag, 
    profileMark, 
    editBtn, 
    nicknameInput, 
    helperText, 
    toastMessage, 
    confirmBtn, 
    withdrawBtn, 
    modalOverlay, 
    cancelBtn,
    emailInput 
} = {
    profileBtn: document.querySelector('.profile-image'),
    profileInput: document.querySelector('#profile-input'),
    imgTag: document.querySelector('.profile-image img'),
    profileMark: document.querySelector('.profile-mark'), 
    editBtn: document.querySelector('.edit-btn'),
    nicknameInput: document.querySelector('.nickname-input'),
    helperText: document.querySelector('.helper-text'),
    toastMessage: document.querySelector('.toast-message'),
    confirmBtn: document.querySelector('#confirmBtn'),
    withdrawBtn: document.querySelector('#withdrawBtn'),
    modalOverlay: document.querySelector('#modalOverlay'),
    cancelBtn: document.querySelector('#cancelBtn'),
    emailInput: document.querySelector('#userEmail'),
}

// 유효성 검사 여부 확인
let isValid = {
    image: false,
    nickname: false,
    email: false
};

// 모든 유효성 검사 통과 여부 확인
const check_all = () => {
    const isAllValid = Object.values(isValid).every(value => value);
    editBtn.disabled = !isAllValid;
    return isAllValid;
}

profileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const previewImage = document.getElementById('preview-image');
    
    // 파일 선택을 취소한 경우
    if (!file) {
        // 변경 전 프로필 이미지가 있으면 복원 / 기본 이미지 사용 
        if (currentImage) {
            previewImage.src = currentImage;
            profileBtn.style.backgroundImage = `url(${currentImage})`;
        } else {
            previewImage.src = '/image/basic.png';
            profileBtn.style.backgroundImage = 'url("/image/basic.png")';
        }
        changeImage = false;
        isValid.image = true;
        check_all();
        return;
    }
    
    try {
        const resizedImageUrl = await resizeImage(file);
        profileBtn.style.backgroundImage = `url(${resizedImageUrl})`;
        previewImage.src = resizedImageUrl;
        
        // 이미지 가운데 정렬
        const img = new Image();
        centerImage(img, imgTag);
        img.src = resizedImageUrl;
        
        changeImage = true;
        isValid.image = true;
        check_all();
    } catch (error) {
        console.error('이미지 리사이징 오류', error);
        
        // 에러 발생 시 기본 이미지로 복원
        previewImage.src = '/image/basic.png';
        profileBtn.style.backgroundImage = 'url("/image/basic.png")';
        isValid.image = true;
        check_all();
    }
    profileMarkCheck(); 

});

// 닉네임 유효성 검사 
nicknameInput.addEventListener('input', () => {
    if(nicknameInput.value.length === 0) {
        helperText.textContent = '*닉네임을 입력해주세요.';
        isValid.nickname = false;
    } else if (nicknameInput.value.length >= 11) {
        helperText.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
        isValid.nickname = false;
    } else {
        helperText.textContent = ''; 
        isValid.nickname = true;
    }
    check_all();
});

// 닉네임 유효성 검사 성공 시 토스트 메시지 표시
const nicknameValid = () => {
    toastMessage.style.visibility = 'visible';
    // 1초 후 토스트 메시지 숨기고 게시글 목록 페이지로 이동
    setTimeout(() => {
        toastMessage.style.visibility = 'hidden';
        window.location.href = '/page/Posts.html?refresh=true';
    }, 1000);
}

// 이메일 입력 검사 
emailInput.addEventListener('input', () => {
    const emailValue = emailInput.value.trim(); 
    if(emailValue === '') {
        isValid.email = false; 
    } else {
        isValid.email = true; 
    }
    check_all(); 
});


// 프로필 수정 
let changeImage = false; 
let currentImage = profileBtn.style.backgroundImage;
const handleEditProfile = async () => {
    try {
        const email = emailInput.value.trim();
        const nickname = nicknameInput.value.trim();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('nickname', nickname);
        if (changeImage && profileInput.files.length > 0) {
            formData.append('profileImage', profileInput.files[0]);
        }
        const result = await editProfile(formData); 

        // 서버에서 받은 이미지 경로로 업데이트
        if (result && result.user) {  
            const { profileImage, nickname, email } = result.user; 
            
            if (profileImage) {
                const newImageUrl = `${baseUrl}${profileImage}`;
                localStorage.setItem('profileImage', newImageUrl);
                profileBtn.style.backgroundImage = `url(${newImageUrl})`;
                currentImage = newImageUrl; 

                // 네비게이션 바의 프로필 이미지 업데이트
                const navProfileImage = document.querySelector('.login-icon img');
                if (navProfileImage) {
                    navProfileImage.src = newImageUrl;
                } 
            }
            
            if(nickname) {
                localStorage.setItem('nickname', nickname);
                nicknameInput.value = nickname;
            }

            if(email) {
                localStorage.setItem('email', email);
                emailInput.value = email; 
            }
        }
        nicknameValid();
        
    } catch (error) {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정에 실패했습니다: ' + error.message);
    }
}

editBtn.addEventListener('click', handleEditProfile);

// 회원 탈퇴 처리
const successWithdraw = async () => {   
    try {
        
        // API 호출이 완료될 때까지 대기
        await withdrawUser();
        modalOverlay.style.display = 'none';  
        
    } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        //alert('회원 탈퇴에 실패했습니다.');
    }
}

// 프로필 업로드 시 마크 제거 
const profileMarkCheck = () => {
    profileMark.style.display = profileInput.files[0] ? 'none' : 'inline';
}

// 회원 탈퇴 버튼 이벤트
confirmBtn.addEventListener('click', successWithdraw);


// 모달창 이벤트 리스너 
withdrawBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

// 페이지 로드 시 사용자 정보 가져오기
const loadUserInfo = async () => {
    try {
        const userEmail = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const storedNickname = localStorage.getItem('nickname');

        if(!userId) {
            redirectLogin(); 
            return; 
        }

        const url = `${baseUrl}/users/profile/${userId}`; 

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            if(response.status === 401 || response.status === 404) {
                window.location.href = '/page/Log in.html';
                return; 
            } 
            throw new Error(`HTTP error! status: ${response.status}`);    
        }

        const userData = await response.json();
        
        if(emailInput) {
            emailInput.value = userEmail || '';
            isValid.email = !!userEmail; 
        }
        
        // 프로필 이미지 설정
        const previewImage = document.getElementById('preview-image');
        let imageUrl;

        // 프로필 이미지 확인
        if (userData.user.profileImage) {
            imageUrl = `${baseUrl}${userData.user.profileImage}`;
        } else {
            imageUrl = '/image/basic.png';
        }

        // 미리보기 이미지 설정
        if (previewImage) {
            previewImage.src = imageUrl;
        }

        // 버튼 배경 이미지 설정
        profileBtn.style.backgroundImage = `url(${imageUrl})`;

        // 현재 이미지와 유효성 플래그 갱신
        currentImage = imageUrl;
        isValid.image = true;
        
        // 닉네임 설정
        if (userData.nickname || storedNickname) {
            nicknameInput.value = userData.nickname || storedNickname;
            isValid.nickname = true;
        }
        
        check_all();
        
    } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        redirectLogin(); 
    }
} 

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadUserInfo);


import { logoutUser } from '../api/user-api.js';

const { optionEditProfile, optionEditPassword, optionLogout } = {
    optionEditProfile: document.querySelector('#editProfile'),
    optionEditPassword: document.querySelector('#editPassword'),
    optionLogout: document.querySelector('#logout'),
};

// 드롭다운 메뉴 선택 시 이동
const dropdownMenu = () => {
    optionEditProfile.addEventListener('click', () => {
        location.href = '/page/edit profile.html';
    });
    optionEditPassword.addEventListener('click', () => {
        
        location.href = '/page/edit password.html';
    });
    optionLogout.addEventListener('click', () => {
        logoutUser();
        clearLocalStorage();
        location.href = '/page/Log in.html';
    });
}

// 프로필 이미지 설정
export const setProfileImage = () => {
    const profileImage = document.querySelector('.login-icon img');
    let userProfileImage = localStorage.getItem('profileImage');
    console.log('저장된 프로필 이미지 URL:', userProfileImage);

    if (userProfileImage && userProfileImage !== 'null' && userProfileImage !== 'undefined') {
        if (!userProfileImage.startsWith('http')) {
            userProfileImage = `http://localhost:5000${userProfileImage}`;
        }

        profileImage.onerror = () => {
            console.error('이미지 로드 실패:', userProfileImage);
            profileImage.src = '/image/basic.png';
        };

        profileImage.onload = () => {
            console.log('이미지 로드 성공');
        };

        profileImage.src = userProfileImage;
    } else {
        profileImage.src = '/image/basic.png';
    }
}

// 로그아웃 시 로컬 스토리지 초기화
export const clearLocalStorage = () => {
    localStorage.clear();
}


dropdownMenu();
setProfileImage();




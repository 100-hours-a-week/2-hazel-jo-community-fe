const optionEditProfile = document.querySelector('#editProfile');
const optionEditPassword = document.querySelector('#editPassword');
const optionLogout = document.querySelector('#logout');

function dropdownMenu() {
    optionEditProfile.addEventListener('click', () => {
        location.href = '/page/edit profile.html';
    });
    optionEditPassword.addEventListener('click', () => {
        location.href = '/page/edit password.html';
    });
    optionLogout.addEventListener('click', () => {
        location.href = '/page/Log in.html';
    });
}

function setProfileImage() {
    const profileImage = document.querySelector('.login-icon img');
    let userProfileImage = localStorage.getItem('profileImage');

    console.log('저장된 프로필 이미지 URL:', userProfileImage);

    if(userProfileImage && userProfileImage !== 'null') {
        // localhost:3000을 localhost:5000으로 변경
        userProfileImage = userProfileImage.replace('http://localhost:3000', 'http://localhost:5000');
        
        profileImage.onerror = function() {
            console.error('이미지 로드 실패:', userProfileImage);
            profileImage.src = '/image/basic.png';
        };
        
        profileImage.onload = function() {
            console.log('이미지 로드 성공');
        };
        
        profileImage.src = userProfileImage;
    } else {
        profileImage.src = '/image/basic.png';
    }
}

dropdownMenu();
setProfileImage();



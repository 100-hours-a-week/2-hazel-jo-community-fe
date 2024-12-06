import { editPassword } from '../api/user-api.js';
import { passwordCheck } from '../utils/validationUtils.js';

const { password, confirmPassword, toastMessage, confirmHelperText, changeBtn } = {
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("password-check"),
    toastMessage: document.querySelector('.toast-message'),
    confirmHelperText: document.getElementById("confirm-helperTxt"),
    changeBtn: document.getElementById("change-button"),
};

// 비밀번호 확인 검사 함수
const confirmPasswordCheck = () => {
    if(confirmPassword.value === '') {
        confirmHelperText.textContent = "*비밀번호를 한번 더 입력해주세요";
        return false;
    }
    
    if(password.value !== confirmPassword.value) {
        confirmHelperText.textContent = "*비밀번호와 다릅니다";
        return false;
    }
    
    confirmHelperText.textContent = "";
    return true;
}

// 수정 완료 토스트 메시지 
const passWordValid = () => {
    toastMessage.style.visibility = 'visible';
    // 1초 후 토스트 메시지 사라지게 하기 
    setTimeout(() => {
        toastMessage.style.visibility = 'hidden';
        window.location.href = '/page/Log in.html';
    }, 1000);
}

// 수정완료 버튼 클릭 이벤트 리스너
changeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if(passwordCheck(password.value) && confirmPasswordCheck()) {
        try {
            await editPassword(password.value);
            
            passWordValid();
            
            password.value = '';
            confirmPassword.value = '';
            
        } catch (error) {
            alert(error.message || '비밀번호 변경에 실패했습니다.');
            console.error('비밀번호 변경 에러:', error);
        }
    }
});

// 버튼 상태 업데이트 함수
const updateButtonState = () => {
    if(passwordCheck(password.value) && confirmPasswordCheck()) {
        changeBtn.style.backgroundColor = '#7F6AEE';
    } else {
        changeBtn.style.backgroundColor = '#ACA0EB';   
    }
}

// 패스워드 입력 이벤트 리스너
password.addEventListener("input", (event) => {
    passwordCheck(event.target.value);
    if(confirmPassword.value !== '') {
        confirmPasswordCheck();
    }
    updateButtonState(); 
});

// 패스워드 확인 입력 이벤트 리스너
confirmPassword.addEventListener("input", (event) => {
    confirmPasswordCheck(event.target.value);
    updateButtonState(); 
});

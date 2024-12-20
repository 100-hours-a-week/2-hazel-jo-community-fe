import { editPassword } from '../api/user-api.js';

const { password, confirmPassword, helperText, toastMessage, confirmHelperText, changeBtn } = {
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("password-check"),
    helperText: document.getElementById("helperTxt"),
    toastMessage: document.querySelector('.toast-message'),
    confirmHelperText: document.getElementById("confirm-helperTxt"),
    changeBtn: document.getElementById("change-button"),
};


// 비밀번호 유효성 검사 함수
const passwordCheck = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,20}$/;
    password = password.trim();
    
    if(password === '') {
        helperText.textContent = "*비밀번호를 입력해주세요";
        return false;
    }
    
    else if (!passwordRegex.test(password)) {
        helperText.textContent = "*비밀번호는 8-20자의 대소문자, 숫자, 특수문자를 포함해야 합니다";
        return false;
    }
    
    else if(confirmPassword.value !== '' && password !== confirmPassword.value) {
        helperText.textContent = "*비밀번호 확인과 다릅니다";
        return false;
    }
    
    helperText.textContent = "";
    return true;
}

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

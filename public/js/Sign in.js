import { signupUser } from "../api/auth-api.js"; 
import { resizeImage } from "../utils/imageUtils.js";

// DOM 요소 선택 함수 
const selectDom = (selector) => document.querySelector(selector);

const password = selectDom(".password");
const confirmPassword = selectDom(".password-check");
const signupButton = selectDom(".signup-button"); 

// 헬퍼 텍스트 
const profileHelperText = selectDom("#profileHelperTxt");
const emailHelperText = selectDom("#emailHelperTxt");
const pwHelperText = selectDom("#passwordHelperTxt");
const confirmPwHelperText = selectDom("#confirmPasswordHelperTxt");
const nicknameHelperText = selectDom("#nicknameHelperTxt");

// input 입력 유무 표시 마크 
const emailMark = selectDom('.email-mark');
const passwordMark = selectDom('.password-mark');
const confirmPasswordMark = selectDom('.password-check-mark');
const nicknameMark = selectDom('.nickname-mark');
const profileMark = selectDom('.profile-mark');

// 프로필 이미지 
const profileBtn = selectDom('.profile-image');
const profileInput = selectDom('#profile-input');



// 이메일 유효성 검사 
const emailCheck = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 입력 받은 이메일 앞 뒤 공백 제거 
    email = email.trim(); 
    
    if (email === "") {
        emailHelperText.textContent = "*이메일을 입력해주세요.";
        return false; 
    } else if (email.length < 5 || !emailRegex.test(email)) {
        emailFormatCheck();
        return false; 
    } else{
        // 이메일 중복 체크 API 호출 추가 예정 
        checkEmail(email);
        correctFormat("emailHelperTxt");
        return true; 
    }
}

// 이메일 중복 체크 함수
const checkEmail = (email) => {
    // 이메일 중복 체크 API 호출 추가 예정 
}

// 비밀번호 유효성 검사
const passwordCheck = (passWord) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;

    // 입력 받은 비밀번호 앞 뒤 공백 제거
    passWord = passWord.trim();

    // 비밀번호가 유효하지 않음 
    if(passWord === '') {
        pwHelperText.textContent = "*비밀번호를 입력해주세요";
        return false; 
    } else if(!passwordRegex.test(passWord)) {
        passwordFormatCheck(); 
        return false; 
    } else {
        correctFormat("passwordHelperTxt");
        if(confirmPassword.value !== '') {
            confirmPasswordCheck(confirmPassword.value);
            return true; 
        }
    }
}

// 비밀번호 확인 유효성 검사
const confirmPasswordCheck = (confirmPw) => {
    if(confirmPw === '') {
        confirmPwHelperText.textContent = "*비밀번호를 한번더 입력해주세요";
        return false; 
    } else if(confirmPw !== password.value.trim()) {
        confirmPwHelperText.textContent = "*비밀번호가 다릅니다."
        return false; 
    } else {
        correctFormat("confirmPasswordHelperTxt");
        return true; 
    }
}

// 닉네임 유효성 검사
const nicknameCheck = (nickname) => {
    // 입력 받은 닉네임 앞 뒤 공백 제거
    nickname = nickname.trim();

    if (nickname === "") {
        nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
        return false; 
    } else if (nickname.includes(" ")) {
        nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
        return false; 
    } else if (nickname.length > 10) {
        nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        return false; 
    } else {
        // 닉네임 중복 체크 API 호출 추가 예정 
        checkNickname(nickname);
        correctFormat("nicknameHelperTxt");
        return true; 
    }
}

const checkNickname = (nickname) => {
    // 닉네임 중복 체크 API 호출 추가 예정 
}

// 이메일 유효성 검사 통과 못할 시 오류 메시지
const emailFormatCheck = () => {
    emailHelperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
}

// 비밀번호 유효성 검사 통과 못할 시 오류 메시지
const passwordFormatCheck = () => {
    pwHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
}

// 닉네임 유효성 검사 통과 못할 시 오류 메시지
const nicknameFormatCheck = () => {
    nicknameHelperText.textContent = "*닉네임은 2자 이상, 10자 이하의 영문자와 숫자만 가능합니다.";
}

// 유효성 검사 통과 시 헬퍼 텍스트 제거 
const correctFormat = (elementId) => {
    document.getElementById(elementId).textContent = "";
}

// 프로필 사진 업로드 확인
profileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
        profileHelperText.textContent = "*프로필 사진을 추가해주세요.";
        // 파일 선택 취소 시 이미지 초기화 
        profileBtn.style.backgroundImage = ''; 
        // input값 초기화
        profileInput.value = '';
    } else {
        try {
            const resizedImageUrl = await resizeImage(file);
            profileBtn.style.backgroundImage = `url(${resizedImageUrl})`;
            profileHelperText.textContent = "";
            
        } catch (error) {
            console.error('이미지 리사이징 오류', error);
        }
    }
    markCheck(); // 파일 변경 시 마크 체크
    updateButtonState();
});

// 버튼 상태 업데이트 
const updateButtonState = () => {
    const helperValid = Object.values(elements.helperTexts).every(
        (helperText) => helperText.textContent.trim() === ""
    );
    elements.signupButton.style.backgroundColor = helperValid ? "#7F6AEE" : "#ACA0EB";
}

// 버튼 클릭시 회원가입 요청 
signupButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const passwordValue = password.value; 
    const profileImage = profileInput.files[0];

    if(emailCheck(email) && passwordCheck(passwordValue) && confirmPasswordCheck(confirmPassword.value) && nicknameCheck(nickname)) {
        try {
            const result = await signupUser(email, nickname, passwordValue, profileImage);
            console.log('회원가입 전체 응답:', result);

            if (result && result.user) {
                console.log('회원가입 사용자 정보:', result.user);
                
                // userId로 체크 변경
                if (result.user.userId) {
                    localStorage.setItem('userId', String(result.user.userId));
                    localStorage.setItem('email', result.user.email);
                    localStorage.setItem('nickname', result.user.nickname);
                    
                    if (result.user.profileImage) {
                        const BACKEND_URL = 'http://localhost:5000';
                        const imageUrl = `${BACKEND_URL}${result.user.profileImage}`;
                        localStorage.setItem('profileImage', imageUrl);
                    }

                    alert('회원가입이 완료되었습니다.');
                    window.location.href = '/public/page/login';
                } else {
                    console.error('사용자 ID 없음:', result.user);
                    throw new Error('사용자 ID가 없습니다.');
                }
            } else {
                console.error('사용자 정보 없음:', result);
                throw new Error('서버 응답에 사용자 정보가 없습니다.');
            }
        } catch (error) {
            console.error('회원가입 처리 중 오류:', error);
            alert(error.message || '회원가입 중 오류가 발생했습니다.');
        }
    }
});

// input 유무 체크 마크 
const markCheck = () => {
    if(email.value.length > 0) {
        emailMark.style.display = 'none';
    } else {
        emailMark.style.display = 'inline';
    }

    if(password.value.length > 0) {
        passwordMark.style.display = 'none';
    } else {
        passwordMark.style.display = 'inline';
    }

    if(confirmPassword.value.length > 0) {
        confirmPasswordMark.style.display = 'none';
    } else {
        confirmPasswordMark.style.display = 'inline';
    }

    if(nickname.value.length > 0) {
        nicknameMark.style.display = 'none';
    } else {
        nicknameMark.style.display = 'inline'; 
    }

    if(profileInput.files[0]) {
        profileMark.style.display = 'none';
    } else {
        profileMark.style.display = 'inline';
    }
}

// 이메일 이벤트 리스너
document.getElementById('email').addEventListener("input", (e) => {
    markCheck();
    emailCheck(e.target.value);
    updateButtonState();
});

// 닉네임 이벤트 리스너 
document.getElementById('nickname').addEventListener("input", (e) => {
    markCheck();
    nicknameCheck(e.target.value);
    updateButtonState();
});

// 비밀번호 이벤트 리스너 
password.addEventListener("input", (e) => {
    markCheck();
    passwordCheck(e.target.value);
    if(confirmPassword.value !== '') {
        confirmPasswordCheck(confirmPassword.value);
    }
    updateButtonState(); 
});
 
// 비밀번호 확인 이벤트 리스너 
confirmPassword.addEventListener("input", (e) => {
    markCheck();
    confirmPasswordCheck(e.target.value);
    updateButtonState(); 
});

window.emailCheck = emailCheck;




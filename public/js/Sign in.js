import { signupUser } from "../api/auth-api.js"; 
import { resizeImage } from "../utils/imageUtils.js";
import { validateEmail, validatePassword, validateConfirmPassword, validateNickname } from "../utils/validationUtils.js";

// DOM 요소 선택 함수 
const selectDom = (selector) => document.querySelector(selector);
const selectAll = (selectors) => 
    Object.fromEntries(Object.entries(selectors).map(([key, value]) => [key, selectDom(value)]));

const elements = {
    password: selectDom(".password"),
    confirmPassword: selectDom(".password-check"),
    signupButton: selectDom(".signup-button"),
    helperTexts: selectAll({
        email: "#emailHelperTxt",
        password: "#passwordHelperTxt",
        confirmPassword: "#confirmPasswordHelperTxt",
        nickname: "#nicknameHelperTxt",
        profile: "#profileHelperTxt",
    }),
    marks: selectAll({
        email: ".email-mark",
        password: ".password-mark",
        confirmPassword: ".password-check-mark",
        nickname: ".nickname-mark",
        profile: ".profile-mark",
    }),
    profile: selectAll({
        button: ".profile-image",
        input: "#profile-input",
    }),
    inputs: selectAll({
        email: "#email",
        nickname: "#nickname",
    }),
};



// 이메일 유효성 검사 
const emailCheck = (email) => {
    const result = validateEmail(email);
    elements.helperTexts.email.textContent = result.message;
    if (result.isValid) {
        checkEmail(email);
    }
    return result.isValid;
}

// 이메일 중복 체크 함수
const checkEmail = (email) => {
    // 이메일 중복 체크 API 호출 추가 예정 
}

// 비밀번호 유효성 검사
const passwordCheck = (password) => {
    const result = validatePassword(password);
    elements.helperTexts.password.textContent = result.message;
    
    if (result.isValid && elements.confirmPassword.value !== '') {
        confirmPasswordCheck(elements.confirmPassword.value);
    }
    return result.isValid;
}

// 비밀번호 확인 유효성 검사
const confirmPasswordCheck = (confirmPw) => {
    const result = validateConfirmPassword(elements.password.value, confirmPw);
    elements.helperTexts.confirmPassword.textContent = result.message;
    return result.isValid;
}

// 닉네임 유효성 검사
const nicknameCheck = (nickname) => {
    const result = validateNickname(nickname);
    elements.helperTexts.nickname.textContent = result.message;
    if (result.isValid) {
        checkNickname(nickname);
    }
    return result.isValid;
}

const checkNickname = (nickname) => {
    // 닉네임 중복 체크 API 호출 추가 예정 
}

// 유효성 검사 통과 시 헬퍼 텍스트 제거 
const correctFormat = (element) => {
    if(element) {
        element.textContent = "";
    }
}

// 프로필 사진 업로드 확인
elements.profile.input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
        elements.helperTexts.profile.textContent = "*프로필 사진을 추가해주세요.";
        // 파일 선택 취소 시 이미지 초기화 
        elements.profile.button.style.backgroundImage = ''; 
        // input값 초기화
        elements.profile.input.value = '';
    } else {
        try {
            const resizedImageUrl = await resizeImage(file);
            elements.profile.button.style.backgroundImage = `url(${resizedImageUrl})`;
            elements.helperTexts.profile.textContent = "";
            
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
elements.signupButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const email = elements.inputs.email.value;
    const nickname = elements.inputs.nickname.value;
    const passwordValue = elements.password.value; 
    const profileImage = elements.profile.input.files[0];

    if(emailCheck(email) && passwordCheck(passwordValue) && confirmPasswordCheck(elements.confirmPassword.value) && nicknameCheck(nickname)) {
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
    if(elements.inputs.email.value.length > 0) {
        elements.marks.email.style.display = 'none';
    } else {
        elements.marks.email.style.display = 'inline';
    }

    if(elements.password.value.length > 0) {
        elements.marks.password.style.display = 'none';
    } else {
        elements.marks.password.style.display = 'inline';
    }

    if(elements.confirmPassword.value.length > 0) {
        elements.marks.confirmPassword.style.display = 'none';
    } else {
        elements.marks.confirmPassword.style.display = 'inline';
    }

    if(elements.inputs.nickname.value.length > 0) {
        elements.marks.nickname.style.display = 'none';
    } else {
        elements.marks.nickname.style.display = 'inline'; 
    }

    if(elements.profile.input.files[0]) {
        elements.marks.profile.style.display = 'none';
    } else {
        elements.marks.profile.style.display = 'inline';
    }
}

// 이메일 이벤트 리스너
elements.inputs.email.addEventListener("input", (e) => {
    markCheck();
    emailCheck(e.target.value);
    updateButtonState();
});

// 닉네임 이벤트 리스너 
elements.inputs.nickname.addEventListener("input", (e) => {
    markCheck();
    nicknameCheck(e.target.value);
    updateButtonState();
});

// 비밀번호 이벤트 리스너 
elements.password.addEventListener("input", (e) => {
    markCheck();
    passwordCheck(e.target.value);
    if(elements.confirmPassword.value !== '') {
        confirmPasswordCheck(elements.confirmPassword.value);
    }
    updateButtonState(); 
});
 
// 비밀번호 확인 이벤트 리스너 
elements.confirmPassword.addEventListener("input", (e) => {
    markCheck();
    confirmPasswordCheck(e.target.value);
    updateButtonState(); 
});

window.emailCheck = emailCheck;




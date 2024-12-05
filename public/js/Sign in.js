import { signupUser } from "../api/auth-api.js"; 
import { resizeImage } from "../utils/imageUtils.js";

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
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 입력 받은 이메일 앞 뒤 공백 제거 
    email = email.trim(); 
    
    if (email === "") {
        elements.helperTexts.email.textContent = "*이메일을 입력해주세요.";
        return false; 
    } else if (email.length < 5 || !emailRegex.test(email)) {
        emailFormatCheck();
        return false; 
    } else{
        // 이메일 중복 체크 API 호출 추가 예정 
        checkEmail(email);
        correctFormat(elements.helperTexts.email);
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
        elements.helperTexts.password.textContent = "*비밀번호를 입력해주세요";
        return false; 
    } else if(!passwordRegex.test(passWord)) {
        passwordFormatCheck(); 
        return false; 
    } else {
        correctFormat(elements.helperTexts.password);
        if(elements.confirmPassword.value !== '') {
            confirmPasswordCheck(elements.confirmPassword.value);
            return true; 
        }
    }
}

// 비밀번호 확인 유효성 검사
const confirmPasswordCheck = (confirmPw) => {
    if(confirmPw === '') {
        elements.helperTexts.confirmPassword.textContent = "*비밀번호를 한번더 입력해주세요";
        return false; 
    } else if(confirmPw !== elements.password.value.trim()) {
        elements.helperTexts.confirmPassword.textContent = "*비밀번호가 다릅니다."
        return false; 
    } else {
        correctFormat(elements.helperTexts.confirmPassword);
        return true; 
    }
}

// 닉네임 유효성 검사
const nicknameCheck = (nickname) => {
    // 입력 받은 닉네임 앞 뒤 공백 제거
    nickname = nickname.trim();

    if (nickname === "") {
        elements.helperTexts.nickname.textContent = "*닉네임을 입력해주세요.";
        return false; 
    } else if (nickname.includes(" ")) {
        elements.helperTexts.nickname.textContent = "*띄어쓰기를 없애주세요.";
        return false; 
    } else if (nickname.length > 10) {
        elements.helperTexts.nickname.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        return false; 
    } else {
        // 닉네임 중복 체크 API 호출 추가 예정 
        checkNickname(nickname);
        correctFormat(elements.helperTexts.nickname);
        return true; 
    }
}

const checkNickname = (nickname) => {
    // 닉네임 중복 체크 API 호출 추가 예정 
}

// 이메일 유효성 검사 통과 못할 시 오류 메시지
const emailFormatCheck = () => {
    elements.helperTexts.email.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
}

// 비밀번호 유효성 검사 통과 못할 시 오류 메시지
const passwordFormatCheck = () => {
    elements.helperTexts.password.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
}

// 닉네임 유효성 검사 통과 못할 시 오류 메시지
const nicknameFormatCheck = () => {
    elements.helperTexts.nickname.textContent = "*닉네임은 2자 이상, 10자 이하의 영문자와 숫자만 가능합니다.";
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




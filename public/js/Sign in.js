const password = document.querySelector(".password");
const confirmPassword = document.querySelector(".password-check");
const signupButton = document.querySelector(".signup-button"); 

// 헬퍼 텍스트 
const profileHelperText = document.querySelector("#profileHelperTxt");
const emailHelperText = document.querySelector("#emailHelperTxt");
const pwHelperText = document.querySelector("#passwordHelperTxt");
const confirmPwHelperText = document.querySelector("#confirmPasswordHelperTxt");
const nicknameHelperText = document.querySelector("#nicknameHelperTxt");

// input 입력 유무 표시 마크 
const emailMark = document.querySelector('.email-mark');
const passwordMark = document.querySelector('.password-mark');
const confirmPasswordMark = document.querySelector('.password-check-mark');
const nicknameMark = document.querySelector('.nickname-mark');

// 프로필 이미지 
const profileBtn = document.querySelector('.profile-image');
const profileInput = document.querySelector('#profile-input');
const profileMark = document.querySelector('.profile-mark');

// 이메일 유효성 검사 
function emailCheck(email) {
    const emailRegex = /^[a-zA-Z._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

    // 입력 받은 이메일 앞 뒤 공백 제거 
    email = email.trim(); 
    
    if (email === "") {
        emailHelperText.textContent = "*이메일을 입력해주세요.";
    } else if (email.length < 5 || !emailRegex.test(email)) {
        emailFormatCheck();
    } else{
        // 이메일 중복 체크 API 호출 추가 예정 
        checkEmail(email);
        correctFormat("emailHelperTxt");
    }
}

// 이메일 중복 체크 함수
function checkEmail(email) {
    // 이메일 중복 체크 API 호출 추가 예정 
}

// 비밀번호 유효성 검사
function passwordCheck(passWord) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;

    // 입력 받은 비밀번호 앞 뒤 공백 제거
    passWord = passWord.trim();

    // 비밀번호가 유효하지 않음 
    if(passWord === '') {
        pwHelperText.textContent = "*비밀번호를 입력해주세요";
    } else if(!passwordRegex.test(passWord)) {
        passwordFormatCheck(); 
    } else {
        correctFormat("passwordHelperTxt");
        if(confirmPassword.value !== '') {
            confirmPasswordCheck(confirmPassword.value);
        }
    }
}

// 비밀번호 확인 유효성 검사
function confirmPasswordCheck(confirmPw) {
    if(confirmPw === '') {
        confirmPwHelperText.textContent = "*비밀번호를 한번더 입력해주세요";
    } else if(confirmPw !== password.value.trim()) {
        confirmPwHelperText.textContent = "*비밀번호가 다릅니다."
    } else {
        correctFormat("confirmPasswordHelperTxt");
    }
}

// 닉네임 유효성 검사
function nicknameCheck(nickname) {
    // 입력 받은 닉네임 앞 뒤 공백 제거
    nickname = nickname.trim();

    if (nickname === "") {
        nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
    } else if (nickname.includes(" ")) {
        nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
    } else if (nickname.length > 10) {
        nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    } else {
        // 닉네임 중복 체크 API 호출 추가 예정 
        checkNickname(nickname);
        correctFormat("nicknameHelperTxt");
    }
}

function checkNickname(nickname) {
    // 닉네임 중복 체크 API 호출 추가 예정 
}

// 이메일 유효성 검사 통과 못할 시 오류 메시지
function emailFormatCheck() {
    emailHelperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
}

// 비밀번호 유효성 검사 통과 못할 시 오류 메시지
function passwordFormatCheck() {
    pwHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
}

// 닉네임 유효성 검사 통과 못할 시 오류 메시지
function nicknameFormatCheck() {
    nicknameHelperText.textContent = "*닉네임은 2자 이상, 10자 이하의 영문자와 숫자만 가능합니다.";
}

// 유효성 검사 통과 시 헬퍼 텍스트 제거 
function correctFormat(elementId) {
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
        return;
    }

    try {
        const resizedImageUrl = await resizeImage(file);
        profileBtn.style.backgroundImage = `url(${resizedImageUrl})`;
        profileHelperText.textContent = "";
        updateButtonState();
    } catch (error) {
        console.error('이미지 리사이징 오류', error);
    }
});

// 이미지 리사이징 함수 
function resizeImage(file) {
    return new Promise((resolve) => {
        const maxSize = 149;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');

        reader.onload = (e) => {
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(resizedImageUrl);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}


// 버튼 상태 업데이트 
function updateButtonState() {
    
    if(profileHelperText.textContent.trim() === "" && 
       emailHelperText.textContent.trim() === "" && 
       pwHelperText.textContent.trim() === "" && 
       confirmPwHelperText.textContent.trim() === "" ) 
       //nicknameHelperText.textContent.trim() === "" 
       {
        signupButton.style.backgroundColor = "#7F6AEE";
    } else {
        signupButton.style.backgroundColor = "#ACA0EB";
    }
}

// input 유무 체크 마크 
function markCheck() {
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
}

// 이메일 이벤트 리스너
document.getElementById('email').addEventListener("input", function() {
    markCheck();
    emailCheck(this.value);
    updateButtonState();
});

// 닉네임 이벤트 리스너 
document.getElementById('nickname').addEventListener("input", function() {
    markCheck();
    nicknameCheck(this.value);
    updateButtonState();
});

// 비밀번호 이벤트 리스너 
password.addEventListener("input", function() {
    markCheck();
    passwordCheck(this.value);
    if(confirmPassword.value !== '') {
        confirmPasswordCheck(confirmPassword.value);
    }
    updateButtonState(); 
});
 
// 비밀번호 확인 이벤트 리스너 
confirmPassword.addEventListener("input", function() {
    markCheck();
    confirmPasswordCheck(this.value);
    updateButtonState(); 
});
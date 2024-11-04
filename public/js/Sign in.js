// 이메일 유효성 검사 
function emailCheck(email) {
    const emailRegex = /^[a-zA-Z._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

    // 입력 받은 이메일 앞 뒤 공백 제거 
    email = email.trim(); 
    
    // 이메일 형식이 너무 짧음 / 유효하지 않음 / 입력 받지 않음 
    if (email.length < 5 || !emailRegex.test(email) || email === "") {
        emailFormatCheck();
    } else {
        correctFormat("emailHelperTxt");
    }
}

// 비밀번호 유효성 검사
function passwordCheck(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,20}$/;

    // 입력 받은 비밀번호 앞 뒤 공백 제거
    password = password.trim();

    // 비밀번호가 유효하지 않음 
    if (!passwordRegex.test(password)) {
        passwordFormatCheck();
    } else {
        correctFormat("passwordHelperTxt");
    }
}

// 닉네임 유효성 검사
function nicknameCheck(nickname) {
    // 입력 받은 닉네임 앞 뒤 공백 제거
    nickname = nickname.trim();

    const helperTxt = document.getElementById("nicknameHelperTxt");

    if (nickname === "") {
        helperTxt.textContent = "*닉네임을 입력해주세요.";
    } else if (nickname.includes(" ")) {
        helperTxt.textContent = "*띄어쓰기를 없애주세요.";
    } else if (nickname.length > 10) {
        helperTxt.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    } else {
        correctFormat("nicknameHelperTxt");
    }
}

// 이메일 유효성 검사 통과 못할 시 오류 메시지
function emailFormatCheck() {
    let helperTxt = document.getElementById("emailHelperTxt");
    helperTxt.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
}

// 비밀번호 유효성 검사 통과 못할 시 오류 메시지
function passwordFormatCheck() {
    let helperTxt = document.getElementById("passwordHelperTxt");
    helperTxt.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
}

// 닉네임 유효성 검사 통과 못할 시 오류 메시지
function nicknameFormatCheck() {
    let helperTxt = document.getElementById("nicknameHelperTxt");
    helperTxt.textContent = "*닉네임은 2자 이상, 10자 이하의 영문자와 숫자만 가능합니다.";
}

// 유효성 검사 통과 시 헬퍼 텍스트 제거 
function correctFormat(helperTxtId) {
    let helperTxt = document.getElementById(helperTxtId);
    helperTxt.textContent = "";
}

// 프로필 사진 업로드 확인
document.getElementById('profile-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    const helperTxt = document.getElementById('profileHelperTxt');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            helperTxt.textContent = "";
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "/image/profile.png";
        helperTxt.textContent = "*프로필 사진을 추가해주세요.";
    }
});

// 프로필 사진 업로드 후 취소
document.getElementById('profile-input').addEventListener('click', function(event) {
    const preview = document.getElementById('preview');
    const helperTxt = document.getElementById('profileHelperTxt');

    setTimeout(() => {
        if (!this.files.length) {
            preview.src = "/image/profileImg.png";
            helperTxt.textContent = "*프로필 사진을 추가해주세요.";
        }
    }, 100);
});
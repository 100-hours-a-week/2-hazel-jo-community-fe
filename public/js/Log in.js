// 로그인 버튼 클릭 시
document.getElementById("loginBtn").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (emailCheck(email) && passwordCheck(password)) {
        this.style.backgroundColor = "#7F6AEE";
        window.location.href = "/public/page/posts";
    }
});

// 이메일 유효성 검사
function emailCheck(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    email = email.trim();
    if (email.length < 5 || !emailRegex.test(email) || email === "") {
        emailFormatCheck();
        return false;
    }
    correctFormat();
    return true;
}

// 비밀번호 유효성 검사
function passwordCheck(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,20}$/;
    password = password.trim();
    if (!passwordRegex.test(password)) {
        passwordFormatCheck();
        return false;
    }
    correctFormat();
    return true;
}

// 이메일 유효성 검사 통과 못할 시 오류 메시지
function emailFormatCheck() {
    let helperTxt = document.getElementById("helperTxt");
    helperTxt.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
}

// 비밀번호 유효성 검사 통과 못할 시 오류 메시지
function passwordFormatCheck() {
    let helperTxt = document.getElementById("helperTxt");
    helperTxt.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
}

// 유효성 검사 통과 시 헬퍼 텍스트 제거
function correctFormat() {
    let helperTxt = document.getElementById("helperTxt");
    helperTxt.textContent = "";
}

// input 이벤트 리스너 추가
document.getElementById("email").addEventListener("input", function() {
    validateInputs();
});

document.getElementById("password").addEventListener("input", function() {
    validateInputs();
});

// 입력값 검증 및 버튼 색상 변경 함수
function validateInputs() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginBtn = document.getElementById("loginBtn");

    if (emailCheck(email) && passwordCheck(password)) {
        loginBtn.style.backgroundColor = "#7F6AEE";
    } else {
        loginBtn.style.backgroundColor = "#ACA0EB";
    }
}

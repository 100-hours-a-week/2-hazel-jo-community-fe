//로그인
import { loginUser } from '../api/auth-api.js';

// 로그인 버튼 클릭 시
document.getElementById("loginBtn").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (emailCheck(email) && passwordCheck(password)) {
        this.style.backgroundColor = "#7F6AEE";
        //window.location.href = "/public/page/posts";
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

// 로그인 버튼 클릭 시 login 함수 호출
document.getElementById("loginBtn").addEventListener("click", login);

// axios를 사용한 백엔드 api 요청 
async function login(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if(emailCheck(email) && passwordCheck(password)) {
        try {
            const response = await loginUser(email, password);
            console.log('전체 로그인 응답:', response);
            
            if (response) {
                const userData = response.user;
                const BACKEND_URL = 'http://localhost:5000';
                
                // userId 저장
                localStorage.setItem('userId', String(userData.userId));
                localStorage.setItem('email', userData.email);
                localStorage.setItem('nickname', userData.nickname);
                
                // 프로필 이미지 URL 처리
                if (userData.profileImage) {
                    // 파일명에서 공백과 특수문자 처리
                    const fileName = userData.profileImage.split('/uploads/')[1];
                    const encodedFileName = encodeURIComponent(fileName);
                    const imageUrl = `${BACKEND_URL}/uploads/${encodedFileName}`;
                    console.log('최종 이미지 URL:', imageUrl);
                    
                    localStorage.setItem('profileImage', imageUrl);
                } else {
                    localStorage.setItem('profileImage', null);
                }
                
                alert('로그인에 성공했습니다.');
                window.location.href = '/public/page/Posts.html';
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('아이디 또는 비밀번호를 확인해주세요.');
        }
    }
}


const { confirmPassword, helperText } = {
    confirmPassword: document.getElementById("password-check"),
    helperText: document.getElementById("helperTxt"),
};

// 이메일, 비밀번호 유효성 검사 정규식 
export const regex = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,20}$/,
}

// 비밀번호 유효성 검사 : 비밀번호 수정 페이지
export const passwordCheck = (password) => {
    password = password.trim();
    
    if(password === '') {
        helperText.textContent = "*비밀번호를 입력해주세요";
        return false;
    }
    
    else if (!regex.password.test(password)) {
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

// 이메일 유효성 검사 : 회원 가입 페이지 
export const validateEmail = (email) => {
    email = email.trim();

    if(email === '') {
        return { isValid: false, message: "*이메일을 입력해주세요." };
    }
    if(email.length < 5 || !regex.email.test(email)) {
        return {
            isValid: false,
            message: "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)"
        };
    }
    return { isValid: true, message: "" };
};

// 비밀번호 유효성 검사 : 회원 가입 페이지 
export const validatePassword = (password) => {
    password = password.trim();

    if(password === '') {
        return { isValid: false, message: "*비밀번호를 입력해주세요." };
    }
    if(!regex.password.test(password)) {
        return {
            isValid: false,
            message: "*비밀번호는 8자 이상, 숫자, 대소문자, 특수문자를 각각 최소 1개 포함해야 합니다."
        };
    }
    return { isValid: true, message: "" };
};

// 비밀번호 확인 유효성 검사 : 회원 가입 페이지 
export const validateConfirmPassword = (password, confirmPassword) => {
    if(confirmPassword === '') {
        return { isValid: false, message: "*비밀번호를 한 번 더 입력해주세요." };
    }
    if(confirmPassword !== password.trim()) {
        return { isValid: false, message: "*비밀번호가 일치하지 않습니다." };
    }
    return { isValid: true, message: "" };
};

// 닉네임 유효성 검사 : 회원 가입 페이지 
export const validateNickname = (nickname) => {
    nickname = nickname.trim();
    if(nickname === '') {
        return { isValid: false, message: "*닉네임을 입력해주세요." };
    }
    if(nickname.includes(" ")) {
        return { isValid: false, message: "*띄어쓰기를 없애주세요." };
    }
    if(nickname.length > 10) {
        return { isValid: false, message: "*닉네임은 최대 10자까지 작성 가능합니다." };
    }
    return { isValid: true, message: "" };
};








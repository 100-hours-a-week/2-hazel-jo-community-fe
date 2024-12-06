const { confirmPassword, helperText } = {
    confirmPassword: document.getElementById("password-check"),
    helperText: document.getElementById("helperTxt"),
};

// 비밀번호 유효성 검사 
export const passwordCheck = (password) => {
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




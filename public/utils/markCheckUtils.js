import { selectDom, selectAll } from "../utils/selectDomUtils.js"; 

export const elements = {
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

// input 유무 체크 마크 
export const markCheck = () => {
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
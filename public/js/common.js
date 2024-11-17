const optionEditProfile = document.querySelector('#editProfile');
const optionEditPassword = document.querySelector('#editPassword');
const optionLogout = document.querySelector('#logout');

function dropdownMenu() {
    optionEditProfile.addEventListener('click', () => {
        location.href = '/page/edit profile.html';
    });
    optionEditPassword.addEventListener('click', () => {
        location.href = '/page/edit password.html';
    });
    optionLogout.addEventListener('click', () => {
        location.href = '/page/Log in.html';
    });
}

dropdownMenu();



const { title, content, helperText } = {
    title: document.querySelector('.title-input'),
    content: document.querySelector('.content-input'),
    helperText: document.querySelector('.helper-text'),
}

// 현재 날짜 포맷 설정 
export const currentDate = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
})();

if(title.value === '' || content.value === '') {
    helperText.textContent = '*제목, 내용을 모두 작성해주세요.';
}
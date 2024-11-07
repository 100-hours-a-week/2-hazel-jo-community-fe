
const title = document.querySelector('.title-input');
const content = document.querySelector('.content-input');
const submitBtn = document.querySelector('.submit-btn'); 
const submitForm = document.querySelector('form');
const helperText = document.querySelector('.helper-text');

const titleMark = document.querySelector('.title-mark');
const contentMark = document.querySelector('.content-mark');


// 게시글 제목, 내용의 입력을 실시간으로 감지하여 버튼 색상 변경
function updateSubmitBtn() {
    
    // 제목 input 여부에 따른 타이틀 마크 표시 유무 
    if(title.value.length > 0) {
        titleMark.style.display = 'none';
    } else {
        titleMark.style.display = 'inline';
    }

    // 내용 input 여부에 따른 내용 마크 표시 유무 
    if(content.value.length > 0) {
        contentMark.style.display = 'none';
    } else {
        contentMark.style.display = 'inline'; 
    }


    if(title.value.length > 0 && content.value.length > 0) {
        submitBtn.style.backgroundColor = '#7F6AEE'; 
        helperText.textContent = '';
    } else {
        submitBtn.style.backgroundColor = '#ACA0EB';
    }
}

// input 필드에 이벤트 리스너 추가 
title.addEventListener('input', updateSubmitBtn);
content.addEventListener('input', updateSubmitBtn); 

// 폼 제출 시 제목, 내용이 비어있으면 헬퍼 텍스트로 표시 
submitForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if(title.value === '' || content.value === '') {
        helperText.textContent = '*제목, 내용을 모두 작성해주세요.';
        return;
    }
});

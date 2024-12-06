import { createPost } from '../api/posts-api.js';
import { currentDate } from '../utils/currentDate.js';

const { title, content, submitBtn, submitForm, imageInput, helperText, titleMark, contentMark, uploadGuide} = {
    title: document.querySelector('.title-input'),
    content: document.querySelector('.content-input'),
    submitBtn: document.querySelector('.submit-btn'),
    submitForm: document.querySelector('form'),
    imageInput: document.getElementById('image-upload'),
    helperText: document.querySelector('.helper-text'),
    titleMark: document.querySelector('.title-mark'),
    contentMark: document.querySelector('.content-mark'),
    uploadGuide: document.querySelector('.upload-guide'),
}


// 게시글 제목, 내용의 입력을 실시간으로 감지하여 버튼 색상 변경
const updateSubmitBtn = () => {
    
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
submitForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 로컬 스토리지에서 사용자 정보 가져오기 
    const userId = localStorage.getItem('userId');
    const profileImage = localStorage.getItem('profileImage');

    // 이미지 파일 크기 제한 : 5MB 
    if(imageInput.files[0] && imageInput.files[0].size > 5 * 1024 * 1024) {
        alert('이미지 파일 크기는 최대 5MB입니다.');
        return;
    }

    // 폼 데이터 생성 
    const formData = new FormData();
    const data = {
        title: title.value,
        content: content.value,
        date: currentDate,
        user_id: userId,
        profileImg: profileImage,
    };
    Object.entries(data).forEach(([key, value]) => formData.append(key, value)); 

    // 게시글 이미지를 첨부한 경우만 이미지 파일 추가
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    

    try {
        const newPost = await createPost(formData);
        console.log('게시글 생성 성공:', newPost);

        alert('게시글 생성에 성공했습니다.');
        window.location.href = '/page/Posts.html';
    } catch (error) {
        console.error('게시글 생성 오류:', error);
    }
});

// 이미지 선택 시 파일명 표시
imageInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        uploadGuide.textContent = e.target.files[0].name;
    } else {
        uploadGuide.textContent = '파일을 선택해주세요.';
    }
});
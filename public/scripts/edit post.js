import { editPost, loadPost } from "../api/posts-api.js";
import { selectDom } from "../utils/selectDomUtils.js";

window.onload = () => {
    // URL에서 post_id 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');
    const userId = localStorage.getItem('userId');

    if (!postId) {
        console.error('postId가 설정되지 않았습니다.');
        window.location.href = '/page/posts.html'; 
        return;
    }

    // 게시글 불러오기 로직 
    loadPost(postId).then(post => {
        if (post) {
            if (Number(post.author.user_id) !== Number(userId)) {
                alert('게시글 수정 권한이 없습니다.');
                window.location.href = `/page/post.html?post_id=${postId}`;
                return;
            }
            renderPost(post);
        } else {
            console.error('해당 게시글을 찾을 수 없습니다.');
        }
    }).catch(error => {
        console.error('게시글 로딩 중 오류 발생:', error);
    });

    // 뒤로가기 버튼 설정
    const navigateBefore = document.querySelector('.navigate_before');
    if (navigateBefore) {
        navigateBefore.addEventListener('click', () => {
            window.location.href = `/page/post.html?post_id=${postId}`;
        });
    }
};

const renderPost = (post) => {
    const main = document.querySelector('main');

    // 이미지 경로에서 파일명 추출
    const contentImage = post.image ? post.image.split('/').pop() : '기존 파일 명';

    main.innerHTML =
    `
    <div class="post-form">
        <h2>게시글 수정</h2>
        <form id="edit-post-form">
            <div class="input-group">
                <label>제목<span class="title-mark">*</span></label>
                <input type="text" name="title" value="${post.title}" maxlength="26">
            </div>
            <div class="input-group">
                <label>내용<span class="content-mark">*</span></label>
                <textarea name="content">${post.content}</textarea>
            </div>
            <div class="input-group">
                <label>이미지</label>
                <div class="image-upload-container">
                    <button type="button" class="image-upload" onclick="document.getElementById('image-upload').click();">파일 선택</button>
                    <input type="file" id="image-upload" accept="image/*" style="display: none;">
                    <span class="upload-guide">${contentImage}</span>
                </div>
            </div>
            <button type="submit" class="submit-btn">수정하기</button>
        </form>
    </div>
    `;
  
    // 제목, 내용 input 
    const title = selectDom('input[name="title"]');
    const content = selectDom('textarea[name="content"]');
    
    // input 유무 체크 마크 
    const titleMark = selectDom('.title-mark');
    const contentMark = selectDom('.content-mark');
    
    const submitBtn = selectDom('.submit-btn');
    


    // 입력 유무 체크 함수
    const checkValidity = () => {
        // 제목 입력 여부 체크 
        if(title.value.length > 0) {
            titleMark.style.display = 'none';
        } else {
            titleMark.style.display = 'inline';
        }

        // 내용 입력 여부 체크 
        if(content.value.length > 0) {
            contentMark.style.display = 'none';
        } else {
            contentMark.style.display = 'inline';
        }

        // 버튼 상태 업데이트
        if (title.value.length === 0 || content.value.length === 0) {
            submitBtn.style.backgroundColor = '#ACA0EB';
        } else {
            submitBtn.style.backgroundColor = '#7F6AEE';
        }
    }

    // 이벤트 리스너 
    title.addEventListener('input', checkValidity);
    content.addEventListener('input', checkValidity);

    // 초기 유효성 검사 호출
    checkValidity(); 

    // 수정하기 버튼 : 수정 후 게시글로 이동 
    const editPostBtn = document.getElementById('edit-post-form');
    if(editPostBtn) {
        editPostBtn.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // FormData 객체 생성
            const formData = new FormData();
            const fromEntries = {
                title: title.value,
                content: content.value,
                userId: Number(localStorage.getItem('userId')),
            };
            Object.entries(fromEntries).forEach(([key, value]) => formData.append(key, value));

            // 이미지 파일 추가
            const imageFile = document.getElementById('image-upload').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            try {
                // editPost 함수 불러와 게시글 수정
                await editPost(post.post_id, formData);
                // 수정 성공 시 게시글 상세 페이지로 이동
                window.location.href = `/page/post.html?post_id=${post.post_id}`;
            } catch (error) {
                console.error('게시글 수정 중 오류 발생:', error);
                if (error.message.includes('권한이 없습니다')) {
                    alert('게시글 수정 권한이 없습니다.');
                    window.location.href = `/page/post.html?post_id=${post.post_id}`;
                } else {
                    alert('게시글 수정에 실패했습니다.');
                }
            }
        });
    }

    // 이미지 선택 시 파일명 표시
    const imageUpload = document.getElementById('image-upload');
    const uploadGuide = document.querySelector('.upload-guide');

    imageUpload.addEventListener('change', () => {
        const fileName = imageUpload.files[0] ? imageUpload.files[0].name : '기존 파일 명';
        uploadGuide.textContent = fileName;
    });
}

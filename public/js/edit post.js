import { fetchPosts } from "../api/posts-api.js";

window.onload = function() {
    // 해당 페이지 id에 맞는 게시글 데이터 가져와서 페이지 렌더링 
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('post_id'));

    fetchPosts().then(posts => {
        const post = posts.find(p => p.post_id === postId);

        if(post && post.post_id === postId) {
            renderPost(post);
        } else {
            console.error('해당 게시글을 찾을 수 없습니다.');
        }
    });

    // 뒤로가기 버튼 : 해당 id의 게시글로 이동 
    const navigateBefore = document.querySelector('.navigate_before');
    if(navigateBefore) {
        navigateBefore.addEventListener('click', () => {
            window.location.href = `/page/post.html?post_id=${postId}`;
        });
    };

};


  function renderPost(post) {
    const main = document.querySelector('main');

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
                    <span class="upload-guide">기존 파일 명</span>
                </div>
            </div>
            <button type="submit" class="submit-btn">수정하기</button>
        </form>
    </div>
    `;
  
    // 제목, 내용 input 
    const title = document.querySelector('input[name="title"]');
    const content = document.querySelector('textarea[name="content"]');
    
    // input 유무 체크 마크 
    const titleMark = document.querySelector('.title-mark');
    const contentMark = document.querySelector('.content-mark');
    
    const submitBtn = document.querySelector('.submit-btn');
    

    // 이벤트 리스너 
    title.addEventListener('input', checkValidity);
    content.addEventListener('input', checkValidity);

    // 입력 유무 체크 함수
    function checkValidity() {
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

    // 초기 유효성 검사 호출
    checkValidity(); 

    // 수정하기 버튼 : 수정 후 게시글로 이동 
    const editPostBtn = document.getElementById('edit-post-form');
    if(editPostBtn) {
        editPostBtn.addEventListener('submit', (e) => {
            // form submit 방지  
            e.preventDefault();
            
            // 수정된 데이터로 post 객체 업데이트 
            const formData = {
                title: title.value,
                content: content.value,
            };

            // 수정된 데이터 처리하는 로직 추가 예정 

            // 수정 후 게시글 페이지로 이동 
            window.location.href = `/page/post.html?post_id=${post.post_id}`;
        });
    }
}
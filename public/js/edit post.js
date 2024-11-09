
// 게시글 더미 데이터 
const dummyPost = 
  {
    title: '제목 1',
    content: 
    `무엇을 얘기할까요? 아무말이라면, 삶은 항상 놀라운 모험이라고 생각합니다. 
우리는 매일 새로운 경험을 하고 배우며 성장합니다. 때로는 어려움과 도전이 있지만, 
그것들이 우리를 더 강하고 지혜롭게 만듭니다. 또한 우리는 주변의 사람들과 연결되며 
사랑과 지지를 받습니다. 그래서 우리의 삶은 소중하고 의미가 있습니다.

자연도 아름다운 이야기입니다. 우리 주변의 자연은 끝없는 아름다움과 신비로움을 담고 있습니다. 
산, 바다, 숲, 하늘 등 모든 것이 우리를 놀라게 만들고 감동시킵니다. 
자연은 우리의 생명과 안정을 지키며 우리에게 힘을 주는 곳입니다.

마지막으로, 지식을 향한 탐구는 항상 흥미로운 여정입니다. 우리는 끝없는 지식의 바다에서 
배우고 발견할 수 있으며, 이것이 우리를 더 깊이 이해하고 세상을 더 넓게 보게 해줍니다. 
그런 의미에서, 삶은 놀라움과 경이로움으로 가득 차 있습니다. 
새로운 경험을 즐기고 항상 앞으로 나아가는 것이 중요하다고 생각합니다.`,
    
  };

  // localstorage에 게시글 데이터 저장 
  if(localStorage.getItem('post') === null){
    localStorage.setItem('post', JSON.stringify(dummyPost));
  }

  // localstorage에 저장된 게시글 데이터 불러오기 
  function getPost() {
    const post = localStorage.getItem('post');
    return JSON.parse(post);
  }

  function renderPost(post) {
    const main = document.querySelector('main');
    const truncatedTitle = post.title.slice(0, 26); // 제목 글자수 26자로 제한 

    main.innerHTML =
    `
    <div class="post-form">
        <h2>게시글 수정</h2>
        <form id="edit-post-form">
            <div class="input-group">
                <label>제목<span class="title-mark">*</span></label>
                <input type="text" name="title" value="${truncatedTitle}" maxlength="26">
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
    
    // 입력 유무 체크 
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
    };

    // 이벤트 리스너 
    title.addEventListener('input', checkValidity);
    content.addEventListener('input', checkValidity);

    checkValidity(); 

    const editPostForm = document.getElementById('edit-post-form');
    editPostForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            ...getPost(),
            title: e.target.title.value,
            content: e.target.content.value,
        };

        localStorage.setItem('post', JSON.stringify(formData));

        window.location.href = `/page/post.html`;

    });
}

// 게시글 렌더링 
document.addEventListener('DOMContentLoaded', () => {
    const post = getPost();
    renderPost(post);
});



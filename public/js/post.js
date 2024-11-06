window.onload = function() {
    // HTML 렌더링
    const postDetailSection = document.querySelector('.post-detail');
    postDetailSection.insertAdjacentHTML('afterbegin', renderPost(dummyPost));
    
    const commentSection = document.querySelector('.comment-list');
    // 댓글 배열을 순회하며 렌더링
    const commentsHTML = dummyComment.map(comment => renderComment(comment)).join('');
    commentSection.insertAdjacentHTML('afterbegin', commentsHTML);
    
    // 이벤트 리스너 바인딩
    const deleteBtn = document.querySelector('#deletePostBtn');
    const postModalOverlay = document.querySelector('#postModalOverlay');
    const cancelPostBtn = document.querySelector('#cancelPostBtn');
    const confirmPostBtn = document.querySelector('#confirmPostBtn');
    
    const commentModalOverlay = document.querySelector('#commentModalOverlay');
    const deleteCommentBtn = document.querySelector('#deleteCommentBtn');
    const cancelCommentBtn = document.querySelector('#cancelCommentBtn');
    const confirmCommentBtn = document.querySelector('#confirmCommentBtn');

    // 댓글 작성 폼 및 버튼 요소 가져오기
    const commentForm = document.querySelector('#commentForm');
    const commentTextarea = commentForm.querySelector('textarea');
    const commentSubmitBtn = commentForm.querySelector('.comment-submit');
    
    // 댓글 등록 함수
    const handleCommentSubmit = () => {
        const commentText = commentTextarea.value.trim();
        
        if (commentText === '') {
            alert('댓글을 입력해주세요.');
            return;
        }
        
        // 새로운 댓글 객체 생성
        const newComment = {
            image: `${dummyPost.profileImg}`, 
            author: `${dummyPost.author}`, 
            date: new Date().toLocaleString(),
            content: commentText
        };
        
        // 댓글 렌더링
        const commentList = document.querySelector('.comment-list');
        commentList.insertAdjacentHTML('afterbegin', renderComment(newComment));
        
        // 입력창 초기화
        commentTextarea.value = '';
    };
    
    // 댓글 등록 버튼 클릭 이벤트
    commentSubmitBtn.addEventListener('click', handleCommentSubmit);

    writeCommentBtn.addEventListener('click', inputComment);

    // 이벤트 리스너 설정
    deleteBtn.addEventListener('click', () => {
        modalOpen(postModalOverlay);
    });

    cancelPostBtn.addEventListener('click', () => {
        modalClose(postModalOverlay);
    });

    confirmPostBtn.addEventListener('click', () => {
        modalClose(postModalOverlay);
    });

    deleteCommentBtn.addEventListener('click', () => {
        modalOpen(commentModalOverlay); 
    });

    cancelCommentBtn.addEventListener('click', () => {
        modalClose(commentModalOverlay);
    });

    confirmCommentBtn.addEventListener('click', () => {
        modalClose(commentModalOverlay);
    });
};

// 모달 창 열 때 배경 스크롤 방지 
function modalOpen(ModalOverlay) {
    ModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function modalClose(ModalOverlay) {
  ModalOverlay.style.display = 'none';
  document.body.style.overflow = 'auto'; 
}

// 게시글 더미 데이터 
const dummyPost = 
  {
    title: '제목 1',
    author: '더미 작성자1',
    date: '2021-01-01 00:00:00',
    image: '/image/contentImg.jpg',
    profileImg: '/image/profileImg.png',
    content: `무엇을 얘기할까요? 아무말이라면, 삶은 항상 놀라운 모험이라고 생각합니다. 
    우리는 매일 새로운 경험을 하고 배우며 성장합니다. 때로는 어려움과 도전이 있지만, 
    그것들이 우리를 더 강하고 지혜롭게 만듭니다. 또한 우리는 주변의 사람들과 연결되며 
    사랑과 지지를 받습니다. 그래서 우리의 삶은 소중하고 의미가 있습니다.</br>
    
    자연도 아름다운 이야기입니다. 우리 주변의 자연은 끝없는 아름다움과 신비로움을 담고 있습니다. 
    산, 바다, 숲, 하늘 등 모든 것이 우리를 놀라게 만들고 감동시킵니다. 
    자연은 우리의 생명과 안정을 지키며 우리에게 힘을 주는 곳입니다.</br>
    
    마지막으로, 지식을 향한 탐구는 항상 흥미로운 여정입니다. 우리는 끝없는 지식의 바다에서 
    배우고 발견할 수 있으며, 이것이 우리를 더 깊이 이해하고 세상을 더 넓게 보게 해줍니다. 
    그런 의미에서, 삶은 놀라움과 경이로움으로 가득 차 있습니다. 
    새로운 경험을 즐기고 항상 앞으로 나아가는 것이 중요하다고 생각합니다.`,
    like: 123,
    view: 202333,
    comment: 13203
  };

  // 댓글 더미 데이터 
  const dummyComment = [
    {
      image: '/image/profileImg.png',
      author: '더미 작성자1',
      date: '2021-01-01 00:00:00',
      content: '댓글 내용'
    },
    {
      image: '/image/profileImg2.png',
      author: '더미 작성자2',
      date: '2021-01-01 00:00:00',
      content: '댓글 내용' 
    }
  ];



  // 숫자 단위 k로 변경
  function convertK(num) {
    if(num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  }
  
  function renderPost(post) {
    return `
    <article class="post-container">
      <div class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
          <div class="post-author">
            <img src="${post.profileImg}" alt="프로필">
            <span>${post.author}</span>
            <span class="post-date">${post.date}</span>
          </div>
          <div class="post-buttons">
            <button class="post-edit" onclick="location.href='/page/edit post.html'">수정</button>
            <button class="post-delete" id="deletePostBtn">삭제</button>
          </div>
        </div>
      </div>
      <!-- 모달 영역 --> 
      <div class="post-content">
        <div class="image-container">
          <!-- 게시글 이미지 영역 -->
          <img src="${post.image}" alt="image">
        </div>
        <p class="post-text">${post.content}</p>
      </div>
      <div class="post-stats">
        <div class="stat-item">
          <span class="count">${convertK(post.like)}</span>
          <span>좋아요수</span>
        </div>
        <div class="stat-item">
          <span class="count">${convertK(post.view)}</span>
          <span>조회수</span>
        </div>
        <div class="stat-item">          
          <span class="count">${convertK(post.comment)}</span>
          <span>댓글</span>
        </div>
      </div>
    </article>
    `;
  }

  function renderComment(comment) {
    return `
    <div class="comment-item">
        <div class="comment-author">
            <div class="author-info">
                <img src="${comment.image}" alt="프로필">
                <span>${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-buttons">
                <button class="comment-edit">수정</button>
                <button class="comment-delete" id="deleteCommentBtn">삭제</button>
            </div>
        </div>
        <p class="comment-text">${comment.content}</p>
    </div>
    `;
  }
import { loadPost } from "../api/posts-api.js";
import { loadUserInfo } from "../api/user-api.js";
import { deletePost } from "../api/posts-api.js";

const baseUrl = 'http://localhost:5000';


window.onload = async function() {

    // URL에서 게시글 아이디 가져오기 
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('post_id'));

    // postId가 유효한 숫자인지 확인하는 로직 추가
    if (!postId || isNaN(postId)) {
        console.error('유효하지 않은 게시글 ID');
        return;
    }
    
    // 게시글 데이터 가져오기
    const post = await loadPost(postId);
    const userInfo = await loadUserInfo(post.user_id);

    if(post) {
        const postDetailSection = document.querySelector('.post-detail');
        postDetailSection.insertAdjacentHTML('afterbegin', renderPost(post, userInfo));
    }
    
    /* 댓글 관련 코드 주석 처리
    loadComments().then(comments => {
        const commentSection = document.querySelector('.comment-list');
        const filterComments = comments.filter(c => c.post_id === postId);
        if(filterComments.length > 0) {
          filterComments.forEach(comment => {
                commentSection.insertAdjacentHTML('beforeend', renderComment(comment));
            });
        }
    });
    */

    // * 이벤트 리스너 바인딩 -> 이벤트 위임 방식으로 수정 예정 
    document.addEventListener('click', async (e) => {
        // 게시글 삭제 버튼
        if (e.target.id === 'deletePostBtn') {
            modalOpen(postModalOverlay);
        }
        // 게시글 삭제 모달창 취소 버튼 
        if (e.target.id === 'cancelPostBtn') {
            modalClose(postModalOverlay);
        }
        // 게시글 삭제 모달창 확인 버튼 
        if (e.target.id === 'confirmPostBtn') {
            
            const userId = await loadUserInfo(post.user_id);
            
            deletePost(postId, userId).then(() => {
                modalClose(postModalOverlay);
                window.location.href = `${baseUrl}/posts`;
            }).catch(error => {
                console.error('게시글 삭제 오류:', error);
            });
        }
        // 댓글 삭제 버튼
        if (e.target.classList.contains('comment-delete')) {
            modalOpen(commentModalOverlay);
        }

        // 댓글 삭제 모달창 취소 버튼
        if (e.target.id === 'cancelCommentBtn') {
            modalClose(commentModalOverlay);
        }
        // 댓글 삭제 모달창 확인 버튼
        if (e.target.id === 'confirmCommentBtn') {
            modalClose(commentModalOverlay);
        }
    });

    // 댓글 작성 폼 및 버튼 요소 가져오기
    const commentForm = document.querySelector('#commentForm');
    const commentTextarea = commentForm.querySelector('textarea');
    const commentSubmitBtn = commentForm.querySelector('.comment-submit');
    
    // 댓글 작성 버튼 기본 배경 색깔 
    commentSubmitBtn.style.backgroundColor = '#ACA0EB';

    // 댓글 입력 시 : 댓글 등록 버튼 활성화
    commentTextarea.addEventListener('input', () => {
        if(commentTextarea.value.trim() !== '') {
            commentSubmitBtn.style.backgroundColor = '#7F6AEE';  
        } else {
            commentSubmitBtn.style.backgroundColor = '#ACA0EB';  
        }
    });

    // 댓글 등록 함수
    const handleCommentSubmit = () => {
        const commentText = commentTextarea.value.trim();
        
        if (commentText === '') {
            return;
        }
        
        // 새로운 댓글 객체 생성
        // *추후 로그인 구현 시 작성자 및 프로필 이미지 수정 필요 
        const newComment = {
            image: '/image/profileImg.png', 
            author: '작성자', 
            date: new Date().toLocaleString(),
            content: commentText
        };
        
        // 댓글 렌더링
        const commentList = document.querySelector('.comment-list');
        commentList.insertAdjacentHTML('afterbegin', renderComment(newComment));
        
        // 입력창 초기화 및 댓글 등록 버튼 배경 색깔 초기화 
        commentTextarea.value = '';
        commentSubmitBtn.style.backgroundColor = '#ACA0EB';
    };
    
    // 댓글 등록 버튼 클릭 이벤트
    commentSubmitBtn.addEventListener('click', handleCommentSubmit);

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

  // 숫자 단위 k로 변경
  function convertK(num) {
    if(num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  }
  
  function renderPost(post, userInfo) {
    const getImage = (imagePath, isProfile = false) => {
        // 프로필 이미지인 경우
        if (isProfile) {
            if (!imagePath) {
                return '/public/image/basic.png';
            }
            if (imagePath.startsWith('/uploads/profiles/')) {
                return `${baseUrl}${imagePath}`;
            }
            return imagePath;
        }
        
        // 게시글 이미지인 경우
        if (!imagePath || imagePath === 'null' || imagePath === '') {
            return '/image/default.jpeg';
        }
        if (imagePath.startsWith('/uploads/')) {
            return `${baseUrl}${imagePath}`;
        }
        return imagePath;
    };

    return `
    <article class="post-container">
      <div class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
          <div class="post-author">
            <img src="${getImage(userInfo.profileImage)}" alt="프로필">
            <span>${userInfo.nickname}</span>
            <span class="post-date">${post.date}</span>
          </div>
          <div class="post-buttons">
            <button class="post-edit" id="editPostBtn" onclick="location.href='/page/edit/${post.post_id}'">수정</button>
            <button class="post-delete" id="deletePostBtn">삭제</button>
          </div>
        </div>
      </div>
      <!-- 모달 영역 --> 
      <div class="post-content">
        <div class="image-container">
          ${post.image ? `<img src="${getImage(post.image, false)}" alt="게시글 이미지">` 
            : `<img src="/image/default.jpeg" alt="기본 이미지">`}
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
                <img src="${comment.profileImg}" alt="프로필">
                <span>${comment.nickname}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-buttons">
                <button class="comment-edit" id="editCommentBtn">수정</button>
                <button class="comment-delete" id="deleteCommentBtn">삭제</button>
            </div>
        </div>
        <p class="comment-text">${comment.content}</p>
    </div>
    `;
  }
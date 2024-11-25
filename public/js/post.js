import { loadPost } from "../api/posts-api.js";
import { loadUserInfo } from "../api/user-api.js";
import { deletePost } from "../api/posts-api.js";
import { loadComments, createComment, deleteComment, updateComment } from "../api/comments-api.js";
import { getCurrentUser } from "../api/auth-api.js";
import { likePost, getLikeCount, getPostViews } from "../api/posts-api.js";

const baseUrl = 'http://localhost:5000';

window.onload = async function() {

    // URL에서 게시글 아이디 가져오기  
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('post_id'));

    // postId가 유효한 숫자인지 확인
    if (!postId || isNaN(postId)) {
        console.error('유효하지 않은 게시글 ID');
        return;
    }
    
    // 게시글 데이터 가져오기
    const post = await loadPost(postId);
    const userInfo = await loadUserInfo(post.user_id);

    // 현재 로그인한 사용자 정보 가져오기
    let currentUserInfo;
    try {
        currentUserInfo = await getCurrentUser();
    } catch (error) {
        console.error('현재 사용자 정보 로드 실패:', error);
        currentUserInfo = null;
    }

    if(post) {
        const postDetailSection = document.querySelector('.post-detail');
        postDetailSection.insertAdjacentHTML('afterbegin', renderPost(post, userInfo));
    }

    // 댓글 데이터 불러오기 
    loadComments(postId).then(comments => {
        const commentSection = document.querySelector('.comment-list');
        if(comments && comments.length > 0) {
          comments.forEach(comment => {
            commentSection.insertAdjacentHTML('beforeend', renderComment(comment));
          });
        }
    });

    // 선택된 댓글 아이디 변수 초기화
    let selectedCommentId = null;

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
            try {
                await deletePost(postId);
                modalClose(postModalOverlay);
                window.location.href = '/page/Posts.html';
            } catch (error) {
                console.error('게시글 삭제 오류:', error);
                if (error.message.includes('권한이 없습니다')) {
                    alert('게시글 작성자만 삭제할 수 있습니다.');
                } else {
                    alert('게시글 삭제에 실패했습니다.');
                }
            }
        }
        // 댓글 삭제 버튼
        if (e.target.classList.contains('comment-delete')) {
            // 클릭된 삭제 버튼의 댓글 아이디 불러옴 
            selectedCommentId = e.target.closest('.comment-item').dataset.commentId;
            const commentModalOverlay = document.getElementById('commentModalOverlay');
            modalOpen(commentModalOverlay);
        }

        // 댓글 삭제 모달창 취소 버튼
        if (e.target.id === 'cancelCommentBtn') {
            const commentModalOverlay = document.getElementById('commentModalOverlay');
            modalClose(commentModalOverlay);
        }
        // 댓글 삭제 모달창 확인 버튼
        if (e.target.id === 'confirmCommentBtn') {
            try {
              await deleteComment(selectedCommentId);
              const commentModalOverlay = document.getElementById('commentModalOverlay');
              modalClose(commentModalOverlay);
              window.location.reload();
            } catch (error) {
              console.error('댓글 삭제 오류: ', error);
              if (error.message.includes('권한이 없습니다')) {
                alert('댓글 작성자만 삭제할 수 있습니다.');
              } else {
                alert('댓글 삭제에 실패했습니다.');
              }
            }
        }

        // 댓글 수정 버튼 클릭 시
        if(e.target.classList.contains('comment-edit')) {
            const commentItem = e.target.closest('.comment-item');
            const commentId = commentItem.dataset.commentId;
            const commentText = commentItem.querySelector('.comment-text').textContent;
            
            // 댓글 입력창에 기존 내용 표시
            commentTextarea.value = commentText;
            
            // 댓글 등록 버튼 숨기고 수정 버튼 표시
            commentSubmitBtn.style.display = 'none';
            document.querySelector('.comment-edit-submit').style.display = 'block';
            
            // 수정 중인 댓글 ID 저장
            selectedCommentId = commentId;
        }

        // 댓글 수정 완료 버튼 클릭 시
        if(e.target.classList.contains('comment-edit-submit')) {
            try {
                const updatedContent = commentTextarea.value.trim();
                
                if(!updatedContent) {
                    alert('댓글 내용을 입력해주세요.');
                    return;
                }
                
                await updateComment(selectedCommentId, { content: updatedContent });
                
                // UI 초기화
                commentTextarea.value = '';
                commentSubmitBtn.style.display = 'block';
                document.querySelector('.comment-edit-submit').style.display = 'none';
                selectedCommentId = null;
                
                // 페이지 새로고침
                window.location.reload();
                
            } catch (error) {
                console.error('댓글 수정 오류:', error);
                if (error.message.includes('권한이 없습니다')) {
                    alert('댓글 작성자만 수정할 수 있습니다.');
                } else {
                    alert('댓글 수정에 실패했습니다.');
                }
            }
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
    const handleCommentSubmit = async (formData) => {
        const commentText = formData.content.trim();
        
        if (commentText === '') {
            return;
        }
        
        try {
            // 현재 로그인 한 사용자 정보가 없으면 에러 처리
            if (!currentUserInfo) {
                throw new Error('로그인이 필요합니다.');
            }

            // 새로운 댓글 객체 생성 
            const newComment = {
                content: commentText,
                profile_image: currentUserInfo.profileImage 
            };

            const savedComment = await createComment(postId, newComment);
            const commentList = document.querySelector('.comment-list');
            
            // 서버에서 반환된 댓글 데이터로 렌더링
            if (savedComment && savedComment.comment) {
                commentList.insertAdjacentHTML('afterbegin', renderComment(savedComment.comment));
                
                // 입력창 초기화
                commentTextarea.value = '';
                commentSubmitBtn.style.backgroundColor = '#ACA0EB';
            } else {
                throw new Error('댓글 데이터가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('댓글 저장 오류:', error);
            if (error.message.includes('로그인')) {
                alert('댓글을 작성하려면 로그인이 필요합니다.');
            } else {
                alert('댓글 저장에 실패했습니다.');
            }
        }
    };
    
    // 댓글 등록 버튼 클릭 이벤트
    commentSubmitBtn.addEventListener('click', () => {
        const formData = {
            content: commentTextarea.value
        };
        handleCommentSubmit(formData);
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
            if (!imagePath || imagePath === '') {
                //* 이미지 깨져 보임 -> 추후 해결 예정 
                return '/public/image/basic.png';
            }
            if (imagePath.startsWith('/uploads/profiles/')) {
                return `${baseUrl}${imagePath}`;
            }
            return imagePath;
        }
        
        // 게시글 이미지인 경우
        if (!imagePath || imagePath === 'null' || imagePath === '') {
            //* 이미지 깨져 보임 -> 추후 해결 예정 
            return '/image/default.jpeg';
        }
        if (imagePath.startsWith('/uploads/')) {
            return `${baseUrl}${imagePath}`;
        }
        return imagePath;
    };

    // 게시글 상세 조회 페이지 진입 시 조회수 업데이트
    getPostViews(post.post_id);

    // 좋아요 수 업데이트 함수
    async function handleLikeClick(e) {
        const likeCount = await getLikeCount(post.post_id);
        // console.log('getLikeCount 좋아요 수 : ', likeCount);

        if(e.target.closest('.like-post')) {
            try {
                const likeButton = e.target.closest('.like-post');
                const postId = likeButton.dataset.postId;

                const response = await likePost(postId);
                // console.log('likePost 좋아요 수 : ', response);

                const updatedLikeCount = response.likeCount;
                // console.log('updatedLikeCount : ', updatedLikeCount);
                
                const countElement = likeButton.querySelector('.count');
                if(countElement) {
                    countElement.textContent = convertK(updatedLikeCount);
                    countElement.dataset.likeCount = updatedLikeCount;
                }
            } catch (error) {
                console.error('좋아요 업데이트 실패:', error);
                if (error.message.includes('로그인')) {
                    alert('좋아요를 누르려면 로그인이 필요합니다.');
                } else {
                    alert('좋아요 업데이트에 실패했습니다.');
                }
            }
        }
    }

    // 좋아요 버튼 이벤트 리스너 
    document.removeEventListener('click', handleLikeClick);
    document.addEventListener('click', handleLikeClick);

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
            <button class="post-edit" id="editPostBtn" onclick="location.href='/page/edit post.html?post_id=${post.post_id}'">수정</button>
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
          <button class="like-post" data-post-id="${post.post_id}">
            <span class="count" data-like-count="${post.post_id}">${convertK(post.like)}</span>
            <span>좋아요</span>
          </button>
        </div>
        <div class="stat-item">
          <span class="count" data-view-count="${post.post_id}">${convertK(post.view)}</span>
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
      
    // 프로필 이미지 경로 처리
    const getProfileImage = (imagePath) => {
      if (!imagePath || imagePath === 'null') {
          return '/image/basic.png'; 
      }
      return imagePath.startsWith('/uploads/profiles/') ? `${baseUrl}${imagePath}` : imagePath;
    };

    return `
    <div class="comment-item" data-comment-id="${comment.comment_id}">
        <div class="comment-author">
            <div class="author-info">
                <img src="${getProfileImage(comment.profile_image)}" alt="프로필">
                <span>${comment.user_nickname}</span>
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
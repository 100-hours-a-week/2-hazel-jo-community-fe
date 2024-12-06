import { getPostViews, likePost } from "../api/posts-api.js";
import { convertK } from "./convertUtils.js";

const baseUrl = 'http://localhost:5000';

export const renderPost = (post, userInfo, currentUserInfo) => {
    const getImage = (imagePath, isProfile = false) => {
        // 프로필 이미지인 경우
        if (isProfile) {
            if (!imagePath || imagePath === '') {
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

    // 게시글 상세 조회 페이지 진입 시 조회수 업데이트
    getPostViews(post.post_id);

    // 좋아요 수 업데이트 함수
    const handleLikeClick = async (e) => {
        if(e.target.closest('.like-post')) {
            try {
                const likeButton = e.target.closest('.like-post');
                const postId = likeButton.dataset.postId;

                const response = await likePost(postId);
                
                // 좋아요 버튼 상태 업데이트
                const countElement = likeButton.querySelector('.count');
                if(countElement) {
                    countElement.textContent = convertK(response.likeCount);
                    countElement.dataset.likeCount = response.likeCount;
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

    // 현재 로그인한 사용자와 게시글 작성자가 일치하는지 확인
    const isPostAuthor = currentUserInfo && currentUserInfo.user.userId === Number(post.user_id);

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
          ${isPostAuthor ? `
          <div class="post-buttons">
            <button class="post-edit" id="editPostBtn" onclick="location.href='/page/edit post.html?post_id=${post.post_id}'">수정</button>
              <button class="post-delete" id="deletePostBtn">삭제</button>
            </div>
          ` : ''}
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
          <span class="count" id="commentCount" data-comment-count="${post.post_id}">${convertK(post.comment)}</span>
          <span>댓글</span>
        </div>
      </div>
    </article>
    `;
  }

export const renderComment = (comment, currentUserInfo) => {

    // 프로필 이미지 경로 처리
    const getProfileImage = (imagePath) => {
      if (!imagePath || imagePath === 'null') {
          return '/image/basic.png'; 
      }
      return imagePath.startsWith('/uploads/profiles/') ? `${baseUrl}${imagePath}` : imagePath;
    };

    // 현재 로그인한 사용자와 댓글 작성자가 일치하는지 확인
    const isCommentAuthor = currentUserInfo && currentUserInfo.user.userId === Number(comment.user_id);

    return `
    <div class="comment-item" data-comment-id="${comment.comment_id}">
        <div class="comment-author">
            <div class="author-info">
                <img src="${getProfileImage(comment.profile_image)}" alt="프로필">
                <span>${comment.user_nickname}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            ${isCommentAuthor ? `
            <div class="comment-buttons">
                <button class="comment-edit" id="editCommentBtn">수정</button>
                <button class="comment-delete" id="deleteCommentBtn">삭제</button>
            </div>
            ` : ''} 
        </div>
        <p class="comment-text">${comment.content}</p>
    </div>
    `;
}

// 게시글 컨테이너 함수 
export const renderPosts = (post) => {
  const truncatedTitle = post.title.slice(0, 26);
  const defaultProfileImage = `${baseUrl}/uploads/profiles/default.png`;

  return `
      <div class="box" onclick="location.href='/page/post.html?post_id=${post.post_id}'">
          <h4>${truncatedTitle}</h4>
          <div class="post-info">
              <div class="post-stats-container">
                  <span>좋아요 ${convertK(post.like)}</span>
                  <span>댓글 ${convertK(post.comment)}</span>
                  <span>조회수 ${convertK(post.view)}</span>
              </div>
              <div class="post-date">
                  <span>${post.date}</span>
              </div>
          </div>
          <hr class="horizontal-rule"/>
          <div class="post-author">
              <img src="${post.profileImage || defaultProfileImage}" alt="프로필">
              <span>${post.nickname}</span>
          </div>
      </div>
  `;
}
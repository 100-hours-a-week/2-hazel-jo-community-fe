import { loadPosts } from "../api/posts-api.js";
import { loadUserInfo } from "../api/user-api.js";

const baseUrl = 'http://localhost:5000';

// 페이지 로드 시 게시글 목록 표시 
window.onload = async function() {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        const response = await loadPosts();
        console.log('서버 응답 데이터:', response);
        
        const posts = response.posts || response;
        
        // 각 게시글에 대해 사용자 정보를 가져와서 합치기
        const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
            try {
                // user_id를 숫자로 변환
                const numericUserId = parseInt(post.user_id);
                const userInfo = await loadUserInfo(numericUserId);
                return {
                    ...post,
                    nickname: userInfo.nickname,
                    profileImage: userInfo.profileImage ? `${baseUrl}${userInfo.profileImage}` : null
                };
            } catch (error) {
                console.error(`사용자 정보 로드 실패 (ID: ${post.user_id}):`, error);
                return {
                    ...post,
                    nickname: 'void',
                    profileImage: null
                };
            }
        }));

        postsWithUserInfo.forEach(post => {
            postsContainer.innerHTML += renderPosts(post);
        });
    } catch (error) {
        console.error('게시글 목록 불러오기 오류:', error);
    }
};

// 숫자 단위 k로 변경
function convertK(num) {
    if(num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
}

// 게시글 컨테이너 함수 
function renderPosts(post) {
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





import { loadPosts } from "../api/posts-api.js";
import { loadUserInfo } from "../api/user-api.js";
import { renderPosts } from "../utils/renderUtils.js";

const baseUrl = 'http://localhost:5000';

// 페이지 로드 시 게시글 목록 표시 
window.onload = async () => {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        const response = await loadPosts();
        const posts = response.posts || response;
        
        // 각 게시글에 대한 사용자 정보를 가져와서 합치기
        const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
            try {
                // user_id 예외 처리 
                if(!post.user_id || isNaN(parseInt(post.user_id))) {
                return post;                 
            }
            const numericUserId = parseInt(post.user_id);
            const userInfo = await loadUserInfo(numericUserId);
            return {
                ...post,
                nickname: userInfo.nickname || post.nickname,
                profileImage: userInfo.profileImage 
                        ? `${baseUrl}${userInfo.profileImage}` 
                        : post.profileImage
            };
            } catch (error) {
                console.error(`사용자 정보 로드 실패 (ID: ${post.user_id}):`, error);
                return post; 
            }
        }));

        postsWithUserInfo.forEach(post => {
            // 최신 게시글이 위로 가도록 수정 
            //postsContainer.innerHTML += renderPosts(post);
            postsContainer.insertAdjacentHTML('afterbegin', renderPosts(post));
        });
    } catch (error) {
        console.error('게시글 목록 불러오기 오류:', error);
    }
};







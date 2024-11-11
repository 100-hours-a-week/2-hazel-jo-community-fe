import { fetchPosts } from "../api/posts-api.js";

// 페이지 로드 시 게시글 목록 표시 
window.onload = function() {
    const postsContainer = document.getElementById('posts-container');
    
    // API에서 게시글 목록 가져오기 
    fetchPosts().then(posts => {
        posts.forEach(post => {
            postsContainer.innerHTML += renderPosts(post);
        });
    });
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
    const truncatedTitle = post.title.slice(0, 26); // 제목 글자수 26자로 제한 

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
                <img src="${post.profileImg}" alt="프로필">
                <span>${post.user_id}</span>
            </div>
        </div>
    `;
}





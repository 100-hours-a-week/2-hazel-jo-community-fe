// 더미 데이터 
const dummyPosts = [
    {
        title: "제목 1",
        like: 0,
        comment: 0,
        view: 0,
        date: "2021-01-01 00:00:00",
        author: "더미 작성자 1",
        profileImg: "/image/profileImg.png"
        
    },
    {
        title: "제목 2",
        like: 0,
        comment: 0,
        view: 0,
        date: "2021-01-01 00:00:00",
        author: "더미 작성자 2",
        profileImg: "/image/profileImg.png"
    }
]; 

// 게시글 컨테이너 함수 
function renderPosts(post) {
    const truncatedTitle = post.title.slice(0, 26); // 제목 글자수 26자로 제한 

    return `
        <div class="box" onclick="location.href='/page/post.html'">
            <h4>${truncatedTitle}</h4>
            <div class="post-info">
                <div class="post-stats-container">
                    <span>좋아요 ${post.like}</span>
                    <span>댓글 ${post.comment}</span>
                    <span>조회수 ${post.view}</span>
                </div>
                <div class="post-date">
                    <span>${post.date}</span>
                </div>
            </div>
            <hr class="horizontal-rule"/>
            <div class="post-author">
                <img src="${post.profileImg}" alt="프로필">
                <span>${post.author}</span>
            </div>
        </div>
    `;
}

// 페이지 로드 시 게시글 목록 표시 
window.onload = function() {
    const postsContainer = document.getElementById('posts-container');
    dummyPosts.forEach(post => {
        postsContainer.innerHTML += renderPosts(post);
    });
};


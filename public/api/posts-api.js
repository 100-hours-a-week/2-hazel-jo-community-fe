const postsUrl = 'http://localhost:5000/posts';
const baseUrl = 'http://localhost:5000';


// 게시글 목록 불러오기 
export async function loadPosts() {
    try {
        const response = await fetch(`${postsUrl}`, {
            method: 'GET',
            credentials: 'include',
        });
        

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 목록 불러오기 실패');
        }

        const posts = await response.json();
        return posts; 
    } catch (error) {
        console.error('Fetch 오류: ', error);
        throw error;
    }
}

// 게시글 생성 
export async function createPost(formData) {
    try {
        const response = await fetch(`${postsUrl}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 생성 실패');
        }

        const newPost = await response.json();
        return newPost;
    } catch (error) {
        console.error('게시글 생성 오류: ', error);
        throw error;
    }
}

// 게시글 상세 불러오기 
export async function loadPost(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 상세 불러오기 실패');
        }

        const post = await response.json();
        return post.post;
    } catch (error) {
        console.error('게시글 상세 불러오기 오류: ', error);
        throw error;
    }
}

// 게시글 삭제 
export async function deletePost(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 삭제 실패');
        }

        return true;
    } catch (error) {
        console.error('게시글 삭제 오류: ', error);
        throw error;
    }
}

// 게시글 수정 
export async function editPost(postId, formData) {
    try {
        // 세션 쿠키가 있는지 확인
        console.log('쿠키:', document.cookie);
        
        const response = await fetch(`${postsUrl}/${postId}`, {
            method: 'PUT',
            credentials: 'include', 
            body: formData 
        });

        if(!response.ok) {
            const errorData = await response.json();
            // 세션 만료 시 로그인 페이지로 리다이렉트
            if(response.status === 401) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                window.location.href = `${baseUrl}/login`;
                return;
            }
            throw new Error(errorData.message || '게시글 수정 실패')
        }

        const updatedPost = await response.json();
        return updatedPost;
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
}

// 게시글 좋아요 
export async function likePost(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}/like`, {
            method: 'POST',
            credentials: 'include',
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 좋아요 실패');
        }

        const data = await response.json();
        // console.log('likePost 좋아요 수 : ', data);
        return data;
    } catch (error) {
        console.error('게시글 좋아요 오류: ', error);
        throw error;
    }
}



// 게시글 좋아요 수 
export async function  getLikeCount(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}/like`, {
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 좋아요 수 불러오기 실패');
        }

        const data = await response.json();
        // console.log('getLikeCount 좋아요 수 : ', data.like);
        return data.like;
    } catch (error) {
        console.error('게시글 좋아요 수 오류: ', error);
        throw error;
    }
}



// 게시글 댓글 수 
export async function getCommentCount(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}/comment-count`, {
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 댓글 수 불러오기 실패');
        }

        const commentCount = await response.json();
        return commentCount;
    } catch (error) {
        console.error('게시글 댓글 수 오류: ', error);
        throw error;
    }   
}

// 게시글 조회수 
export async function getPostViews(postId) {
    try {
        const response = await fetch(`${postsUrl}/${postId}/view`, {
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 조회수 불러오기 실패');
        }

        const postViews = await response.json();
        return postViews;
    } catch (error) {
        console.error('게시글 조회수 오류: ', error);
        throw error;
    }
}
const postsUrl = 'http://localhost:5000/posts';
const baseUrl = 'http://localhost:5000';


// 게시글 목록 불러오기 
export const loadPosts = async () => {
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
export const createPost = async (formData) => {
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
export const loadPost = async (postId) => {
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
export const deletePost = async (postId) => {
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
export const editPost = async (postId, formData) => {
    try {        
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
export const likePost = async (postId) => {
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
        
        return data;
    } catch (error) {
        console.error('게시글 좋아요 오류: ', error);
        throw error;
    }
}



// 게시글 좋아요 수 
export const getLikeCount = async (postId) => {
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
        return data.like;
    } catch (error) {
        console.error('게시글 좋아요 수 오류: ', error);
        throw error;
    }
}


// 게시글 댓글 수 불러오기 
export const getCommentCount = async (postId) => {
    try {
        const response = await fetch(`${postsUrl}/${postId}/comment`, {
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 댓글 수 불러오기 실패');
        }

        const { commentCount } = await response.json();
        return commentCount;
    } catch (error) {
        console.error('게시글 댓글 수 오류: ', error);
        throw error;
    }   
}

/*
// 게시글 조회수 
export const getPostViews = async (postId) => {
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
*/
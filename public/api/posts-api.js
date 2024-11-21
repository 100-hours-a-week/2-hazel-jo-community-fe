const baseUrl = 'http://localhost:5000/posts';

// 게시글 목록 불러오기 
export async function loadPosts() {
    try {
        const response = await fetch(`${baseUrl}`, {
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
        const response = await fetch(`${baseUrl}`, {
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
        const response = await fetch(`${baseUrl}/${postId}`, {
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
        const response = await fetch(`${baseUrl}/${postId}`, {
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
        
        const response = await fetch(`${baseUrl}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', 
            body: JSON.stringify(formData)
        });

        if(!response.ok) {
            const errorData = await response.json();
            // 세션 만료 시 로그인 페이지로 리다이렉트
            if(response.status === 401) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                window.location.href = '/page/login.html';
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
import { redirectLogin } from '../utils/redirectLogin.js';
const baseUrl = 'http://localhost:5000/comments';

// 댓글 불러오기 
export const loadComments = async (postId) => {
  try {
        const response = await fetch(`${baseUrl}/${postId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            redirectLogin();
        }
        
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '댓글 불러오기 실패');
        }
        
        const data = await response.json();
        return data.comments;
   
    } catch (error) {
        console.error('Fetch 오류:', error);
        return [];
    }
  }

// 댓글 생성 
export const createComment = async (postId, commentData) => {
    try {
        const response = await fetch(`${baseUrl}/${postId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '댓글 생성 실패');
        }

        const newComment = await response.json();
        return newComment;
    } catch (error) {
        console.error('댓글 생성 오류: ', error);
        throw error;
    }
}

// 댓글 삭제 
export const deleteComment = async (postId, commentId) => {
    try {
        const response = await fetch(`${baseUrl}/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '댓글 삭제 실패');
        }

        return true;
    } catch (error) {
        console.error('댓글 삭제 오류: ', error);
        throw error;
    }
}

// 댓글 수정 
export const updateComment = async (commentId, commentData) => {
    try {
        const response = await fetch(`${baseUrl}/${commentId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if(!response.ok) {
            const errorData = await response.json();

            // 세션 만료 시 로그인 페이지로 리다이렉트
            if(response.status === 401) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                window.location.href = '/page/login.html';
                return;
            }
            throw new Error(errorData.message || '댓글 수정 실패');
        }
    
        const updatedComment = await response.json();
        return updatedComment;
    } catch (error) {
        console.error('댓글 수정 오류: ', error);
        throw error;
    }
}
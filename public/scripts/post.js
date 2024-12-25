import { loadPost, deletePost, getCommentCount } from "../api/posts-api.js";
import { loadComments, createComment, deleteComment, updateComment } from "../api/comments-api.js";
import { getCurrentUser } from "../api/auth-api.js";
import { modalOpen, modalClose } from "../utils/modalUtils.js";
import { renderComment, renderPost } from "../utils/renderUtils.js";


// 게시글 댓글 수 로드 및 DOM 업데이트 함수 
const loadCommentCount = async (postId) => {
    try {
        const { commentCount } = await getCommentCount(postId);
        return commentCount;    
    } catch (error) {
        console.error('댓글 개수 로드 오류:', error);
        return null;
    }
}

window.onload = async () => {
    // URL에서 게시글 아이디 가져오기  
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('post_id'));

    // postId가 유효한 숫자인지 확인
    if (!postId || isNaN(postId)) {
        console.error('유효하지 않은 게시글 ID');
        return;
    }

    // 현재 로그인한 사용자 정보 가져오기
    let currentUserInfo;
    try {
        currentUserInfo = await getCurrentUser();
    } catch (error) {
        console.error('현재 사용자 정보 로드 실패:', error);
        currentUserInfo = null;
    }
    
    // 게시글 데이터 가져오기
    const post = await loadPost(postId);

    // post 렌더링
    if(post) {
        const postDetailSection = document.querySelector('.post-detail');
        postDetailSection.insertAdjacentHTML('afterbegin', renderPost(post, currentUserInfo));
        
        // 댓글 수 업데이트
        await loadCommentCount(postId);
    }

    // 댓글 데이터 불러오기 
    loadComments(postId).then(comments => {
        const commentSection = document.querySelector('.comment-list');
        if(comments && comments.length > 0) {
          comments.forEach(comment => {
            commentSection.insertAdjacentHTML('afterbegin', renderComment(comment, currentUserInfo));
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
              await deleteComment(postId, selectedCommentId);
              // 댓글 수 업데이트 함수 호출 
              await loadCommentCount(postId);

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

            const savedComment = await createComment(postId, { content: commentText });
            // 댓글 수 업데이트 함수 호출 
            await loadCommentCount(postId);
            window.location.reload(); 
            
            const commentList = document.querySelector('.comment-list');
            
            // 서버에서 반환된 댓글 데이터로 렌더링
            if (savedComment && savedComment.comment) {
                commentList.insertAdjacentHTML('afterbegin', renderComment(savedComment.comment, currentUserInfo));
                
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

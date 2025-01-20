import { redirectLogin } from '../utils/redirectLogin.js';
import { API_URLS } from '../utils/config.js';
const userUrl = API_URLS.users;

// 프로필 수정
export const editProfile = async (formData) => {
    try {
        const userId = localStorage.getItem('userId');

        const response = await fetch(`${userUrl}/profile/${userId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });

        if (response.status === 401) {
            redirectLogin();
        }
        
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            const errorData = contentType && contentType.includes('application/json') 
                ? await response.json()
                : await response.text();
            throw new Error(typeof errorData === 'object' ? errorData.message : errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {   
        console.error('프로필 수정 에러:', error);
        throw error;
    }
}




// 비밀번호 수정
export const editPassword = async (newPassword) => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${userUrl}/password/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ password: newPassword })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '비밀번호 수정에 실패했습니다.');
        }
        alert('비밀번호 수정에 성공했습니다.');
        return await response.json();
    } catch (error) {
        console.error('비밀번호 수정 에러:', error);
        throw error;
    }
}

// 로그아웃
export const logoutUser = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${userUrl}/${userId}`, {
            method: 'POST',
            credentials: 'include'
        });
        console.log('로그아웃 응답:', response);
        alert('로그아웃에 성공했습니다.');

    } catch (error) {
        console.error('로그아웃 에러:', error);
    }
}

// 회원 탈퇴 
export const withdrawUser = async () => {
    try {
        const userId = localStorage.getItem('userId');
        console.log('회원 탈퇴 요청 userId:', userId);
        const response = await fetch(`${userUrl}/${userId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        // 응답 상태 코드 확인 
        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.');
        }

        const data = await response.json(); 
        console.log('data: ', data);

        alert(data.message || '회원 탈퇴가 완료되었습니다.');
        localStorage.clear(); 

        // 탈퇴 성공 후 추가 로드 방지 
        if(data.sessionCleared) {
            redirectLogin();
        }
    } catch (error) {
        console.error('회원 탈퇴 에러:', error);
        alert(error.message);
        throw error;
    }
};

// 사용자 정보 불러오기 
export const loadUserInfo = async (userId) => {
    try {
        const response = await fetch(`${userUrl}/profile/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        console.log('응답 상태 코드:', response.status);

        if (response.status === 401) {
            console.warn('세션이 만료되었습니다.');
            redirectLogin();
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '사용자 정보 불러오기 실패');
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('사용자 정보 불러오기 오류:', error);
        throw error;
    }
};
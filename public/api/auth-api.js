const authUrl = 'http://localhost:5000/auth';

// 회원가입 
export const signupUser = async (email, nickname, password, profileImage) => {
    const formData = new FormData();  
    const fields = { email, nickname, password, profileImage };
    for (const [key, value] of Object.entries(fields)) {
        if (value) {
            formData.append(key, value);
        }
    }

    try {
        const response = await fetch(`${authUrl}/signup`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            mode: 'cors'
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || '회원가입 실패');
        }

        // 응답 데이터 검증 전에 로깅
        if (responseData.user) {
            console.log('사용자 ID:', responseData.user.userId);
        }
        
        return responseData;
    } catch (error) {
        console.error('Signup Error Details:', error);
        throw error;
    }
}

// 로그인 
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${authUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '로그인 실패');
        }

        return data;
    } catch (error) {
        console.error('로그인 에러:', error);
        throw error;
    }
}

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${authUrl}/current`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '사용자 정보 조회 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('현재 사용자 정보 조회 오류:', error);
        throw error;
    }
}

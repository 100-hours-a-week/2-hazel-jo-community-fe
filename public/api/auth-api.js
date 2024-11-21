const authUrl = 'http://localhost:5000/auth';

// 회원가입 
export async function signupUser(email, nickname, password, profileImage) {
    const formData = new FormData();  
    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('password', password);
    // 프로필 이미지 첨부
    if (profileImage) {
        formData.append('profileImage', profileImage);
    }

    try {
        const response = await fetch(`${authUrl}/signup`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            mode: 'cors'
        });
        
        const responseData = await response.json();
        console.log('서버 응답 전체 데이터:', responseData);
        console.log('서버 응답 user 객체:', responseData.user);

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
export async function loginUser(email, password) {
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

function getApiUrl() {
    if(window.location.hostname === 'localhost') {
        console.log('Using local API URL');
        return 'http://localhost:5001';
    } else {
        console.log('Using deployed API URL');
        //return 'http://43.203.225.133:5001';
        return 'http://hazel-grove-nut.kro.kr:5001'; 
    }
}

const BACKEND_URL = getApiUrl();

export const API_URLS = {
    base: `${BACKEND_URL}`,
    auth: `${BACKEND_URL}/auth`,
    posts: `${BACKEND_URL}/posts`,
    users: `${BACKEND_URL}/users`,
    comments: `${BACKEND_URL}/comments`,
}
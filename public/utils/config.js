function getApiUrl() {
    if(window.location.hostname === 'localhost') {
        return 'http://localhost:5001';
    } else {
        return 'http://54.180.86.12:5001';
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
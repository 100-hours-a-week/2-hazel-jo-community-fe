export async function fetchPosts() {
    try {
        const response = await fetch('/data/posts.json');

        if(!response.ok) {
            throw new Error('네트워크 응답 오류');
        }

        const data = await response.json();
        return data.posts; 
    } catch (error) {
        console.error('Fetch 오류: ', error);
        return []; 
    }
}
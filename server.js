import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 기본 경로 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'Log in.html')); 
});

// HTML 파일 응답
app.get('/public/page/edit-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'edit password.html'));
});

app.get('/public/page/edit-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'edit post.html'));
});

app.get('/public/page/edit-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'edit profile.html'));
});

app.get('/public/page/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'Log in.html'));
});

app.get('/public/page/make-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'make post.html'));
});

app.get('/public/page/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'post.html'));
});

app.get('/public/page/Posts.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'Posts.html'));
});

app.get('/public/page/Sign in.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'Sign in.html'));
});

app.get('/public/page/Log in.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page', 'Log in.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
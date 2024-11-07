const profileBtn = document.querySelector('.profile-image');
const profileInput = document.querySelector('#profile-input');
const imgTag = document.querySelector('.profile-image img');
const profileMark = document.querySelector('.profile-mark');

const editBtn = document.querySelector('.edit-btn');
const nicknameInput = document.querySelector('.nickname-input'); 
const helperText = document.querySelector('.helper-text');
const toastMessage = document.querySelector('.toast-message'); 

const confirmBtn = document.querySelector('#confirmBtn'); 
const withdrawBtn = document.querySelector('#withdrawBtn');
const modalOverlay = document.querySelector('#modalOverlay');
const cancelBtn = document.querySelector('#cancelBtn');

// createObjectURL 사용한 프로필 이미지 미리보기
document.querySelector('#profile-input').addEventListener("change", (e) => {

    let f = e.target.files[0];

    //최대 용량 10MB 초과 시 
    /*
    if (f.size > 10 * 1024 * 1024) {
        alert("이미지 파일은 10MB 이내로 등록 가능합니다.");
        return;
    }
    */
    
    let tempPath = URL.createObjectURL(f);
    profileBtn.style.backgroundImage = `url(${tempPath})`;
	//URL.revokeObjectURL(f) 를 여기서 하는 경우 미리보기 이미지가 출력되지 않음 
    profileMark.style.display = 'none';
    changeImage = true;
    check_all()

});

// 프로필 이미지 리사이징 
function resizeImage(file) {
    return new Promise((resolve) => {
        const maxSize = 149;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');

        reader.onload = (e) => {
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                // 비율 유지하면서 리사이징
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(resizedImageUrl);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

profileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    
    try {
        const resizedImageUrl = await resizeImage(file);
        profileBtn.style.backgroundImage = `url(${resizedImageUrl})`;
        
        // 이미지 중앙 정렬
        const img = new Image();
        img.onload = () => {
            const widthDiff = (img.width - imgTag.offsetWidth) / 2;
            const heightDiff = (img.height - imgTag.offsetHeight) / 2;
            img.style.transform = `translate(-${widthDiff}px, -${heightDiff}px)`;
        };
        img.src = resizedImageUrl;
        
        changeImage = true;
        check_all();
    } catch (error) {
        console.error('이미지 리사이징 오류', error);
    }
});

// 닉네임 유효성 검사 수정
nicknameInput.addEventListener('input', () => {
    if(nicknameInput.value.length === 0) {
        helperText.textContent = '*닉네임을 입력해주세요.';
        return false;
    } else if (nicknameInput.value.length >= 11) {
        helperText.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
        return false;
    } else {
        helperText.textContent = ''; 
        return true;
    }
});

// 닉네임 유효성 검사 성공 시 토스트 메시지 표시
function nicknameValid() {
    toastMessage.style.visibility = 'visible';
    // 5초 후 토스트 메시지 숨기기
    setTimeout(() => {
        toastMessage.style.visibility = 'hidden';
    }, 5000);
}

editBtn.addEventListener('click', () => {
    if(helperText.textContent === '') {
        nicknameValid();
    }
});

// 회원 탈퇴 처리
function successWithdraw() {   
    modalOverlay.style.display = 'none';
    window.location.href = 'page/Log in.html';    
}

// 회원 탈퇴 버튼 이벤트
confirmBtn.addEventListener('click', successWithdraw);


// 모달창 이벤트 리스너 
withdrawBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});
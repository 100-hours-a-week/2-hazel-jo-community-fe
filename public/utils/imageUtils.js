// 이미지 리사이징 함수
export const resizeImage = (file) => {
    return new Promise((resolve) => {
        const maxSize = 149;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');

        reader.onload = (e) => {
            image.onload = () => {
                let width = image.width;
                let height = image.height;

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

// 이미지 가운데 정렬 함수
export const centerImage = (img, imgTag) => {
    img.onload = () => {
        const widthDiff = (img.width - imgTag.offsetWidth) / 2;
        const heightDiff = (img.height - imgTag.offsetHeight) / 2;
        img.style.transform = `translate(-${widthDiff}px, -${heightDiff}px)`;
    };
} 
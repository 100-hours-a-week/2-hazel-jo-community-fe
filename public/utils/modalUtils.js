// 모달 창 열 때 배경 스크롤 방지 
export const modalOpen = (ModalOverlay) => {
    ModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

export const modalClose = (ModalOverlay) => {
  ModalOverlay.style.display = 'none';
  document.body.style.overflow = 'auto'; 
}
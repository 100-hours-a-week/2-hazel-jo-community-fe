document.addEventListener("DOMContentLoaded", () => {
    const scrollToTop = document.getElementById('scrollTop');
    const scrollToDown = document.getElementById('scrollDown');

    scrollToTop.style.display = "block";
    scrollToDown.style.display = "block";

    // TOP 버튼 동작
    function topFunction() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // DOWN 버튼 동작
    function downFunction() {
        const footer = document.getElementById('doz_footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        } else {
            // 페이지 맨 아래로 이동 
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }

    scrollToTop.addEventListener("click", topFunction);
    scrollToDown.addEventListener("click", downFunction);

});

export function updateFooterPosition() {
    const postsContainer = document.getElementById('posts-container');
    const footer = document.getElementById('doz_footer');
    if(postsContainer & footer) {
      footer.style.marginTop = `${postsContainer.offsetHeight + 20}px`;
    }
  }
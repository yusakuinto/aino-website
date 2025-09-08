/* =============================================== */
/* ホームページ メインスライダーのコード */
/* =============================================== */
const mainSlider = document.querySelector('.slider-container');
if (mainSlider) {
    let currentSlideIndex = 0; 
    const slides = mainSlider.querySelectorAll('.slide');
    const dots = mainSlider.querySelectorAll('.dots-container .dot');
    const slideCount = slides.length;
    let autoPlayInterval; // 自動再生を管理する変数

    // スライドを切り替えるメインの関数
    function showSlide(index) {
        const currentActiveSlide = mainSlider.querySelector('.slide.active');
        if (currentActiveSlide) {
            currentActiveSlide.classList.remove('active');
        }
        slides[index].classList.add('active');

        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        currentSlideIndex = index;
    }

    // 次のスライドへ
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slideCount;
        showSlide(nextIndex);
    }

    // 前のスライドへ
    function prevSlide() {
        const prevIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
        showSlide(prevIndex);
    }

    // 自動再生を開始する関数
    function startAutoPlay() {
        // 既に動いている場合は一度停止
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    // ドットがクリックされた時の処理
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay(); // 自動再生をリスタート
        });
    });

    // --- ▼▼▼ スマホ用スワイプ機能 ▼▼▼ ---
    let touchStartX = 0;
    let touchEndX = 0;

    mainSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoPlayInterval); // スワイプ開始で自動再生を停止
    });

    mainSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay(); // スワイプ終了で自動再生を再開
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // 左スワイプ（次へ）
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            // 右スワイプ（前へ）
            prevSlide();
        }
    }
    // --- ▲▲▲ スマホ用スワイプ機能ここまで ▲▲▲ ---


    // 最初のスライドを表示して自動再生を開始
    if(slides.length > 0){
        showSlide(0);
        startAutoPlay();
    }
}


/* =============================================== */
/* 記事内スライダーのコード */
/* =============================================== */
const articleSlider = document.querySelector('.article-slider');
if (articleSlider) {
    // (こちらのコードは変更ありません)
    const sliderTrack = articleSlider.querySelector('.slider-track');
    const slides = articleSlider.querySelectorAll('.slide-item');
    const prevButton = articleSlider.querySelector('.prev-slide');
    const nextButton = articleSlider.querySelector('.next-slide');
    const dots = articleSlider.querySelectorAll('.slider-dots .dot');
    let currentIndex = 0;

    function updateArticleSlider() {
        const slideWidth = slides[0].clientWidth;
        sliderTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateArticleSlider();
    });
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateArticleSlider();
    });
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateArticleSlider();
        });
    });
    window.addEventListener('resize', updateArticleSlider);
    updateArticleSlider();
}

/* =============================================== */
/* ハンバーガーメニューのコード */
/* =============================================== */
const navToggleButton = document.querySelector('.nav-toggle-button');
const mobileNav = document.querySelector('.mobile-nav'); // ★クラス名を .main-nav から .mobile-nav に変更

if (navToggleButton && mobileNav) {
    navToggleButton.addEventListener('click', () => {
        navToggleButton.classList.toggle('is-active');
        mobileNav.classList.toggle('is-open'); // ★クラス名を .main-nav から .mobile-nav に変更
    });
}

/* =============================================== */
/* ウィンドウリサイズ時にメニューを閉じるコード */
/* =============================================== */

// 画面幅の境界点（CSSの @media (min-width: 900px) と同じ数値）
const breakpoint = 900; 

window.addEventListener('resize', () => {
    // 現在の画面幅を取得
    const screenWidth = window.innerWidth;

    // 画面がブレークポイントより大きくなったら、メニューが開いていれば閉じる
    if (screenWidth > breakpoint) {
        if (navToggleButton.classList.contains('is-active')) {
            navToggleButton.classList.remove('is-active');
            mobileNav.classList.remove('is-open');
        }
    }
});

/* =============================================== */
/* ニュース一覧のページネーションコード */
/* =============================================== */
const newsListPage = document.querySelector('.pagination');
if (newsListPage) {
    const itemsPerPage = 5; // ★1ページに表示する記事の数
    const newsItems = document.querySelectorAll('.news-item');
    const totalItems = newsItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentPage = 1;

    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // すべての記事を一旦非表示に
        newsItems.forEach(item => item.style.display = 'none');
        // 表示するべき記事だけを表示
        for (let i = startIndex; i < endIndex && i < totalItems; i++) {
            newsItems[i].style.display = 'block';
        }
        
        updatePagination();
    }

    function updatePagination() {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = ''; // 中身をリセット

        // 「前へ」ボタン
        const prevButton = document.createElement('a');
        prevButton.href = '#';
        prevButton.innerHTML = '&laquo;';
        if (currentPage === 1) {
            prevButton.classList.add('disabled');
        }
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) displayPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevButton);

        // ページ番号ボタン
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.href = '#';
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                displayPage(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        // 「次へ」ボタン
        const nextButton = document.createElement('a');
        nextButton.href = '#';
        nextButton.innerHTML = '&raquo;';
        if (currentPage === totalPages) {
            nextButton.classList.add('disabled');
        }
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) displayPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextButton);
    }

    // 最初のページを表示
    displayPage(1);
}
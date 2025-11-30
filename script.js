// ローカル実行用（同一フォルダとして読み込める）
const IMAGE_INDEX = 'image/index.json';

const gallery = document.getElementById('gallery');
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');

// 画像一覧読み込み
async function loadImages() {
    const res = await fetch(IMAGE_INDEX);
    const data = await res.json();
    const images = data.images;

    images.forEach(file => {
        const img = document.createElement('img');
        img.src = `image/${file}`;
        img.alt = file;

        img.onclick = () => {
            overlayImg.src = img.src;
            overlay.style.display = 'flex';
        };
        
        gallery.appendChild(img);
    });
}

// オーバーレイ閉じる（外側クリック）
overlay.onclick = (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
};

loadImages();

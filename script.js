const BASE_URL = location.origin + "/card_battle/";
const IMAGE_INDEX = BASE_URL + "image/index.json";

const gallery = document.getElementById('gallery');
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');

async function loadImages() {
  const res = await fetch(IMAGE_INDEX);
  const data = await res.json();
  const images = data.images;

  images.forEach(file => {
    const src = BASE_URL + "image/" + file;

    const img = document.createElement('img');
    img.src = src;
    img.alt = file;

    img.onclick = () => {
      overlayImg.src = src;
      overlay.style.display = 'flex';
    };

    gallery.appendChild(img);
  });
}

overlay.onclick = (e) => {
  if (e.target === overlay) overlay.style.display = 'none';
};

loadImages();

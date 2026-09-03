let palCount = 1;
const names = ['COCO', 'LUNA', 'ROKI', 'TORA', 'LEO', 'MUKU', 'CHIP', 'BELL'];
const titles = ['★ おやつハンター', '★ 爆走隊長', '★ 日向ぼっこプロ', '★ いたずら妖精'];
const gridLabels = ['MONTHLY', 'CHARMPOINT', 'FREE', 'FOOD', 'MAIN', 'SLEEPING', 'TOYS', 'FUNNYSHOT', 'QR'];
const myHistoryAlbum = [];
const postDataStore = {};

/* 初期化処理（9マスの自動レンダリングとカスタム設定反映） */
document.addEventListener('DOMContentLoaded', () => {
  renderMainGrid();
  applySavedCustomization();
});

function renderMainGrid() {
  const container = document.getElementById('main-grid-container');
  if (!container) return;

  gridLabels.forEach((lbl, i) => {
    const labelHtml = (i === 2)
      ? `<input type="text" id="custom-free-label" class="grid-label-input" value="FREE" placeholder="タイトル" maxlength="12">`
      : lbl;

    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.innerHTML = `
      <div class="grid-label">${labelHtml}</div>
      <label class="grid-image-box">
        <img id="g${i}">
        <input type="file" accept="image/*" onchange="previewGrid(this, 'g${i}')">
      </label>
    `;
    container.appendChild(gridItem);
  });
}

/* カスタマイズ設定の自動反映 */
function applySavedCustomization() {
  const saved = localStorage.getItem('parmel_custom_config');
  if (!saved) return;

  try {
    const config = JSON.parse(saved);
    const card = document.getElementById('main-palcard');
    const avatarWrapper = document.getElementById('main-avatar-wrapper');
    const petName = document.getElementById('in-name');

    if (card && config.theme) {
      card.className = card.className.replace(/theme-\w+/g, '');
      card.classList.add(config.theme);
    }

    if (avatarWrapper && config.frame) {
      avatarWrapper.className = avatarWrapper.className.replace(/frame-\w+/g, '');
      avatarWrapper.classList.add(config.frame);
    }

    if (petName && config.font) {
      petName.style.fontFamily = `'${config.font}', serif, sans-serif`;
    }
  } catch (e) {
    console.error('カスタマイズ設定の読み込みに失敗しました:', e);
  }
}

/* スワイプ処理 */
const drawer = document.getElementById('side-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const DRAWER_WIDTH = 280;

let startX = 0;
let startY = 0;
let isTracking = false;
let isOpen = false;

function openDrawer() {
  isOpen = true;
  drawer.classList.add('animated');
  drawer.style.transform = `translateX(0px)`;
  drawerOverlay.classList.add('active');
}

function closeDrawer() {
  isOpen = false;
  drawer.classList.add('animated');
  drawer.style.transform = `translateX(-100%)`;
  drawerOverlay.classList.remove('active');
}

window.addEventListener('touchstart', (e) => {
  if (['INPUT', 'BUTTON', 'LABEL', 'TEXTAREA'].includes(e.target.tagName)) return;
  
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isTracking = true;

  drawer.classList.remove('animated');
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!isTracking) return;

  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const diffX = touchX - startX;
  const diffY = Math.abs(touchY - startY);

  if (diffY > Math.abs(diffX) && diffY > 10) {
    isTracking = false;
    return;
  }

  if (!isOpen) {
    if (diffX > 0) {
      let translateX = -DRAWER_WIDTH + diffX;
      if (translateX > 0) translateX = 0;
      drawer.style.transform = `translateX(${translateX}px)`;
      drawerOverlay.style.opacity = Math.min(diffX / DRAWER_WIDTH, 1);
      drawerOverlay.style.pointerEvents = 'auto';
    }
  } else {
    if (diffX < 0) {
      let translateX = diffX;
      if (translateX < -DRAWER_WIDTH) translateX = -DRAWER_WIDTH;
      drawer.style.transform = `translateX(${translateX}px)`;
      drawerOverlay.style.opacity = Math.max(1 + (diffX / DRAWER_WIDTH), 0);
    }
  }
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (!isTracking) return;
  isTracking = false;

  const endX = e.changedTouches[0].clientX;
  const diffX = endX - startX;

  drawerOverlay.style.opacity = '';
  drawerOverlay.style.pointerEvents = '';

  if (!isOpen) {
    if (diffX > 50) {
      openDrawer();
    } else {
      closeDrawer();
    }
  } else {
    if (diffX < -50) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }
}, { passive: true });

function saveAccountSettings() {
  const instaId = document.getElementById('acc-instagram').value.trim();
  const xId = document.getElementById('acc-x').value.trim();

  const btnInsta = document.getElementById('btn-sns-instagram');
  const btnX = document.getElementById('btn-sns-x');

  if (instaId) {
    const cleanInsta = instaId.replace(/^@/, '');
    btnInsta.href = `https://instagram.com/${cleanInsta}`;
    btnInsta.classList.add('active');
  } else {
    btnInsta.classList.remove('active');
  }

  if (xId) {
    const cleanX = xId.replace(/^@/, '');
    btnX.href = `https://x.com/${cleanX}`;
    btnX.classList.add('active');
  } else {
    btnX.classList.remove('active');
  }

  toggleModal('account-modal', false);
  alert('アカウント情報を更新しました！');
}

function generatePalPost() {
  const feed = document.getElementById('feed-container');
  const postId = 'post_' + palCount + '_' + Date.now();
  const rName = names[Math.floor(Math.random() * names.length)];
  const rTitle = titles[Math.floor(Math.random() * titles.length)];
  const avatarUrl = `https://picsum.photos/100?random=avatar_${palCount}_${Math.random()}`;
  
  const isNineGrid = Math.random() > 0.5;

  const userGridImgs = [];
  for (let i = 0; i < 9; i++) {
    userGridImgs.push(`https://picsum.photos/300?random=grid_${palCount}_${i}`);
  }

  postDataStore[postId] = {
    name: rName,
    title: rTitle,
    avatar: avatarUrl,
    gridImgs: userGridImgs,
    customFreeTitle: 'FREE'
  };

  const card = document.createElement('div');
  card.className = 'feed-post-card';
  card.setAttribute('onclick', `openUserProfile('${postId}')`);

  let mediaHtml = '';
  if (isNineGrid) {
    mediaHtml = `<div class="mini-grid-container">`;
    for (let i = 0; i < 9; i++) {
      mediaHtml += `<div class="mini-grid-item"><img src="${userGridImgs[i]}"></div>`;
    }
    mediaHtml += `</div>`;
  } else {
    const singleImg = `https://picsum.photos/400?random=single_${palCount}`;
    mediaHtml = `<div class="single-media-box"><img src="${singleImg}"></div>`;
  }

  card.innerHTML = `
    <div class="feed-header">
      <div class="feed-avatar"><img src="${avatarUrl}"></div>
      <div class="feed-user-info">
        <div class="feed-pet-name">${rName}</div>
        <div class="feed-title">${rTitle}</div>
      </div>
    </div>
    ${mediaHtml}
  `;

  feed.appendChild(card);
  palCount++;
}

function openUserProfile(postId) {
  const data = postDataStore[postId];
  if(!data) return;

  document.getElementById('target-name').innerText = data.name;
  document.getElementById('target-title').innerText = data.title;
  document.getElementById('target-avatar').src = data.avatar;

  const gridContainer = document.getElementById('target-grid-container');
  gridContainer.innerHTML = '';
  gridLabels.forEach((lbl, i) => {
    const imgSrc = data.gridImgs[i] || 'https://picsum.photos/300';
    const displayLabel = (i === 2 && data.customFreeTitle) ? data.customFreeTitle : lbl;

    gridContainer.innerHTML += `
      <div class="grid-item">
        <div class="grid-label">${displayLabel}</div>
        <div class="grid-image-box">
          <img src="${imgSrc}" style="display:block;">
        </div>
      </div>
    `;
  });

  const modal = document.getElementById('user-profile-modal');
  modal.classList.add('active');
}

function closeUserProfile() {
  document.getElementById('user-profile-modal').classList.remove('active');
}

function switchTab(tabName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  if(tabName === 'mypal') {
    document.body.classList.add('mypal-mode');
    document.getElementById('page-mypal').classList.add('active');
    document.getElementById('btn-mypal').classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
  } else if(tabName === 'feed') {
    document.body.classList.remove('mypal-mode');
    document.getElementById('page-feed').classList.add('active');
    document.getElementById('btn-feed').classList.add('active');
    
    const feed = document.getElementById('feed-container');
    if (feed.children.length === 0) {
      generatePalPost();
      generatePalPost();
    }
  }
}

function toggleModal(id, show) {
  const el = document.getElementById(id);
  if (show) { el.style.display = 'flex'; setTimeout(() => el.classList.add('active'), 10); }
  else { el.classList.remove('active'); setTimeout(() => el.style.display = 'none', 200); }
}

function previewImg(input, targetId) {
  if (input.files && input.files[0]) {
    const r = new FileReader();
    r.onload = e => document.getElementById(targetId).src = e.target.result;
    r.readAsDataURL(input.files[0]);
  }
}

function previewGrid(input, imgId) {
  if (input.files && input.files[0]) {
    const r = new FileReader();
    r.onload = e => {
      const img = document.getElementById(imgId);
      img.src = e.target.result;
      img.style.display = 'block';
    };
    r.readAsDataURL(input.files[0]);
  }
}

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && document.getElementById('page-feed').classList.contains('active')) {
    generatePalPost();
  }
}, { rootMargin: '200px' });

const scrollMarker = document.getElementById('scroll-marker');
if (scrollMarker) {
  observer.observe(scrollMarker);
}

function getMyGridImages() {
  const imgs = [];
  for (let i = 0; i < 9; i++) {
    const imgEl = document.getElementById(`g${i}`);
    imgs.push((imgEl && imgEl.src) ? imgEl.src : '');
  }
  return imgs;
}

/* アルバムモーダルを開く＆現在のマスをプレビュー生成 */
function openAlbumModal() {
  const currentImgs = getMyGridImages();
  const previewContainer = document.getElementById('current-grid-preview');
  previewContainer.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const src = currentImgs[i];
    const imgHtml = src ? `<img src="${src}">` : `<div style="width:100%; height:100%; background:#202428;"></div>`;
    previewContainer.innerHTML += `<div class="mini-grid-item">${imgHtml}</div>`;
  }

  toggleModal('history-modal', true);
}

function postToPublicFeed() {
  const name = document.getElementById('in-name').value;
  const title = document.getElementById('in-title').value;
  const avatarSrc = document.getElementById('avatar-img').src;
  const postId = 'post_my_' + Date.now();
  const myGridImgs = getMyGridImages();

  const freeLabelInput = document.getElementById('custom-free-label');
  const customFreeTitle = freeLabelInput ? (freeLabelInput.value.trim() || 'FREE') : 'FREE';

  saveToAlbum(myGridImgs, '投稿');

  postDataStore[postId] = {
    name: name,
    title: title,
    avatar: avatarSrc,
    gridImgs: myGridImgs,
    customFreeTitle: customFreeTitle
  };

  const feed = document.getElementById('feed-container');
  const card = document.createElement('div');
  card.className = 'feed-post-card';
  card.style.borderColor = 'var(--gold)';
  card.setAttribute('onclick', `openUserProfile('${postId}')`);
  
  let mediaHtml = `<div class="mini-grid-container">`;
  for (let i = 0; i < 9; i++) {
    const src = myGridImgs[i] || 'https://picsum.photos/300?random=empty';
    mediaHtml += `<div class="mini-grid-item"><img src="${src}"></div>`;
  }
  mediaHtml += `</div>`;

  card.innerHTML = `
    <div class="feed-header">
      <div class="feed-avatar"><img src="${avatarSrc}"></div>
      <div class="feed-user-info">
        <div class="feed-pet-name">${name}</div>
        <div class="feed-title">${title}</div>
      </div>
    </div>
    ${mediaHtml}
  `;
  feed.prepend(card);
  switchTab('feed');
  alert('「みんなのパル」に投稿しました！');
}

/* アルバム内で「現在の9マスを保存」を押したときの処理 */
function saveCurrentGridOnly() {
  const myGridImgs = getMyGridImages();
  saveToAlbum(myGridImgs, '保存');
  alert('現在の9マスをアルバムに保存しました！');
}

function saveToAlbum(imgs, typeStr) {
  const albumList = document.getElementById('album-list');
  if(myHistoryAlbum.length === 0) albumList.innerHTML = '';

  const now = new Date();
  const dateStr = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  myHistoryAlbum.push({ date: dateStr, imgs: imgs });

  const itemHtml = document.createElement('div');
  itemHtml.className = 'album-history-item';
  
  let gridInner = `<div class="album-date">📅 ${dateStr} (${typeStr})</div><div class="mini-grid-container">`;
  for (let i = 0; i < 9; i++) {
    const src = imgs[i] || 'https://picsum.photos/300?random=empty';
    gridInner += `<div class="mini-grid-item"><img src="${src}"></div>`;
  }
  gridInner += `</div>`;
  itemHtml.innerHTML = gridInner;

  albumList.prepend(itemHtml);
}

function presentCard() {
  const cardSrc = document.getElementById('main-palcard');
  const clone = cardSrc.cloneNode(true);
  clone.removeAttribute('id');
  
  const origInputs = cardSrc.querySelectorAll('input');
  const cloneInputs = clone.querySelectorAll('input');
  origInputs.forEach((inp, idx) => {
    cloneInputs[idx].value = inp.value;
  });

  const footer = clone.querySelector('.palcard-footer');
  if (footer) footer.style.display = 'none';

  const container = document.getElementById('present-card-container');
  container.innerHTML = '';
  container.appendChild(clone);

  const modal = document.getElementById('card-present-modal');
  modal.classList.add('active');
}

function closePresentCard() {
  const modal = document.getElementById('card-present-modal');
  modal.classList.remove('active');
}

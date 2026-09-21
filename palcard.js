(function (global) {
  var PALCARD_DEFAULTS = {
    theme: 'theme-dark',
    cardEdge: 'cardedge-none',
    bundle: 'bundle-none',
    frame: 'frame-none',
    title: 'SLEEPY',
    petName: 'MEL',
    birthday: '2026-02-10',
    nickname: 'メルちゃん',
    message: 'こんにちは',
    avatarScale: 1,
    avatarX: 0,
    avatarY: 0,
    gender: '',
    species: '',
    breed: ''
  };

  var PALCARD_VIEW_PLACEHOLDER =
    'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg';

  // 表側内部 ID 契約（カード本体 #preview-palcard / #main-palcard はページ側）
  var PALCARD_FRONT_IDS = {
    title: 'pal-title',
    petName: 'pal-name',
    birthday: 'pal-birthday',
    nickname: 'pal-nickname',
    message: 'pal-message',
    pallike: 'pal-pallike',
    gender: 'pal-gender',
    species: 'pal-species',
    breed: 'pal-breed',
    avatar: 'pal-avatar',
    avatarImg: 'pal-avatar-img',
    avatarEmpty: 'pal-avatar-empty',
    footer: 'pal-footer',
    presentName: 'pal-present-name'
  };

  function findFrontEl(root, id) {
    var el;
    if (root && root.querySelector) {
      el = root.querySelector('#' + id);
      if (el) return el;
    }
    return document.getElementById(id);
  }

  function palFrontEl(root, key) {
    return findFrontEl(root, PALCARD_FRONT_IDS[key]);
  }

  function palSvgIcon(pathMarkup) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      pathMarkup +
      '</svg>'
    );
  }

  function palProfileSvgIcon(pathMarkup) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      pathMarkup +
      '</svg>'
    );
  }

  function palcardFrontMarkup() {
    var iconCat = palProfileSvgIcon(
      '<path d="M4.8 10.8L3.4 4.2l5.2 2.8"/><path d="M19.2 10.8l1.4-6.6-5.2 2.8"/><circle cx="12" cy="13.4" r="6.6"/><path d="M9.8 16.2h4.4"/><circle cx="9.4" cy="12.5" r="0.75" fill="currentColor" stroke="none"/><circle cx="14.6" cy="12.5" r="0.75" fill="currentColor" stroke="none"/>'
    );
    var iconPaw = palProfileSvgIcon(
      '<ellipse cx="12" cy="16.6" rx="5.1" ry="3.9"/><circle cx="5.6" cy="10.4" r="2.15"/><circle cx="9.6" cy="7.6" r="2.15"/><circle cx="14.4" cy="7.6" r="2.15"/><circle cx="18.4" cy="10.4" r="2.15"/>'
    );
    var iconCal = palProfileSvgIcon(
      '<rect x="3.8" y="5.4" width="16.4" height="14.4" rx="2"/><path d="M8 3.8v4.2M16 3.8v4.2M3.8 10.6h16.4"/>'
    );
    var iconMsg = palProfileSvgIcon(
      '<path d="M4.2 5.4h15.6A2.2 2.2 0 0 1 22 7.6v7.2a2.2 2.2 0 0 1-2.2 2.2h-6.4L8.2 21v-4H4.2A2.2 2.2 0 0 1 2 14.8V7.6a2.2 2.2 0 0 1 2.2-2.2z"/>'
    );
    var iconHeart = palSvgIcon(
      '<path d="M12 19s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 4.65-7 9-7 9z"/>'
    );
    var iconLink = palSvgIcon(
      '<path d="M10 13a5 5 0 0 0 7.07.07l1.41-1.41a5 5 0 1 0-7.07-7.07L10 6.07"/><path d="M14 11a5 5 0 0 0-7.07-.07L5.52 12.34a5 5 0 0 0 7.07 7.07L14 17.93"/>'
    );
    var iconGift = palSvgIcon(
      '<rect x="4" y="11" width="16" height="9" rx="1"/><path d="M4 11h16v3H4zM12 11v9"/><path d="M12 11c-1.8-3.8-5.5-3.2-5.5-1.4S10 11 12 11"/><path d="M12 11c1.8-3.8 5.5-3.2 5.5-1.4S14 11 12 11"/>'
    );

    return (
      '<div class="palcard-body">' +
        '<div class="profile-info">' +
          '<div class="palcard-brand">PALCARD</div>' +
          '<div id="pal-title" class="user-title-display">SLEEPY</div>' +
          '<div class="pet-name-slot">' +
            '<div class="pet-name pet-name-latin" id="pal-name">MEL</div>' +
          '</div>' +
          '<div class="pal-nickname-line">' +
            '<span id="pal-nickname">メルちゃん</span>' +
            '<span id="pal-gender"></span>' +
          '</div>' +
          '<div class="profile-fields">' +
            '<div class="field-row pal-field-species">' +
              '<span class="pal-field-icon" aria-hidden="true">' + iconCat + '</span>' +
              '<div class="field-value" id="pal-species"></div>' +
            '</div>' +
            '<div class="field-row pal-field-breed">' +
              '<span class="pal-field-icon" aria-hidden="true">' + iconPaw + '</span>' +
              '<div class="field-value" id="pal-breed"></div>' +
            '</div>' +
            '<div class="field-row pal-field-birthday">' +
              '<span class="pal-field-icon" aria-hidden="true">' + iconCal + '</span>' +
              '<div class="field-value" id="pal-birthday">2026.02.10</div>' +
            '</div>' +
            '<div class="field-row pal-field-message">' +
              '<span class="pal-field-icon" aria-hidden="true">' + iconMsg + '</span>' +
              '<div class="field-value" id="pal-message">こんにちは</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="right-avatar-container">' +
          '<div class="avatar-wrapper frame-none" id="pal-avatar" role="button" aria-label="ペット写真を編集">' +
            '<div class="avatar-inner">' +
              '<img id="pal-avatar-img" alt="ペット写真">' +
              '<div class="avatar-empty" id="pal-avatar-empty">' +
                '<div class="avatar-empty-icon">＋</div>' +
                '<div>タップして写真を設定</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="present-pet-name" id="pal-present-name" style="display:none;">MEL</div>' +
        '</div>' +
        '<input id="avatar-file-input" type="file" accept="image/*" hidden>' +
      '</div>' +
      '<div class="palcard-footer" id="pal-footer">' +
        '<div class="footer-left-group" data-palcard-footer="pallike">' +
          '<span class="pal-field-icon pal-pallike-icon" aria-hidden="true">' + iconHeart + '</span>' +
          '<span class="pal-pallike-label">PALLIKE</span>' +
          '<span id="pal-pallike">0</span>' +
        '</div>' +
        '<div class="footer-left-group" data-palcard-footer="actions">' +
          '<button type="button" class="icon-btn" data-palcard-action="palink">' +
            '<span class="pal-field-icon pal-action-icon" aria-hidden="true">' + iconLink + '</span>' +
            '<span>PALINK</span>' +
          '</button>' +
          '<button type="button" class="icon-btn" data-palcard-action="get">' +
            '<span class="pal-field-icon pal-action-icon" aria-hidden="true">' + iconGift + '</span>' +
            '<span>GET</span>' +
          '</button>' +
          '<input type="file" accept="image/*" capture="environment" data-palcard-action="get-input" hidden>' +
        '</div>' +
      '</div>'
    );
  }

  function formatPalcardBirthday(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return '';
    var parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return parts[0] + '.' + parts[1] + '.' + parts[2];
  }

  function normalizePalcardConfig(config) {
    var merged = {};
    var key;
    for (key in PALCARD_DEFAULTS) {
      if (Object.prototype.hasOwnProperty.call(PALCARD_DEFAULTS, key)) {
        merged[key] = PALCARD_DEFAULTS[key];
      }
    }
    if (config && typeof config === 'object') {
      for (key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key) && config[key] !== undefined) {
          merged[key] = config[key];
        }
      }
    }
    if (typeof merged.petName !== 'string') merged.petName = PALCARD_DEFAULTS.petName;
    if (typeof merged.birthday !== 'string') merged.birthday = PALCARD_DEFAULTS.birthday;
    if (typeof merged.nickname !== 'string') merged.nickname = PALCARD_DEFAULTS.nickname;
    if (typeof merged.message !== 'string') merged.message = PALCARD_DEFAULTS.message;
    if (typeof merged.title !== 'string') merged.title = PALCARD_DEFAULTS.title;
    if (!merged.bundle) merged.bundle = PALCARD_DEFAULTS.bundle;
    if (!merged.theme) merged.theme = PALCARD_DEFAULTS.theme;
    if (!merged.cardEdge) merged.cardEdge = PALCARD_DEFAULTS.cardEdge;
    if (!merged.frame) merged.frame = PALCARD_DEFAULTS.frame;
    if (!merged.avatarScale) merged.avatarScale = 1;
    if (typeof merged.avatarX !== 'number') merged.avatarX = 0;
    if (typeof merged.avatarY !== 'number') merged.avatarY = 0;
    if (typeof merged.gender !== 'string') merged.gender = '';
    if (typeof merged.species !== 'string') merged.species = '';
    if (typeof merged.breed !== 'string') merged.breed = '';
    return merged;
  }

  function loadPalcardConfig() {
    var raw = localStorage.getItem('palmel_custom_config') || localStorage.getItem('parmel_custom_config');
    if (!raw) return normalizePalcardConfig(null);
    try {
      return normalizePalcardConfig(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load palcard config', e);
      return normalizePalcardConfig(null);
    }
  }

  function loadPalcardAvatarImage() {
    return localStorage.getItem('palmel_avatar_image') || '';
  }

  function applyPalcardAvatarTransform(img, config) {
    if (!img) return;
    var data = normalizePalcardConfig(config);
    img.style.objectPosition = '50% 50%';
    img.style.transformOrigin = 'center';
    img.style.transform = 'translate(' + (data.avatarX || 0) + 'px, ' + (data.avatarY || 0) + 'px) scale(' + (data.avatarScale || 1) + ')';
  }

  function palcardPetNameHasJp(text) {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text || '');
  }

  function applyPalcardPetNameScriptClass(nameEl, name) {
    if (!nameEl || !nameEl.classList) return;
    var isJp = palcardPetNameHasJp(name);
    nameEl.classList.toggle('pet-name-jp', isJp);
    nameEl.classList.toggle('pet-name-latin', !isJp);
  }

  function adjustPalcardPetNameSize(nameEl) {
    if (!nameEl) return;
    var card = nameEl.closest ? nameEl.closest('.palcard') : null;
    if (card && /bundle-sakura|bundle-wave|bundle-bamboo|bundle-ume/.test(card.className)) return;
    var isJp = nameEl.classList && nameEl.classList.contains('pet-name-jp');
    var maxPx = isJp ? 34 : 44;
    var minPx = 16;
    var sizePx = maxPx;
    var guard = 0;
    nameEl.style.whiteSpace = 'nowrap';
    nameEl.style.overflow = 'hidden';
    nameEl.style.textOverflow = 'clip';
    nameEl.style.fontSize = sizePx + 'px';
    if (!nameEl.clientWidth) return;
    while (nameEl.scrollWidth > nameEl.clientWidth && sizePx > minPx && guard < 40) {
      sizePx -= 1;
      nameEl.style.fontSize = sizePx + 'px';
      guard += 1;
    }
  }

  function schedulePalcardPetNameSize(nameEl) {
    if (!nameEl) return;
    adjustPalcardPetNameSize(nameEl);
    requestAnimationFrame(function () {
      adjustPalcardPetNameSize(nameEl);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        adjustPalcardPetNameSize(nameEl);
      });
    }
  }

  function applyPalcardConfig(cardEl, config, options) {
    var data = normalizePalcardConfig(config);
    var opts = options || {};
    var bundleActive = data.bundle && data.bundle !== 'bundle-none';
    var titleEl;
    var avatar;
    var img;
    var empty;
    var presentName;
    var avatarImage;
    var mode;

    if (cardEl) {
      var extra = [];
      var modeAttr = cardEl.getAttribute('data-palcard-mode');
      if (cardEl.classList.contains('is-presented')) extra.push('is-presented');
      if (cardEl.classList.contains('palcard-back')) extra.push('palcard-back');
      if (bundleActive) {
        cardEl.className = ('palcard ' + data.bundle + ' ' + extra.join(' ')).trim();
      } else {
        cardEl.className = ('palcard ' + data.theme + ' ' + data.cardEdge + ' ' + extra.join(' ')).trim();
      }
      if (modeAttr) cardEl.setAttribute('data-palcard-mode', modeAttr);
    }

    mode = (cardEl && cardEl.getAttribute('data-palcard-mode')) || opts.mode || '';

    avatar = palFrontEl(cardEl, 'avatar');
    if (avatar) {
      avatar.className = bundleActive ? 'avatar-wrapper frame-none' : 'avatar-wrapper ' + data.frame;
    }

    titleEl = palFrontEl(cardEl, 'title');
    if (titleEl) {
      titleEl.textContent = data.title;
      if (data.title === 'GOD') {
        titleEl.classList.add('sparkle-text');
      } else {
        titleEl.classList.remove('sparkle-text');
      }
    }

    var petNameEl = palFrontEl(cardEl, 'petName');
    var birthdayEl = palFrontEl(cardEl, 'birthday');
    var nicknameEl = palFrontEl(cardEl, 'nickname');
    var messageEl = palFrontEl(cardEl, 'message');
    var genderEl = palFrontEl(cardEl, 'gender');
    var speciesEl = palFrontEl(cardEl, 'species');
    var breedEl = palFrontEl(cardEl, 'breed');
    if (petNameEl) {
      petNameEl.textContent = data.petName || '';
      applyPalcardPetNameScriptClass(petNameEl, data.petName || '');
    }
    schedulePalcardPetNameSize(petNameEl);
    if (birthdayEl) birthdayEl.textContent = formatPalcardBirthday(data.birthday);
    if (nicknameEl) nicknameEl.textContent = data.nickname || '';
    if (genderEl) genderEl.textContent = data.gender || '';
    if (speciesEl) speciesEl.textContent = data.species || '';
    if (breedEl) breedEl.textContent = data.breed || '';
    if (messageEl) messageEl.textContent = data.message || '';

    presentName = palFrontEl(cardEl, 'presentName');
    if (presentName) presentName.textContent = data.petName || '';

    img = palFrontEl(cardEl, 'avatarImg');
    empty = palFrontEl(cardEl, 'avatarEmpty');
    avatarImage = Object.prototype.hasOwnProperty.call(opts, 'avatarImage')
      ? (opts.avatarImage || '')
      : loadPalcardAvatarImage();
    if (img && avatarImage) {
      img.src = avatarImage;
      applyPalcardAvatarTransform(img, data);
    }
    if (empty && mode === 'view') {
      empty.style.display = 'none';
    }
  }

  function renderPalcardFront(target, options) {
    var cardEl = typeof target === 'string' ? document.getElementById(target) : target;
    var opts = options || {};
    var mode = opts.mode || 'view';
    var config;
    var img;
    var empty;
    var savedImage;

    if (!cardEl) return null;

    cardEl.setAttribute('data-palcard-mode', mode);
    cardEl.innerHTML = palcardFrontMarkup();

    empty = palFrontEl(cardEl, 'avatarEmpty');
    img = palFrontEl(cardEl, 'avatarImg');

    if (mode === 'view') {
      if (empty) empty.style.display = 'none';
      savedImage = Object.prototype.hasOwnProperty.call(opts, 'avatarImage')
        ? (opts.avatarImage || '')
        : loadPalcardAvatarImage();
      if (img && !savedImage) {
        img.src = opts.placeholderSrc || PALCARD_VIEW_PLACEHOLDER;
      }
    }

    if (opts.apply !== false) {
      config = opts.config || loadPalcardConfig();
      applyPalcardConfig(cardEl, config, opts);
    }

    return cardEl;
  }

  global.PALCARD_DEFAULTS = PALCARD_DEFAULTS;
  global.PALCARD_FRONT_IDS = PALCARD_FRONT_IDS;
  global.formatPalcardBirthday = formatPalcardBirthday;
  global.normalizePalcardConfig = normalizePalcardConfig;
  global.loadPalcardConfig = loadPalcardConfig;
  global.loadPalcardAvatarImage = loadPalcardAvatarImage;
  global.applyPalcardAvatarTransform = applyPalcardAvatarTransform;
  global.applyPalcardConfig = applyPalcardConfig;
  global.adjustPalcardPetNameSize = adjustPalcardPetNameSize;
  global.renderPalcardFront = renderPalcardFront;
  global.palFrontEl = palFrontEl;
})(window);

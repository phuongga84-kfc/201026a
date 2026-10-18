/**
 * ============================================================================
 * 20-10 STUDIO EDITOR - APPLICATION LOGIC
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Default State & Memory
  // --------------------------------------------------------------------------
  let STATE = {
    title: 'Gửi Người Phụ Nữ Tôi Yêu Thương Nhất,',
    p1: 'Nhân ngày Phụ nữ Việt Nam 20/10, chúc em luôn luôn xinh đẹp, rạng rỡ như đóa hồng sớm mai ngát hương và ngập tràn hạnh phúc.',
    p2: 'Cảm ơn vì đã luôn mang đến sự ấm áp, nụ cười ngọt ngào và những điều tuyệt vời nhất cho thế giới này. Mong em mỗi ngày đều bình an, được yêu thương và nâng niu trọn vẹn!',
    quote: '"Bạn xứng đáng nhận được tất cả những điều dịu dàng và diệu kỳ nhất của cuộc sống này."',
    signature: '20 · 10 · Với tất cả sự trân trọng 🌸',
    shape: 'tree', // 'heart' | 'tree' | 'both'
    theme: 'pink',  // 'pink' | 'gold' | 'purple' | 'cyan'
    wishes: [
      {
        sender: 'Người thương',
        text: 'Cầu chúc em luôn an yên, mỉm cười thật tươi và luôn hạnh phúc mỗi ngày! 💖'
      },
      {
        sender: 'Trân trọng gửi trao',
        text: 'Chúc bạn một ngày 20/10 ngập tràn hoa, quà và những điều ngọt ngào nhất! 🌹'
      },
      {
        sender: 'Tình yêu dịu dàng',
        text: 'Dù ở bất cứ đâu, chúc người phụ nữ tuyệt vời luôn tỏa sáng rạng ngời! ✨'
      }
    ]
  };

  // Load any previously saved draft from localStorage
  try {
    const saved = localStorage.getItem('20_10_gift_config');
    if (saved) {
      STATE = Object.assign({}, STATE, JSON.parse(saved));
    }
  } catch (e) {}

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const titleInput = document.getElementById('cfg-title');
  const p1Input = document.getElementById('cfg-p1');
  const p2Input = document.getElementById('cfg-p2');
  const quoteInput = document.getElementById('cfg-quote');
  const sigInput = document.getElementById('cfg-signature');

  const shapeRadios = document.querySelectorAll('input[name="cfg-shape"]');
  const themeRadios = document.querySelectorAll('input[name="cfg-theme"]');

  const wishesListEl = document.getElementById('wishes-list');
  const newSenderInput = document.getElementById('new-wish-sender');
  const newTextInput = document.getElementById('new-wish-text');
  const btnAddWish = document.getElementById('btn-add-wish');

  const summaryShapeText = document.getElementById('summary-shape-text');
  const summaryThemeText = document.getElementById('summary-theme-text');
  const summaryWishCount = document.getElementById('summary-wish-count');

  const exportModal = document.getElementById('export-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const shareableLinkInput = document.getElementById('shareable-link-input');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const btnOpenLinkDirect = document.getElementById('btn-open-link-direct');

  const btnExportTop = document.getElementById('btn-export-top');
  const btnExportMain = document.getElementById('btn-export-main');
  const btnQuickPreview = document.getElementById('btn-quick-preview');
  const btnPreviewBottom = document.getElementById('btn-preview-bottom');

  const toastEl = document.getElementById('toast');

  // --------------------------------------------------------------------------
  // Initialize UI with State
  // --------------------------------------------------------------------------
  function populateUI() {
    titleInput.value = STATE.title;
    p1Input.value = STATE.p1;
    p2Input.value = STATE.p2;
    quoteInput.value = STATE.quote;
    sigInput.value = STATE.signature;

    shapeRadios.forEach(r => {
      r.checked = (r.value === STATE.shape);
    });

    themeRadios.forEach(r => {
      r.checked = (r.value === STATE.theme);
    });

    renderWishes();
    updateSummary();
  }

  // --------------------------------------------------------------------------
  // Wishes Management
  // --------------------------------------------------------------------------
  function renderWishes() {
    wishesListEl.innerHTML = '';

    if (!STATE.wishes || STATE.wishes.length === 0) {
      wishesListEl.innerHTML = '<div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); padding: 6px 0;">Chưa có lời chúc treo nào. Hãy thêm lời chúc bên dưới!</div>';
      return;
    }

    STATE.wishes.forEach((w, index) => {
      const row = document.createElement('div');
      row.className = 'wish-item-row';
      row.innerHTML = `
        <div class="wish-item-info">
          <strong>🏮 ${escapeHtml(w.sender)}</strong>
          <span>"${escapeHtml(w.text)}"</span>
        </div>
        <button type="button" class="btn-remove-wish" data-idx="${index}" title="Xóa lời chúc này">✕</button>
      `;
      wishesListEl.appendChild(row);
    });

    // Attach delete listeners
    document.querySelectorAll('.btn-remove-wish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.idx, 10);
        STATE.wishes.splice(idx, 1);
        saveDraft();
        renderWishes();
        updateSummary();
        showToast('🗑️ Đã xóa lời chúc.');
      });
    });
  }

  btnAddWish.addEventListener('click', () => {
    const sender = newSenderInput.value.trim() || 'Người gửi ẩn danh';
    const text = newTextInput.value.trim();

    if (!text) {
      showToast('⚠️ Vui lòng nhập nội dung lời chúc!');
      return;
    }

    STATE.wishes.push({ sender, text });
    newTextInput.value = '';
    saveDraft();
    renderWishes();
    updateSummary();
    showToast('✨ Đã thêm lời chúc vào danh sách!');
  });

  // --------------------------------------------------------------------------
  // Summary & State Sync
  // --------------------------------------------------------------------------
  function updateSummary() {
    const shapeNames = {
      heart: 'Trái Tim Neon Lấp Lánh',
      tree: 'Cây Ước Nguyện 3D Rực Rỡ',
      both: 'Trái Tim bung nở thành Cây 3D'
    };
    summaryShapeText.innerText = shapeNames[STATE.shape] || 'Cây Ước Nguyện 3D';

    const themeNames = {
      pink: 'Hồng Lãng Mạn (Sakura)',
      gold: 'Vàng Ánh Kim (Rose Gold)',
      purple: 'Tím Huyền Ảo (Lavender)',
      cyan: 'Lam Ngọc (Crystal)'
    };
    summaryThemeText.innerText = themeNames[STATE.theme] || 'Hồng Lãng Mạn';

    summaryWishCount.innerText = `${STATE.wishes.length} lời chúc`;
  }

  function readFormInputs() {
    STATE.title = titleInput.value.trim() || 'Gửi Người Phụ Nữ Tuyệt Vời,';
    STATE.p1 = p1Input.value.trim();
    STATE.p2 = p2Input.value.trim();
    STATE.quote = quoteInput.value.trim();
    STATE.signature = sigInput.value.trim() || '20 · 10 · Special Gift 🌸';

    shapeRadios.forEach(r => {
      if (r.checked) STATE.shape = r.value;
    });

    themeRadios.forEach(r => {
      if (r.checked) STATE.theme = r.value;
    });
  }

  // Auto-save draft on any input change
  [titleInput, p1Input, p2Input, quoteInput, sigInput].forEach(inp => {
    inp.addEventListener('input', () => {
      readFormInputs();
      saveDraft();
    });
  });

  shapeRadios.forEach(r => {
    r.addEventListener('change', () => {
      readFormInputs();
      saveDraft();
      updateSummary();
    });
  });

  themeRadios.forEach(r => {
    r.addEventListener('change', () => {
      readFormInputs();
      saveDraft();
      updateSummary();
    });
  });

  function saveDraft() {
    try {
      localStorage.setItem('20_10_gift_config', JSON.stringify(STATE));
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // Link Generation & Export
  // --------------------------------------------------------------------------
  // UTF-8 Safe Base64 Encoder
  function encodeData(data) {
    const json = JSON.stringify(data);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  }

  function generateViewerUrl() {
    readFormInputs();
    saveDraft();

    const encoded = encodeData(STATE);
    const origin = window.location.origin;
    let pathname = window.location.pathname;

    // Replace index.html with view.html
    if (pathname.endsWith('index.html')) {
      pathname = pathname.replace('index.html', 'view.html');
    } else if (pathname.endsWith('/')) {
      pathname = pathname + 'view.html';
    } else {
      pathname = pathname + '/view.html';
    }

    return `${origin}${pathname}?d=${encoded}`;
  }

  function openExportModal() {
    const link = generateViewerUrl();
    shareableLinkInput.value = link;
    btnOpenLinkDirect.href = link;
    exportModal.classList.remove('hidden');
  }

  btnExportTop.addEventListener('click', openExportModal);
  btnExportMain.addEventListener('click', openExportModal);

  btnCloseModal.addEventListener('click', () => {
    exportModal.classList.add('hidden');
  });

  // Copy Link
  btnCopyLink.addEventListener('click', () => {
    shareableLinkInput.select();
    shareableLinkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareableLinkInput.value).then(() => {
      showToast('📋 Đã sao chép link! Bạn có thể dán và gửi ngay.');
      btnCopyLink.innerText = '✅ Đã Sao Chép!';
      setTimeout(() => {
        btnCopyLink.innerText = '📋 Sao Chép Link';
      }, 2500);
    }).catch(() => {
      document.execCommand('copy');
      showToast('📋 Đã sao chép link!');
    });
  });

  // Preview Buttons
  function openPreviewInNewTab() {
    const link = generateViewerUrl();
    window.open(link, '_blank');
  }

  btnQuickPreview.addEventListener('click', openPreviewInNewTab);
  btnPreviewBottom.addEventListener('click', openPreviewInNewTab);

  // --------------------------------------------------------------------------
  // Helper Functions
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    toastEl.innerText = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Load
  populateUI();

})();

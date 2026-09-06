function toggleSidebar() {
    DOM.sidebar.classList.toggle('open');
    DOM.sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = DOM.sidebar.classList.contains('open') ? 'hidden' : '';
    playClickSound();
}

function closeSidebar() {
    DOM.sidebar.classList.remove('open');
    DOM.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    DOM.themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    try { localStorage.setItem('zenvs-theme', newTheme); } catch(e) {}
    playClickSound();
}

function loadTheme() {
    let saved = 'light';
    try { saved = localStorage.getItem('zenvs-theme') || 'light'; } catch(e) {}
    document.documentElement.setAttribute('data-theme', saved);
    DOM.themeIcon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function openShareModal() {
    DOM.shareOverlay.classList.add('active');
    closeSidebar();
    playClickSound();
}

function closeShareModal() {
    DOM.shareOverlay.classList.remove('active');
    playClickSound();
}

function nativeShare() {
    if (navigator.share) {
        navigator.share({ title: 'Zenvs', text: CONFIG.SHARE_TEXT, url: CONFIG.APP_URL }).catch(() => {});
    } else { copyLink(); }
    closeShareModal();
    playClickSound();
}

function copyLink() {
    navigator.clipboard.writeText(CONFIG.SHARE_TEXT + '\n\n' + CONFIG.APP_URL).then(() => {
        DOM.copySuccess.textContent = '✅ Berhasil disalin!';
        DOM.copySuccess.classList.remove('hidden');
        setTimeout(() => DOM.copySuccess.classList.add('hidden'), 3000);
    }).catch(() => {});
    closeShareModal();
    playClickSound();
}

function shareTo(platform) {
    const text = encodeURIComponent(CONFIG.SHARE_TEXT);
    let url = '';
    switch(platform) {
        case 'whatsapp': url = `https://wa.me/?text=${text}%0A%0A${encodeURIComponent(CONFIG.APP_URL)}`; break;
        case 'telegram': url = `https://t.me/share/url?url=${encodeURIComponent(CONFIG.APP_URL)}&text=${text}`; break;
        case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(CONFIG.APP_URL)}&quote=${text}`; break;
        case 'twitter': url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(CONFIG.APP_URL)}`; break;
        case 'email': url = `mailto:?subject=Zenvs&body=${text}%0A%0A${encodeURIComponent(CONFIG.APP_URL)}`; break;
        default: return;
    }
    if (url) { window.open(url, '_blank'); closeShareModal(); playClickSound(); }
}

function openAbout() {
    closeSidebar();
    document.getElementById('infoIcon').textContent = '👨‍💻';
    document.getElementById('infoTitle').textContent = 'Tentang Pembuat';
    document.getElementById('infoDesc').innerHTML = `
        <strong>Nama:</strong> Jar<br>
        <strong>Profesi:</strong> Fullstack Developer<br><br>
        Zenvs adalah project open-source untuk memudahkan download video dari berbagai platform.<br><br>
        <strong>Fitur:</strong><br>
        ✅ Tanpa watermark<br>
        ✅ Tanpa limit<br>
        ✅ Super cepat
    `;
    DOM.infoModal.classList.add('active');
    playClickSound();
}

function closeInfoModal() {
    DOM.infoModal.classList.remove('active');
    playClickSound();
}

function openChannelWA() {
    closeSidebar();
    window.open('https://whatsapp.com/channel/0029Vb83whu6WaKfFbCOPG1o', '_blank');
    playClickSound();
}

function openPreview(url, title, author, duration) {
    DOM.previewVideo.src = url;
    DOM.previewVideo.load();
    DOM.previewTitleModal.textContent = title || 'Video';
    DOM.previewAuthorModal.textContent = author || '@user';
    DOM.previewDuration.textContent = duration || '00:00';
    DOM.previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playClickSound();
}

function closePreview() {
    DOM.previewVideo.pause();
    DOM.previewVideo.src = '';
    DOM.previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

async function pasteText() {
    playClickSound();
    hideError();
    try {
        const text = await navigator.clipboard.readText();
        if (text) DOM.urlInput.value = text;
    } catch {
        showError('Gagal baca clipboard.');
    }
}

function playClickSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAACBhYqFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYaFhYU=');
        audio.volume = 0.10;
        audio.play().catch(() => {});
    } catch(e) {}
}

function showError(msg) {
    DOM.errorBox.classList.remove('hidden');
    DOM.errorText.innerText = msg;
}

function hideError() {
    DOM.errorBox.classList.add('hidden');
}

function showNotif(text, icon = 'fa-solid fa-check-circle', color = '#28a745') {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; bottom: 28px; right: 28px;
        background: var(--bg-card-solid);
        border: 2px solid var(--border);
        box-shadow: 8px 8px 0 var(--shadow);
        padding: 0.8rem 1.6rem;
        z-index: 999;
        max-width: 340px;
        animation: slideUp 0.4s ease forwards;
        color: var(--text);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 12px;
    `;
    container.innerHTML = `<i class="${icon}" style="color:${color};font-size:1.4rem;"></i><span style="font-weight:700;font-size:0.85rem;">${text}</span>`;
    container.onclick = function() { this.remove(); };
    document.body.appendChild(container);
    setTimeout(() => { if (container.parentElement) container.remove(); }, 3000);
}

const toastData = [
    { icon: '📢', title: 'Gabung Channel Zenvs!', desc: 'Dapatkan update terbaru dan fitur baru.', btnText: 'Gabung', btnLink: 'https://whatsapp.com/channel/0029Vb83whu6WaKfFbCOPG1o', isChannel: true },
    { icon: '💡', title: 'Tips Download', desc: 'Pastikan link yang kamu tempel adalah link publik.', btnText: 'Lanjut', isChannel: false },
    { icon: '🔥', title: 'Zenvs All-in-One!', desc: 'Support YouTube, TikTok, IG, FB, Twitter, WhatsApp.', btnText: 'Lanjut', isChannel: false },
    { icon: '⚠️', title: 'Peringatan', desc: 'Dilarang mengunduh konten ilegal. Gunakan dengan bijak!', btnText: 'Saya Mengerti', isChannel: false },
    { icon: '👨‍💻', title: 'Tentang Pembuat', desc: 'Zenvs dibuat oleh Jar, Fullstack Developer.', btnText: 'Mulai', isChannel: false }
];
let currentToastStep = 0;

function showToastStep(step) {
    const data = toastData[step];
    if (!data) return;
    let btnHTML = '';
    if (data.isChannel) {
        btnHTML = `
            <a href="${data.btnLink}" target="_blank" class="channel-btn" onclick="playClickSound();">
                <i class="fa-brands fa-whatsapp"></i> ${data.btnText}
            </a>
            <button class="toast-btn-secondary" onclick="playClickSound(); nextToastStep();">Lewati</button>
        `;
    } else if (step === toastData.length - 1) {
        btnHTML = `<button class="toast-btn" onclick="playClickSound(); closeToast();">${data.btnText}</button>`;
    } else {
        btnHTML = `<button class="toast-btn" onclick="playClickSound(); nextToastStep();">${data.btnText}</button>`;
    }
    DOM.toastContent.innerHTML = `
        <div class="logo"><i class="fa-solid fa-download" style="color:var(--accent-1);font-size:2rem;"></i></div>
        <div class="step-badge">${step + 1} / ${toastData.length}</div>
        <h2>${data.icon} ${data.title}</h2>
        <p>${data.desc}</p>
        <div class="btn-group">${btnHTML}</div>
    `;
    DOM.toastOverlay.classList.add('active');
}

function nextToastStep() {
    currentToastStep++;
    if (currentToastStep < toastData.length) { showToastStep(currentToastStep); } else { closeToast(); }
}

function closeToast() {
    DOM.toastOverlay.classList.remove('active');
    playClickSound();
}

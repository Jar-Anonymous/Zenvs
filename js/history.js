function getHistory() {
    try { return JSON.parse(localStorage.getItem('zenvs-history') || '[]'); } catch(e) { return []; }
}

function saveHistory(videoData) {
    const history = getHistory();
    const item = {
        id: Date.now(),
        title: videoData.title || 'Video Zenvs',
        author: videoData.author || 'Unknown',
        thumbnail: videoData.thumbnail || 'https://placehold.co/100x100',
        url: videoData.url || '',
        date: new Date().toLocaleString()
    };
    history.unshift(item);
    if (history.length > CONFIG.MAX_HISTORY) history.pop();
    try { localStorage.setItem('zenvs-history', JSON.stringify(history)); } catch(e) {}
    renderHistory();
}

function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
        DOM.historyContainer.innerHTML = `<div class="history-empty"><i class="fa-solid fa-inbox"></i>Belum ada riwayat</div>`;
        return;
    }
    DOM.historyContainer.innerHTML = history.map(item => `
        <div class="history-item" onclick="reDownload('${item.url}')">
            <img src="${item.thumbnail}" alt="${item.title}" onerror="this.src='https://placehold.co/100x100'" />
            <div class="info">
                <div class="title">${item.title}</div>
                <div class="meta"><i class="fa-solid fa-user"></i> ${item.author} <span style="margin:0 4px;">•</span> <i class="fa-solid fa-clock"></i> ${item.date}</div>
            </div>
            <i class="fa-solid fa-arrow-right" style="color:var(--accent-1);"></i>
        </div>
    `).join('');
}

function loadHistory() { renderHistory(); }

function reDownload(url) {
    if (url) {
        DOM.urlInput.value = url;
        processDownload();
        showNotif('📥 Memuat ulang...');
    }
}

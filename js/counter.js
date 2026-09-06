let totalDownloads = 0;

function loadCounter() {
    try { totalDownloads = parseInt(localStorage.getItem('zenvs-total-downloads') || '0'); } catch(e) {}
    updateDownloadCounter();
}

function incrementDownloadCount() {
    totalDownloads++;
    try { localStorage.setItem('zenvs-total-downloads', totalDownloads); } catch(e) {}
    updateDownloadCounter();
}

function updateDownloadCounter() {
    if (DOM.downloadCount) {
        DOM.downloadCount.textContent = totalDownloads.toLocaleString();
    }
}

loadCounter();

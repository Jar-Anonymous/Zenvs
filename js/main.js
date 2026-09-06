const CONFIG = {
    APP_NAME: 'Zenvs',
    APP_URL: 'https://zenvs.vercel.app',
    VKR_API: 'https://vkrdownloader.org/server',
    VKR_KEY: 'vkrdownloader',
    NEXRAY_API: 'https://api.nexray.eu.cc/downloader/aio',
    MAX_HISTORY: 20,
    SHARE_TEXT: '🔥 Zenvs - Download video dari semua platform! Gratis, tanpa watermark! 🚀'
};

const DOM = {};

function initDOM() {
    const ids = [
        'urlInput', 'btnAction', 'resultArea', 'contentList',
        'errorBox', 'errorText', 'loading', 'skeletonContainer',
        'progressContainer', 'progressFill', 'speedIndicator',
        'speedValue', 'progressPercent', 'previewThumb',
        'previewAuthor', 'previewTitle', 'previewMeta',
        'featuresRow', 'downloadCount', 'historyContainer',
        'toastOverlay', 'toastContent', 'copySuccess',
        'sidebar', 'sidebarOverlay', 'themeIcon',
        'shareOverlay', 'infoModal', 'previewModal',
        'previewVideo', 'previewTitleModal', 'previewAuthorModal',
        'previewDuration'
    ];
    ids.forEach(id => { DOM[id] = document.getElementById(id); });
}

document.addEventListener('DOMContentLoaded', function() {
    initDOM();
    console.log('🚀 Zenvs Ultimate v3.0 loaded!');
    loadTheme();
    loadHistory();
    updateDownloadCounter();
    loadCounter();
    if (DOM.urlInput) {
        DOM.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') processDownload();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); processDownload(); }
        if (e.ctrlKey && e.key === 'r') { e.preventDefault(); resetForm(); }
        if (e.key === 'Escape') { closePreview(); closeSidebar(); }
    });
    setTimeout(() => { if (DOM.toastOverlay && DOM.toastContent) showToastStep(0); }, 1500);
    console.log('✅ Semua sistem siap!');
});

window.processDownload = processDownload;
window.resetForm = resetForm;
window.pasteText = pasteText;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.toggleTheme = toggleTheme;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.nativeShare = nativeShare;
window.copyLink = copyLink;
window.shareTo = shareTo;
window.openAbout = openAbout;
window.closeInfoModal = closeInfoModal;
window.openChannelWA = openChannelWA;
window.openPreview = openPreview;
window.closePreview = closePreview;
window.directDownload = directDownload;
window.reDownload = reDownload;

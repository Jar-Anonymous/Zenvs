async function callVKr(url) {
    const apiUrl = `${CONFIG.VKR_API}/?api_key=${CONFIG.VKR_KEY}&vkr=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

async function callNexRay(url) {
    const apiUrl = `${CONFIG.NEXRAY_API}?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

function formatDuration(seconds) {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function formatSize(bytes) {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    if (mb >= 1) return mb.toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
}

function startProgress() {
    DOM.progressContainer.classList.add('active');
    DOM.speedIndicator.classList.add('active');
    DOM.progressFill.style.width = '0%';
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5 + 2;
        if (progress > 95) progress = 95;
        DOM.progressFill.style.width = progress + '%';
        DOM.speedValue.textContent = (Math.random() * 5 + 0.5).toFixed(1);
        DOM.progressPercent.textContent = Math.round(progress) + '%';
    }, 300);
    return interval;
}

function completeProgress(interval) {
    clearInterval(interval);
    DOM.progressFill.style.width = '100%';
    DOM.progressPercent.textContent = '100%';
    setTimeout(() => {
        DOM.progressContainer.classList.remove('active');
        DOM.speedIndicator.classList.remove('active');
        DOM.progressFill.style.width = '0%';
        DOM.progressPercent.textContent = '0%';
    }, 600);
}

function directDownload(url, filename, videoData) {
    if (!url) { showNotif('URL tidak valid!', 'fa-solid fa-circle-exclamation', '#dc2626'); return; }
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const ext = filename ? filename.split('.').pop() : 'mp4';
    const finalName = filename || `Zenvs-Video${randomNum}.${ext}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = finalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    incrementDownloadCount();
    showNotif(`✅ Download: ${finalName}`);
    if (videoData) {
        saveHistory({
            title: videoData.title || finalName,
            author: videoData.author || 'Zenvs',
            thumbnail: videoData.thumbnail || 'https://placehold.co/100x100',
            url: url
        });
    }
}

async function processDownload() {
    playClickSound();
    hideError();
    const url = DOM.urlInput.value.trim();
    if (!url) { showError('Masukkan link dulu!'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        showError('Masukkan link yang valid');
        return;
    }
    DOM.btnAction.disabled = true;
    DOM.btnAction.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i>`;
    DOM.loading.classList.remove('hidden');
    DOM.skeletonContainer.classList.remove('hidden');
    DOM.resultArea.classList.add('hidden');
    const progressInterval = startProgress();
    let data = null, usedApi = '';
    try {
        try {
            data = await callVKr(url);
            usedApi = 'VKr';
            if (data.error || !data.source) throw new Error('VKr error');
        } catch(vkrError) {
            showNotif('Mencoba NexRay...', 'fa-solid fa-spinner', '#f59e0b');
            try {
                data = await callNexRay(url);
                usedApi = 'NexRay';
                if (!data.status || !data.result) throw new Error('NexRay error');
            } catch(nexError) {
                throw new Error('Semua API gagal');
            }
        }
        completeProgress(progressInterval);
        if (usedApi === 'VKr') renderVKrResult(data);
        else if (usedApi === 'NexRay') renderNexRayResult(data);
        DOM.resultArea.classList.remove('hidden');
        DOM.featuresRow.classList.add('hidden');
        renderHistory();
    } catch(err) {
        completeProgress(progressInterval);
        showError('Gagal: ' + err.message);
    } finally {
        DOM.loading.classList.add('hidden');
        DOM.skeletonContainer.classList.add('hidden');
        DOM.btnAction.disabled = false;
        DOM.btnAction.innerHTML = `<i class="fa-solid fa-download"></i> Ambil`;
    }
}

function renderVKrResult(data) {
    const videoUrl = data.source || data.url;
    const title = data.title || 'Video Zenvs';
    const author = data.author || data.uploader || 'Unknown';
    const thumbnail = data.thumbnail || data.thumb || 'https://placehold.co/480x360';
    const duration = data.duration || '00:00';
    const videoData = { title, author, thumbnail, url: videoUrl };
    DOM.previewThumb.src = thumbnail;
    DOM.previewAuthor.innerText = author;
    DOM.previewTitle.innerText = title;
    DOM.previewMeta.innerText = `Durasi: ${duration} | Author: ${author}`;
    let html = '';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const fileName = `Zenvs-Video${randomNum}.mp4`;
    html += `
        <div style="display:flex;gap:8px;align-items:center;">
            <button onclick="openPreview('${videoUrl}','${title}','${author}','${duration}')" 
                    class="dl-btn" style="flex:0;width:auto;padding:0.4rem 0.8rem;border-radius:10px;">
                <i class="fa-solid fa-play" style="color:var(--accent-1);"></i>
            </button>
            <button onclick="directDownload('${videoUrl}','${fileName}',${JSON.stringify(videoData).replace(/"/g,'&quot;')})" 
                    class="dl-btn dl-btn-video text-sm flex items-center justify-between gap-2" style="flex:1;">
                <span><i class="fa-solid fa-video mr-2"></i> Download Video</span>
                <span class="format-badge hd">${data.quality || 'HD'}</span>
            </button>
        </div>
    `;
    if (data.audio) {
        const audioNum = Math.floor(Math.random() * 9000) + 1000;
        const audioName = `Zenvs-Audio${audioNum}.mp3`;
        html += `
            <button onclick="directDownload('${data.audio}','${audioName}',${JSON.stringify(videoData).replace(/"/g,'&quot;')})" 
                    class="dl-btn dl-btn-audio text-sm flex items-center justify-between gap-2" style="margin-top:8px;">
                <span><i class="fa-solid fa-music mr-2"></i> Download Audio</span>
                <span class="format-badge audio">MP3</span>
            </button>
        `;
    }
    DOM.contentList.innerHTML = html;
    saveHistory(videoData);
    showNotif('✅ Media ditemukan!');
}

function renderNexRayResult(data) {
    const d = data.result;
    const videoData = {
        title: d.title || 'Video Zenvs',
        author: d.author || d.unique_id || 'Unknown',
        thumbnail: d.thumbnail || 'https://placehold.co/480x360',
        url: url
    };
    DOM.previewThumb.src = videoData.thumbnail;
    DOM.previewAuthor.innerText = videoData.author;
    DOM.previewTitle.innerText = videoData.title;
    DOM.previewMeta.innerText = `Durasi: ${formatDuration(d.duration)} | Author: ${videoData.author}`;
    let html = '';
    if (d.medias && d.medias.length > 0) {
        const videos = d.medias.filter(m => m.type === 'video');
        const audios = d.medias.filter(m => m.type === 'audio');
        const images = d.medias.filter(m => m.type === 'image');
        const sortedVideos = videos.sort((a,b) => {
            const qA = a.quality || '', qB = b.quality || '';
            if (qA.includes('hd') && !qB.includes('hd')) return -1;
            if (!qA.includes('hd') && qB.includes('hd')) return 1;
            if (qA.includes('no_watermark') && !qB.includes('no_watermark')) return -1;
            if (!qA.includes('no_watermark') && qB.includes('no_watermark')) return 1;
            return 0;
        });
        const bestVideos = sortedVideos.slice(0, 5);
        bestVideos.forEach((media, idx) => {
            const isHD = media.quality && media.quality.includes('hd');
            const isNoWatermark = media.quality && media.quality.includes('no_watermark');
            let label = media.quality || (media.width ? `${media.width}p` : 'Video');
            if (media.quality) label = media.quality.replace(/_/g,' ').toUpperCase();
            const size = media.data_size ? ` (${formatSize(media.data_size)})` : '';
            const badgeClass = isHD ? 'hd' : (isNoWatermark ? 'sd' : 'sd');
            const badgeText = isHD ? 'HD' : (isNoWatermark ? 'NW' : 'SD');
            const ext = media.extension || 'mp4';
            const randomNum = Math.floor(Math.random() * 9000) + 1000;
            const fileName = `Zenvs-Video${randomNum}.${ext}`;
            html += `
                <div style="display:flex;gap:8px;align-items:center;">
                    <button onclick="openPreview('${media.url}','${d.title || 'Video'}','${d.author || ''}','${formatDuration(d.duration)}')" 
                            class="dl-btn" style="flex:0;width:auto;padding:0.4rem 0.8rem;border-radius:10px;">
                        <i class="fa-solid fa-play" style="color:var(--accent-1);"></i>
                    </button>
                    <button onclick="directDownload('${media.url}','${fileName}',${JSON.stringify(videoData).replace(/"/g,'&quot;')})" 
                            class="dl-btn dl-btn-video text-sm flex items-center justify-between gap-2" style="flex:1;">
                        <span><i class="fa-solid fa-video mr-2"></i> ${label} ${size}</span>
                        <span class="format-badge ${badgeClass}">${badgeText}</span>
                    </button>
                </div>
            `;
        });
        const bestAudios = audios.slice(0, 3);
        bestAudios.forEach((media, idx) => {
            const label = media.quality || 'Audio';
            const ext = media.extension || 'mp3';
            const randomNum = Math.floor(Math.random() * 9000) + 1000;
            const fileName = `Zenvs-Audio${randomNum}.${ext}`;
            html += `
                <button onclick="directDownload('${media.url}','${fileName}',${JSON.stringify(videoData).replace(/"/g,'&quot;')})" 
                        class="dl-btn dl-btn-audio text-sm flex items-center justify-between gap-2">
                    <span><i class="fa-solid fa-music mr-2"></i> ${label}</span>
                    <span class="format-badge audio">AUDIO</span>
                </button>
            `;
        });
        if (images.length > 0) {
            images.forEach((img, idx) => {
                const ext = 'jpg';
                const randomNum = Math.floor(Math.random() * 9000) + 1000;
                const fileName = `Zenvs-Photo${randomNum}.${ext}`;
                html += `
                    <div class="flex items-center justify-between" 
                         style="background:var(--glass);padding:0.6rem 0.8rem;border:2px solid var(--border);gap:0.8rem;border-radius:12px;">
                        <div class="flex items-center gap-3 overflow-hidden min-w-0">
                            <img src="${img.url}" alt="Foto" class="w-12 h-12 object-cover" style="border:2px solid var(--border);border-radius:8px;flex-shrink:0;" />
                            <span class="text-sm font-bold truncate">Foto #${idx+1}</span>
                        </div>
                        <button onclick="directDownload('${img.url}','${fileName}',${JSON.stringify(videoData).replace(/"/g,'&quot;')})" 
                                class="dl-btn dl-btn-primary text-sm flex items-center gap-1.5" style="width:auto;padding:0.4rem 1.2rem;border-radius:10px;"> 
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>
                `;
            });
        }
        saveHistory(videoData);
    }
    DOM.contentList.innerHTML = html;
    showNotif('✅ Media ditemukan!');
}

function resetForm() {
    playClickSound();
    DOM.resultArea.classList.add('hidden');
    DOM.featuresRow.classList.remove('hidden');
    DOM.urlInput.value = '';
    hideError();
}

(function createParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    const colors = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)'];
    for (let i = 0; i < 16; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 4 + Math.random() * 20;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (15 + Math.random() * 25) + 's';
        p.style.animationDelay = (Math.random() * 20) + 's';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.opacity = 0.04 + Math.random() * 0.08;
        container.appendChild(p);
    }
})();

// Scroll reveal
document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
});

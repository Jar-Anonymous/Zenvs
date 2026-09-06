(function cursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();

// Tilt cards
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y*12}deg) rotateY(${x*12}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Sparkle on click
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✦';
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX + (Math.random() - 0.5) * 60}px;
            top: ${e.clientY + (Math.random() - 0.5) * 60}px;
            font-size: ${8 + Math.random() * 16}px;
            color: ${['var(--accent-1)','var(--accent-2)','var(--accent-3)','var(--accent-4)'][Math.floor(Math.random()*4)]};
            pointer-events: none;
            z-index: 9999;
            animation: sparkleBurst 0.8s ease forwards;
            font-family: sans-serif;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleBurst {
        0% { opacity:1; transform:translate(0,0) scale(0.5) rotate(0deg); }
        100% { opacity:0; transform:translate(var(--tx,40px), var(--ty,-60px)) scale(1.5) rotate(180deg); }
    }
`;
document.head.appendChild(style);

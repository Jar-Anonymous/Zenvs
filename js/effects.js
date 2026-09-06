// ============================================================
// EFFECTS - Efek Interaktif Premium
// ============================================================

// ===== CURSOR GLOW =====
(function cursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
    });
})();

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const max = 12;
        const moveX = (x / rect.width) * max;
        const moveY = (y / rect.height) * max;
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.ripple-effect').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--x', x + '%');
        el.style.setProperty('--y', y + '%');
    });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== PARALLAX =====
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    document.querySelectorAll('.parallax').forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.05;
        const moveX = x * 20 * speed;
        const moveY = y * 20 * speed;
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ===== TILT CARD =====
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = y * 20;
        const rotateY = x * 20;
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== GLOW BUTTON =====
document.querySelectorAll('.glow-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--glow-x', x + '%');
        btn.style.setProperty('--glow-y', y + '%');
    });
});

// ===== TYPEWRITER EFFECT (Premium) =====
function typeWriter(element, texts, speed = 80) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, speed / 2);
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== SPARKLE TRAIL =====
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✦';
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX + (Math.random() - 0.5) * 60}px;
            top: ${e.clientY + (Math.random() - 0.5) * 60}px;
            font-size: ${8 + Math.random() * 16}px;
            color: ${['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)', 'var(--accent-4)'][Math.floor(Math.random() * 4)]};
            pointer-events: none;
            z-index: 9999;
            animation: sparkleBurst 0.8s ease forwards;
            font-family: sans-serif;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }
});

// ===== SPARKLE BURST KEYFRAME =====
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleBurst {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx, 40px), var(--ty, -60px)) scale(1.5) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX SCROLL =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax-scroll').forEach(el => {
        const speed = el.dataset.speed || 0.3;
        const y = scrolled * speed;
        el.style.transform = `translateY(${y}px)`;
    });
});

console.log('✨ Efek premium Zenvs loaded!');

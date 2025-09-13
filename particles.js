function createParticles(x, y, parent) {
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
        const dx = (Math.random()-0.5) * 100 + 'px';
        const dy = (Math.random()-0.5) * 100 + 'px';
        p.style.setProperty('--x', dx);
        p.style.setProperty('--y', dy);
        parent.appendChild(p);
        setTimeout(() => parent.removeChild(p), 500);
    }
}
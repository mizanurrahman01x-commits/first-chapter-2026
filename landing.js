// js/landing.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Hide loader after 2.5 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (mainContent) mainContent.classList.remove('hidden');
            }, 800); // Wait for fade out
        }
    }, 2500);

    // 2. Audio Button Logic
    const audioBtn = document.getElementById('audio-toggle');
    let isPlaying = false;

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const audio = new Audio('assets/welcome.mp3'); // Make sure you have this file!
            
            if (!isPlaying) {
                audio.play().catch(e => console.log("Audio file not found or blocked."));
                audioBtn.innerHTML = '<span class="icon">❚❚</span>'; // Pause icon
                isPlaying = true;
            } else {
                audio.pause();
                audioBtn.innerHTML = '<span class="icon">▶</span>'; // Play icon
                isPlaying = false;
            }
        });
    }
});
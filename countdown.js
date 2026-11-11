// js/countdown.js
import { EVENT_CONFIG } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const countdownDate = new Date(EVENT_CONFIG.date).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            // Event has started
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const format = (num) => num < 10 ? `0${num}` : num;

        const elDays = document.getElementById("days");
        if (elDays) {
            elDays.innerText = format(days);
            document.getElementById("hours").innerText = format(hours);
            document.getElementById("minutes").innerText = format(minutes);
            document.getElementById("seconds").innerText = format(seconds);
        }
    };

    // Update immediately, then every 1 second
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
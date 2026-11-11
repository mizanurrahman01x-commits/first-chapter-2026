document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if a footer already exists on the page
    let footer = document.querySelector(".global-footer");

    // 2. If not, create it
    if (!footer) {
        footer = document.createElement("footer");
        footer.className = "global-footer";
        
        footer.innerHTML = `
            <p class="credit">Designed & Developed by Meezan Ur Rahman</p>
            <p>Connect on Instagram: <a href="https://instagram.com/meezns" target="_blank" rel="noopener">@meezns</a></p>
        `;

        // 3. Append it to the body (at the very bottom)
        document.body.appendChild(footer);
    }
});
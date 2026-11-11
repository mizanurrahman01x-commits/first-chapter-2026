// js/admin-login.js
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errDiv = document.getElementById('login-error');

    // If already logged in, go straight to dashboard
    onAuthStateChanged(auth, (user) => {
        if (user) window.location.href = 'dashboard.html';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = form.querySelector('button');

        try {
            btn.innerText = "Logging in...";
            btn.disabled = true;
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'dashboard.html';
        } catch (error) {
            errDiv.innerText = "Invalid email or password.";
            errDiv.classList.remove('hidden');
            btn.innerText = "Login";
            btn.disabled = false;
        }
    });
});
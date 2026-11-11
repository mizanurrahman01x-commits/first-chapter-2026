// js/utils.js
export const showError = (id, show) => {
    const el = document.getElementById(`err-${id}`);
    if (el) el.style.display = show ? 'block' : 'none';
    const inputGroup = document.getElementById(id)?.closest('.input-group');
    if (inputGroup) inputGroup.classList.toggle('invalid', show);
};

export const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
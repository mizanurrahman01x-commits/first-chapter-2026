import { db, collection, addDoc, serverTimestamp, query, where, getDocs } from './firebase.js';
// js/questionnaire.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('freshers-form');
    if (!form) return; // Stop if not on the questionnaire page

    const steps = document.querySelectorAll('.form-step');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const progressBar = document.getElementById('progress-bar');
    const currentStepText = document.getElementById('current-step');
    const totalStepsText = document.getElementById('total-steps');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    totalStepsText.innerText = totalSteps;

    // Function to show a specific step
    const showStep = (step) => {
        steps.forEach((el, index) => {
            el.classList.remove('active');
            if (index === step - 1) el.classList.add('active');
        });

        // Update progress
        const progress = (step / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        currentStepText.innerText = step;

        // Toggle buttons
        if (step === 1) btnPrev.style.display = 'none';
        else btnPrev.style.display = 'block';

        if (step === totalSteps) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'block';
        } else {
            btnNext.style.display = 'block';
            btnSubmit.style.display = 'none';
        }
        
        window.scrollTo(0, 0);
    };

    // Simple Validation for current step
    const validateStep = (step) => {
        let isValid = true;
        const currentStepEl = steps[step - 1];
        
        // Check required text inputs
        const requiredInputs = currentStepEl.querySelectorAll('input[required], textarea[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.closest('.input-group').classList.add('invalid');
            } else {
                input.closest('.input-group').classList.remove('invalid');
            }
        });

        // Check roll number pattern
        const rollInput = currentStepEl.querySelector('#rollNumber');
        if (rollInput && rollInput.value && !/^XI-\d{3}$/.test(rollInput.value)) {
            isValid = false;
            rollInput.closest('.input-group').classList.add('invalid');
        }

        // Check at least one subject checkbox
        const subjects = currentStepEl.querySelectorAll('input[name="subjects"]:checked');
        if (step === 2 && subjects.length === 0) {
            isValid = false;
            document.getElementById('err-subjects').style.display = 'block';
        } else if (step === 2) {
            document.getElementById('err-subjects').style.display = 'none';
        }

        // Check consent checkbox
        const consent = currentStepEl.querySelector('#consent');
        if (step === totalSteps && consent && !consent.checked) {
            isValid = false;
            document.getElementById('err-consent').style.display = 'block';
        }

        return isValid;
    };

    // Button Clicks
    btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Form Submission (Temporary alert until Firebase is connected)
    form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    btnSubmit.innerText = "Submitting...";
    btnSubmit.disabled = true;

    // Collect Data
    const formData = new FormData(form);
    const data = {};
    data.subjects = Array.from(form.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value);
    formData.forEach((value, key) => {
        if (key !== 'subjects') data[key] = value;
    });

    try {
        // 1. Check for duplicate Roll Number
        const q = query(collection(db, "registrations"), where("rollNumber", "==", data.rollNumber));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            throw new Error("This Roll Number has already been registered.");
        }

        // 2. Generate a secure random Ticket ID
        const ticketId = "TFC-2026-" + Math.random().toString(36).substr(2, 8).toUpperCase();
        data.ticketId = ticketId;
        data.checkedIn = false;
        data.timestamp = serverTimestamp();

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, "registrations"), data);
        
        // Save to local storage for the Invitation and Ticket pages
        localStorage.setItem('tfc_student_data', JSON.stringify(data));
        
        // Redirect
        window.location.href = 'invitation.html';

    } catch (error) {
        console.error(error);
        const errDiv = document.getElementById('form-error');
        errDiv.innerText = error.message;
        errDiv.classList.remove('hidden');
        btnSubmit.innerText = "Submit";
        btnSubmit.disabled = false;
    }
});
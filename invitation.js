// js/invitation.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get data from LocalStorage
    const dataStr = localStorage.getItem('tfc_student_data');
    if (!dataStr) {
        alert("No registration data found. Please fill out the questionnaire first.");
        window.location.href = 'questionnaire.html';
        return;
    }
    const data = JSON.parse(dataStr);

    // 2. Inject Name and Roll Number into the card
    document.getElementById('display-name').innerText = data.fullName;
    document.getElementById('display-roll').innerText = data.rollNumber;

    // 3. Download PNG
    const btnPng = document.getElementById('btn-download-png');
    btnPng.addEventListener('click', () => {
        const card = document.getElementById('invitation-card');
        html2canvas(card, { scale: 2, backgroundColor: "#0a0a0a" }).then(canvas => {
            const link = document.createElement('a');
            link.download = `TFC2026_Invitation_${data.fullName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });

    // 4. Download PDF
    const btnPdf = document.getElementById('btn-download-pdf');
    btnPdf.addEventListener('click', () => {
        const card = document.getElementById('invitation-card');
        html2canvas(card, { scale: 2, backgroundColor: "#0a0a0a" }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate image dimensions to fit A4
            const imgWidth = 190; // A4 width in mm is 210, leaving margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`TFC2026_Invitation_${data.fullName.replace(/\s+/g, '_')}.pdf`);
        });
    });
});
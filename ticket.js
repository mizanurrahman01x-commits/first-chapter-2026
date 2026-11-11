// js/ticket.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get data from LocalStorage
    const dataStr = localStorage.getItem('tfc_student_data');
    if (!dataStr) {
        window.location.href = 'questionnaire.html';
        return;
    }
    const data = JSON.parse(dataStr);

    const ticketId = data.ticketId;
    const randomId = Math.floor(100 + Math.random() * 900); 
    const ticketId = `TFC-2026-${randomId}`;

    // 3. Inject data into Ticket UI
    document.getElementById('ticket-name').innerText = data.fullName;
    document.getElementById('ticket-id').innerText = ticketId;

    // 4. Generate QR Code
    // The QR code only contains the Ticket ID, not personal info (Security requirement)
    new QRCode(document.getElementById("qrcode"), {
        text: ticketId,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 5. Save Ticket as Image
    const btnDownload = document.getElementById('btn-download-ticket');
    btnDownload.addEventListener('click', () => {
        const ticketCard = document.getElementById('ticket-card');
        html2canvas(ticketCard, { scale: 2, backgroundColor: "#121212" }).then(canvas => {
            const link = document.createElement('a');
            link.download = `TFC2026_Ticket_${data.fullName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });
});
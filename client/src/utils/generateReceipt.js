import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * generateReceipt — Generates a professional PDF appointment receipt
 * @param {Object} appointment - The appointment object
 */
const generateReceipt = (appointment) => {
  const {
    _id,
    patientName,
    doctor,
    department,
    date,
    slot,
    status,
    createdAt,
  } = appointment;

  const doctorName = doctor?.name || 'Doctor';
  const deptName = department?.name || 'General';
  const fee = doctor?.consultationFee || 0;
  const appointmentId = String(_id).slice(-8).toUpperCase();
  const bookedOn = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'N/A';

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ── HEADER BLOCK ────────────────────────────────────────────────────────────
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 0, pageW, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CareSync', pageW / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Hospital Appointment Receipt', pageW / 2, 24, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254); // light blue
  doc.text(`Appointment ID: #${appointmentId}`, pageW / 2, 31, { align: 'center' });
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    pageW / 2, 37, { align: 'center' }
  );

  // ── STATUS BADGE ─────────────────────────────────────────────────────────────
  const isConfirmed = status === 'confirmed';
  const isCompleted = status === 'completed';
  const badgeColor = isConfirmed ? [16, 185, 129] : isCompleted ? [37, 99, 235] : [244, 63, 94];
  const badgeText = isConfirmed
    ? '✓ CONFIRMED'
    : isCompleted
    ? '✓ COMPLETED'
    : status.toUpperCase();

  doc.setFillColor(...badgeColor);
  doc.roundedRect(pageW / 2 - 22, 45, 44, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(badgeText, pageW / 2, 51.5, { align: 'center' });

  // ── APPOINTMENT DETAILS TABLE ────────────────────────────────────────────────
  autoTable(doc, {
    startY: 62,
    head: [['Field', 'Details']],
    body: [
      ['Patient Name', patientName || 'N/A'],
      ['Doctor', doctorName],
      ['Specialty', deptName],
      ['Appointment Date', date || 'N/A'],
      ['Time Slot', slot || 'N/A'],
      ['Consultation Fee', `Rs. ${fee}`],
      ['Status', (status || 'unknown').toUpperCase()],
      ['Booked On', bookedOn],
    ],
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60, textColor: [71, 85, 105] },
      1: { textColor: [15, 23, 42], fontStyle: 'normal' },
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
    },
    margin: { left: 20, right: 20 },
  });

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const footerY = doc.lastAutoTable.finalY + 12;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, pageW - 20, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Thank you for choosing CareSync', pageW / 2, footerY + 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('For support: support@caresync.com', pageW / 2, footerY + 16, { align: 'center' });
  doc.text('© 2024 CareSync — All rights reserved', pageW / 2, footerY + 22, { align: 'center' });

  // ── SAVE ─────────────────────────────────────────────────────────────────────
  doc.save(`CareSync_Receipt_${appointmentId}.pdf`);
};

export default generateReceipt;

import jsPDF from 'jspdf';

export const downloadReceiptPDF = async (donation) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add Background Color / Border
  doc.setDrawColor(249, 115, 22); // Saffron color
  doc.setLineWidth(1.5);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  
  // Inner border
  doc.setDrawColor(255, 215, 0); // Gold color
  doc.setLineWidth(0.5);
  doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

  // Helper to load image
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  };

  // Try loading the logo
  try {
    const logo = await loadImage('/logo.png');
    if (logo) {
      // Draw logo centered at top
      doc.addImage(logo, 'PNG', (pageWidth / 2) - 12, 10, 24, 24);
    }
  } catch(e) {
    console.warn('Logo could not be loaded into PDF', e);
  }

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38); // Dark Red
  let startY = 40;
  doc.text('Mata Kali Sadanand Sadbhavana Trust', pageWidth / 2, startY, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Registration No: MKSST-2026', pageWidth / 2, startY + 5, { align: 'center' });
  doc.text('Mata Kali Dham, Sirathu, Kaushambi', pageWidth / 2, startY + 10, { align: 'center' });

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(15, startY + 15, pageWidth - 15, startY + 15);

  // Receipt Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('DONATION RECEIPT', pageWidth / 2, startY + 25, { align: 'center' });

  // Details Wrapper Settings
  doc.setFontSize(11);
  const leftX = 15;
  const valueX = 50;
  let detailY = startY + 38;
  const rowH = 8;
  
  // Data Mapping
  const receiptNo = donation.receiptId || \`RCPT-MKS-\${Math.floor(Math.random() * 899999 + 100000)}\`;
  const dateStr = donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const donorName = donation.name || 'Anonymous';
  const amount = donation.amount ? \`Rs. \${donation.amount.toLocaleString()}\` : '-';
  const paymentMode = donation.method ? donation.method.toUpperCase() : '-';
  const txnId = donation.transactionId || donation.paymentId || 'N/A';

  const details = [
    { label: 'Receipt No. :', value: receiptNo },
    { label: 'Date :', value: dateStr },
    { label: 'Received from :', value: donorName },
    { label: 'Amount :', value: amount },
    { label: 'Payment Mode :', value: paymentMode },
    { label: 'Transaction ID :', value: txnId }
  ];

  details.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, leftX, detailY);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, valueX, detailY);
    detailY += rowH;
  });

  // Footer / Signatory
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('May Maa Kali bless you and your family.', pageWidth / 2, detailY + 15, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text('Authorized Signatory', pageWidth - 15, pageHeight - 15, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('* This is a computer generated receipt.', pageWidth / 2, pageHeight - 12, { align: 'center' });

  // Trigger Download
  doc.save(\`Receipt_\${receiptNo}.pdf\`);
};

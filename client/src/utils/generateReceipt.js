import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"; // We will use HTML rendering to fix Hindi text shaping!

export const downloadReceiptPDF = async (donation) => {
  // Data Mapping
  const receiptNo = donation.receiptId || `RCPT-${Math.floor(Math.random() * 100000)}`;
  const dateStr = new Date().toLocaleDateString("hi-IN");

  // To fix Hindi character rendering (Text Shaping), we map it into HTML first. 
  // jsPDF's built-in text drawing does not support complex devanagari characters (like Half letters and Matras).
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";

  // A5 dimensions for rendering (width: 148mm, height: 210mm) -> Scale to ~ 560 x 794
  container.innerHTML = `
    <div id="receipt-capture-box" style="width: 560px; height: 794px; background: white; padding: 15px; box-sizing: border-box; font-family: 'Noto Sans Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif;">
       <div style="border: 4px solid #f97316; height: 100%; box-sizing: border-box; padding: 4px;">
           <div style="border: 2px solid #ffd700; height: 100%; box-sizing: border-box; padding: 30px; position: relative;">
               
               <!-- Header -->
               <div style="text-align: center; margin-top: 10px;">
                   <img src="/logo.png" alt="Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;" />
                   <h1 style="color: #dc2626; font-size: 26px; margin: 0; font-weight: bold;">माता काली सदानंद सद्भावना ट्रस्ट</h1>
                   <p style="color: #444; font-size: 14px; margin: 8px 0 0 0;">पंजीकरण संख्या : MKSST-2026</p>
                   <p style="color: #444; font-size: 14px; margin: 4px 0 0 0;">माता काली धाम, आंबा सदानंद का पूरा कौंधियारा, प्रयागराज</p>
               </div>

               <!-- Divider -->
               <hr style="margin: 25px 0; border: 0; border-top: 1.5px solid #ccc;" />

               <!-- Title -->
               <div style="text-align: center; margin-bottom: 30px;">
                   <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #000;">दान रसीद</h2>
               </div>

               <!-- Table Data -->
               <table style="width: 100%; font-size: 16px; border-collapse: separate; border-spacing: 0 12px; color: #000;">
                   <tr>
                       <td style="width: 45%; font-weight: bold;">रसीद संख्या :</td>
                       <td style="width: 55%;">${receiptNo}</td>
                   </tr>
                   <tr>
                       <td style="font-weight: bold;">दिनांक :</td>
                       <td>${dateStr}</td>
                   </tr>
                   <tr>
                       <td style="font-weight: bold;">दानदाता का नाम :</td>
                       <td>${donation.name || "आपका नाम"}</td>
                   </tr>
                   <tr>
                       <td style="font-weight: bold;">दान राशि :</td>
                       <td>₹ ${donation.amount || "-"}</td>
                   </tr>
                   <tr>
                       <td style="font-weight: bold;">भुगतान माध्यम :</td>
                       <td>${donation.method || "ऑनलाइन"}</td>
                   </tr>
                   <tr>
                       <td style="font-weight: bold;">लेन-देन आईडी :</td>
                       <td>${donation.transactionId || "N/A"}</td>
                   </tr>
               </table>

               <!-- Bottom Blessing -->
               <div style="position: absolute; bottom: 100px; width: calc(100% - 60px); text-align: center;">
                 <p style="font-size: 15px; margin: 0; color: #000;">माँ काली की कृपा आप एवं आपके परिवार पर सदैव बनी रहे।</p>
               </div>

               <!-- Signature -->
               <div style="position: absolute; bottom: 50px; right: 30px;">
                   <p style="font-weight: bold; margin: 0; font-size: 16px; color: #000;">अधिकृत हस्ताक्षरकर्ता</p>
               </div>

               <!-- Disclaimer -->
               <div style="position: absolute; bottom: 20px; width: calc(100% - 60px); text-align: center;">
                   <p style="color: #777; font-size: 12px; margin: 0;">यह रसीद ट्रस्ट द्वारा डिजिटल रूप से जारी की गई है एवं मान्य है।</p>
               </div>
           </div>
       </div>
    </div>
  `;

  document.body.appendChild(container);

  // Use HTML2Canvas to capture the perfectly formatted Hindi Text
  const element = document.getElementById("receipt-capture-box");
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  
  // Cleanup
  document.body.removeChild(container);

  // Generate jsPDF and paste image
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();
  
  doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  doc.save(`Receipt_${receiptNo}.pdf`);
};
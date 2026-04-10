import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateInvoicePDF = async (order) => {
  const element = document.createElement('div');
  element.style.padding = '40px';
  element.style.width = '800px';
  element.style.background = 'white';
  element.style.color = '#1f2937';
  element.style.fontFamily = 'Arial, sans-serif';

  element.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px;">
      <div>
        <h1 style="margin: 0; color: #7c3aed; font-size: 28px;">BRAND</h1>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">El Emeği & Tasarım Pazaryeri</p>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; font-size: 20px;">FATURA</h2>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">#${order.id}</p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
      <div>
        <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #9ca3af;">Müşteri Bilgileri</h3>
        <p style="margin: 0; font-weight: bold;">Başak Şimşek</p>
        <p style="margin: 5px 0; font-size: 13px; color: #4b5563; max-width: 250px;">${order.deliveryAddress}</p>
        <p style="margin: 0; font-size: 13px; color: #4b5563;">+90 555 123 45 67</p>
      </div>
      <div style="text-align: right;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #9ca3af;">Sipariş Detayları</h3>
        <p style="margin: 0; font-size: 13px;"><strong>Tarih:</strong> ${new Date(order.date).toLocaleDateString('tr-TR')}</p>
        <p style="margin: 5px 0; font-size: 13px;"><strong>Ödeme:</strong> ${order.paymentMethod}</p>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="border-bottom: 1px solid #e5e7eb; text-align: left;">
          <th style="padding: 12px 0; font-size: 13px; color: #6b7280;">Ürün Açıklaması</th>
          <th style="padding: 12px 0; font-size: 13px; color: #6b7280; text-align: center;">Adet</th>
          <th style="padding: 12px 0; font-size: 13px; color: #6b7280; text-align: right;">Birim Fiyat</th>
          <th style="padding: 12px 0; font-size: 13px; color: #6b7280; text-align: right;">Toplam</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 15px 0;">
              <p style="margin: 0; font-weight: bold; font-size: 14px;">${item.name}</p>
              ${item.color ? `<span style="font-size: 12px; color: #6b7280;">Renk: ${item.color}</span>` : ''}
              ${item.size ? `<span style="font-size: 12px; color: #6b7280; margin-left: 10px;">Beden: ${item.size}</span>` : ''}
            </td>
            <td style="padding: 15px 0; text-align: center; font-size: 14px;">${item.quantity}</td>
            <td style="padding: 15px 0; text-align: right; font-size: 14px;">${item.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
            <td style="padding: 15px 0; text-align: right; font-size: 14px; font-weight: bold;">${(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 250px; background: #f9fafb; padding: 20px; rounded: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #4b5563;">
          <span>Ara Toplam</span>
          <span>${(order.total * 0.8).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #4b5563;">
          <span>KDV (%20)</span>
          <span>${(order.total * 0.2).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px; color: #059669; font-weight: bold;">
          <span>Kargo</span>
          <span>Ücretsiz</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-t: 1px solid #e5e7eb; pt: 15px; font-size: 18px; font-weight: bold; color: #111827;">
          <span>Toplam</span>
          <span>${order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 50px; border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
      <p>Bu fatura elektronik ortamda oluşturulmuştur.</p>
      <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
    </div>
  `;

  document.body.appendChild(element);
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Fatura-${order.id}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};
